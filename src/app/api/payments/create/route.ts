import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { getPlan, PLAN_UNIT } from "@/lib/plans";
import { getSessionUser } from "@/lib/session";
import {
  createPaymentRecord,
  openXoftwarePayment,
  toPublicPayment,
  type PaymentRecord,
} from "@/lib/payments";

interface CreateBody {
  planId?: string;
}

// Sumber kebenaran harga/durasi ada di server-side plan config.
// Endpoint ini menolak amount apapun dari client.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const plan = getPlan(body.planId ?? "");
  if (!plan) {
    return NextResponse.json({ error: "Pilihan durasi tidak ditemukan" }, { status: 400 });
  }

  const db = getDb();
  const userDoc = await db.collection("users").doc(user.uid).get();
  const profile = userDoc.data() as
    | { username?: string; email?: string; expiresAtMs?: number }
    | undefined;
  if (!userDoc.exists || !profile) {
    return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
  }
  const username = profile.username ?? "";
  const email = profile.email ?? user.email;

  const now = Date.now();

  // Idempotent: kalau sudah ada PENDING yang masih valid & sudah punya transaksi, lanjutkan (jangan duplikat).
  const pendingSnap = await db
    .collection("payments")
    .where("uid", "==", user.uid)
    .where("status", "==", "PENDING")
    .limit(10)
    .get();
  const pendings = pendingSnap.docs.map((d) => d.data() as PaymentRecord);
  pendings.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  const reusable = pendings.find(
    (p) =>
      p.planId === plan.id &&
      p.transactionId &&
      p.expiresAtMs > now &&
      p.status === "PENDING",
  );
  if (reusable) {
    return NextResponse.json({
      ok: true,
      reused: true,
      payment: toPublicPayment(reusable),
    });
  }

  const { refId, record } = await createPaymentRecord({
    uid: user.uid,
    username,
    email,
    planId: plan.id,
    planLabel: plan.label,
    amount: plan.amount,
    durationMonths: plan.duration,
    durationUnit: PLAN_UNIT,
    purpose: "renew",
  });

  let transactionReady = true;
  try {
    await openXoftwarePayment(
      refId,
      {
        uid: user.uid,
        username,
        email,
        planId: plan.id,
        planLabel: plan.label,
        amount: plan.amount,
        durationMonths: plan.duration,
        durationUnit: PLAN_UNIT,
        purpose: "renew",
      },
      { id: user.uid, name: username, email },
    );
  } catch (err) {
    transactionReady = false;
    console.error("[api/payments/create] Xoftware gagal:", (err as Error)?.message ?? err);
  }

  const updated = (await db.collection("payments").doc(refId).get()).data() as PaymentRecord;
  return NextResponse.json({
    ok: true,
    reused: false,
    transactionReady,
    payment: toPublicPayment(updated ?? record),
  });
}