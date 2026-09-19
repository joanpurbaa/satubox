import { randomBytes } from "crypto";
import { getDb } from "./firebase";
import { xoftwareConfigured, createTransaction, type CreateTransactionPayload } from "./xoftware";

// Runtime database project = Firestore. Prisma lama (model Order) tidak dipakai.

export const PAYMENTS_COLLECTION = "payments";
export const WEBHOOK_EVENTS_COLLECTION = "webhook_events";

export const PAYMENT_EXPIRY_MINUTES = 30;

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
export type SubscriptionStatus = "PENDING_PAYMENT" | "ACTIVE";
export type PaymentPurpose = "register" | "renew";

export interface PaymentRecord {
  refId: string;
  uid: string;
  username: string;
  email: string;
  planId: string;
  planLabel: string;
  amount: number;
  durationMonths: number;
  durationUnit: "month" | "minute";
  purpose: PaymentPurpose;
  provider: "xoffice";
  transactionId?: string;
  channelCode?: string;
  status: PaymentStatus;
  qrisText?: string;
  paymentUrl?: string;
  expiresAtMs: number;
  createdAt: number;
  paidAt?: number;
  lastReconciledAtMs?: number;
  updatedAt: number;
}

export function generateRefId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = randomBytes(5).toString("hex").toUpperCase();
  return `SB-${ts}-${rnd}`;
}

export type PaymentPublic = Pick<
  PaymentRecord,
  | "refId"
  | "planId"
  | "planLabel"
  | "amount"
  | "durationMonths"
  | "status"
  | "purpose"
  | "qrisText"
  | "paymentUrl"
  | "expiresAtMs"
  | "createdAt"
  | "paidAt"
  | "transactionId"
  | "channelCode"
>;

export function toPublicPayment(p: PaymentRecord): PaymentPublic {
  return {
    refId: p.refId,
    planId: p.planId,
    planLabel: p.planLabel,
    amount: p.amount,
    durationMonths: p.durationMonths,
    status: p.status,
    purpose: p.purpose,
    qrisText: p.qrisText,
    paymentUrl: p.paymentUrl,
    expiresAtMs: p.expiresAtMs,
    createdAt: p.createdAt,
    paidAt: p.paidAt,
    transactionId: p.transactionId,
    channelCode: p.channelCode,
  };
}

// refId dipakai sebagai id dokumen payments (primary correlation key dengan Xoftware order_id).
export function paymentRef(refId: string) {
  return getDb().collection(PAYMENTS_COLLECTION).doc(refId);
}

// --- Create payment record (PENDING) ---
export interface NewPaymentInput {
  uid: string;
  username: string;
  email: string;
  planId: string;
  planLabel: string;
  amount: number;
  durationMonths: number;
  durationUnit: "month" | "minute";
  purpose: PaymentPurpose;
}

export async function createPaymentRecord(input: NewPaymentInput): Promise<{
  refId: string;
  record: PaymentRecord;
}> {
  const refId = generateRefId();
  const now = Date.now();
  const record: PaymentRecord = {
    refId,
    uid: input.uid,
    username: input.username,
    email: input.email,
    planId: input.planId,
    planLabel: input.planLabel,
    amount: input.amount,
    durationMonths: input.durationMonths,
    durationUnit: input.durationUnit,
    purpose: input.purpose,
    provider: "xoffice",
    status: "PENDING",
    expiresAtMs: now + PAYMENT_EXPIRY_MINUTES * 60 * 1000,
    createdAt: now,
    updatedAt: now,
  };
  await paymentRef(refId).set(record);
  return { refId, record };
}

