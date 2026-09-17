import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";

interface MayarWebhook {
  event?: string;
  data?: {
    id?: string;
    status?: boolean;
    merchantId?: string;
    customerName?: string;
    customerEmail?: string;
    customerMobile?: string;
    amount?: number;
    productName?: string;
  };
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export async function POST(req: Request) {
  let payload: MayarWebhook;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = payload.data ?? {};

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const db = getDb();

  const webhookId = data.id ?? `wh-${Date.now()}`;
  await db
    .collection("webhooks")
    .doc(String(webhookId))
    .set(
      {
        receivedAt: FieldValue.serverTimestamp(),
        raw: payload,
      },
      { merge: true },
    );

  if (process.env.MAYAR_MERCHANT_ID && data.merchantId) {
    if (data.merchantId !== process.env.MAYAR_MERCHANT_ID) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  if (payload.event !== "payment.received" || data.status !== true) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const email = data.customerEmail?.trim().toLowerCase();
  const amount = data.amount;
  const mobile = data.customerMobile?.trim();

  if (!email) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  let snapshot;
  try {
    snapshot = await db
      .collection("orders")
      .where("email", "==", email)
      .where("status", "==", "pending")
      .orderBy("createdAt", "desc")
      .limit(12)
      .get();
  } catch (err) {
    console.error("[api/mayar/webhook] query error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const match = snapshot.docs.find((doc) => {
    const order = doc.data();
    const created = order.createdAt?.toMillis?.() ?? 0;
    const recent = created > 0 && Date.now() - created < TWO_HOURS_MS;
    if (!recent) return false;

    if (amount !== undefined && order.amount !== amount) return false;
    if (mobile && order.mobile && order.mobile !== mobile) return false;
    return true;
  });

  if (!match) {
    return NextResponse.json({ ok: true, unmatched: true });
  }

  const order = match.data();
  const months = Number(order.months) || 1;
  const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

  await match.ref.update({
    status: "active",
    activatedAt: FieldValue.serverTimestamp(),
    expiresAt,
    mayarWebhookId: String(webhookId),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, activated: true, orderRef: order.orderRef });
}