// --- Open transaction di Xoftware & simpan return-nya ---
export async function openXoftwarePayment(
  refId: string,
  input: NewPaymentInput,
  customer: { id: string; name: string; email: string },
): Promise<{ transactionId: string; qrisText?: string; paymentUrl?: string; channelCode?: string }> {
  if (!xoftwareConfigured()) {
    throw new Error("Xoftware Pay belum dikonfigurasi di server");
  }
  const merchantId = Number(String(process.env.XOFFICE_MERCHANT_ID ?? "").trim());
  if (!Number.isFinite(merchantId)) {
    throw new Error("XOFFICE_MERCHANT_ID tidak valid (harus angka)");
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://satubox.id";
  const payload: CreateTransactionPayload = {
    merchant_id: merchantId,
    channel_code: "QRIS",
    amount: input.amount,
    ref_id: refId,
    fee_direction: "merchant",
    notify_url: `${base}/api/webhook/xoftware`,
    return_url: `${base}/payment/success?ref=${encodeURIComponent(refId)}`,
    expires_in_minutes: PAYMENT_EXPIRY_MINUTES,
    note: `Langganan SatuBox ${input.planLabel}`,
    metadata: {
      customer: { id: customer.id, name: customer.name, email: customer.email },
      products: [
        {
          product_code: input.planId,
          product_name: input.planLabel,
        },
      ],
    },
  };

  const result = await createTransaction(payload);

  const patch: Partial<PaymentRecord> = {
    transactionId: result.transaction_id,
    status: "PENDING",
    channelCode: result.channel_code ?? "QRIS",
    updatedAt: Date.now(),
  };
  if (result.qris_text) patch.qrisText = result.qris_text;
  if (result.url) patch.paymentUrl = result.url;
  await paymentRef(refId).update(patch);

  return {
    transactionId: result.transaction_id,
    qrisText: result.qris_text,
    paymentUrl: result.url,
    channelCode: result.channel_code,
  };
}

function addDuration(baseMs: number, value: number, unit: "month" | "minute"): number {
  if (unit === "minute") return baseMs + value * 60 * 1000;
  const d = new Date(baseMs);
  d.setMonth(d.getMonth() + value);
  return d.getTime();
}

// --- Aktivasi subscription + tandai payment SUCCESS (atomik, anti double-activate) ---
// Dipakai oleh webhook & reconciliation status. Jalankan di dalam db.runTransaction.
export interface FinalizeInput {
  refId: string;
  amount?: number;
  transactionId?: string;
  paidAt?: number;
}

export type FinalizeOutcome =
  | "ok"
  | "not_found"
  | "already"
  | "provider_mismatch"
  | "amount_mismatch"
  | "transaction_mismatch"
  | "activation_skipped_unknown_plan";

export async function finalizePaymentSuccessInTx(
  t: FirebaseFirestore.Transaction,
  input: FinalizeInput,
): Promise<{ outcome: FinalizeOutcome; expiresAtMs?: number }> {
  const db = getDb();
  const payRef = paymentRef(input.refId);
  const paySnap = await t.get(payRef);
  const pay = paySnap.data() as PaymentRecord | undefined;
  if (!paySnap.exists || !pay) return { outcome: "not_found" };

  if (pay.provider !== "xoffice") return { outcome: "provider_mismatch" };
  if (pay.status === "SUCCESS") return { outcome: "already" };
  if (typeof input.amount === "number" && pay.amount !== input.amount) {
    return { outcome: "amount_mismatch" };
  }
  if (input.transactionId && pay.transactionId && pay.transactionId !== input.transactionId) {
    return { outcome: "transaction_mismatch" };
  }

  // Semua read harus selesai sebelum write dalam Firestore transaction.
  const userRef = db.collection("users").doc(pay.uid);
  const userSnap = await t.get(userRef);

  const now = Date.now();
  t.update(payRef, {
    status: "SUCCESS",
    paidAt: input.paidAt ?? now,
    updatedAt: now,
  });

  const currentExpiresAtMs = (userSnap.data()?.expiresAtMs as number | undefined) ?? 0;
  const wasActive = currentExpiresAtMs > now;
  const prevPlanStartedAt = (userSnap.data()?.planStartedAt as number | undefined) ?? now;
  const planStartedAt = wasActive ? prevPlanStartedAt : now;
  const baseExpiry = wasActive ? currentExpiresAtMs : now;
  const newExpiresAtMs = addDuration(baseExpiry, pay.durationMonths, pay.durationUnit);

  t.update(userRef, {
    subscriptionStatus: "ACTIVE",
    planId: pay.planId,
    planLabel: pay.planLabel,
    planAmount: pay.amount,
    planStartedAt,
    expiresAtMs: newExpiresAtMs,
    updatedAt: now,
  });

  return { outcome: "ok", expiresAtMs: newExpiresAtMs };
}

// Wrapper untuk reconciliation (status endpoint) tanpa idempotency webhook-event.
export async function finalizePaymentSuccess(input: FinalizeInput): Promise<{
  outcome: FinalizeOutcome;
  expiresAtMs?: number;
}> {
  const db = getDb();
  let result: { outcome: FinalizeOutcome; expiresAtMs?: number } = { outcome: "not_found" };
  await db.runTransaction(async (t) => {
    result = await finalizePaymentSuccessInTx(t, input);
  });
  return result;
}

// --- Helper query ---
export async function getLatestPaymentForUser(uid: string): Promise<PaymentRecord | null> {
  const db = getDb();
  const snap = await db
    .collection(PAYMENTS_COLLECTION)
    .where("uid", "==", uid)
    .limit(20)
    .get();
  if (snap.empty) return null;
  const all = snap.docs.map((d) => d.data() as PaymentRecord);
  all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  return all[0] ?? null;
}

export async function getLatestPendingPaymentForUser(uid: string): Promise<PaymentRecord | null> {
  const db = getDb();
  const snap = await db
    .collection(PAYMENTS_COLLECTION)
    .where("uid", "==", uid)
    .where("status", "==", "PENDING")
    .limit(10)
    .get();
  if (snap.empty) return null;
  const all = snap.docs.map((d) => d.data() as PaymentRecord);
  all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  return all[0] ?? null;
}

// Tandai payment sebagai EXPIRED bila countdown habis.
export async function expirePaymentIfNeeded(record: PaymentRecord): Promise<PaymentRecord> {
  if (record.status !== "PENDING" || record.expiresAtMs > Date.now()) return record;
  const ref = paymentRef(record.refId);
  const current = await ref.get();
  const data = current.data() as PaymentRecord | undefined;
  if (!data || data.status !== "PENDING" || data.expiresAtMs > Date.now()) {
    return data ?? record;
  }
  const now = Date.now();
  await ref.update({ status: "EXPIRED", updatedAt: now });
  return { ...data, status: "EXPIRED", updatedAt: now };
}

export type XofStatusType =
  | {
      payment_status?: string;
      status?: string;
      amount?: number;
      paid_at?: string;
      transaction_id?: string;
    }
  | undefined;

export function xofIsSuccess(status: XofStatusType): boolean {
  if (!status) return false;
  const ps = String(status.payment_status ?? "").toUpperCase();
  const s = String(status.status ?? "").toUpperCase();
  return ps === "SUCCEEDED" || ps === "SUCCESS" || s === "SUCCESS";
}