import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { getSessionUser } from "@/lib/session";
import {
  expirePaymentIfNeeded,
  finalizePaymentSuccess,
  toPublicPayment,
  xofIsSuccess,
  type PaymentRecord,
} from "@/lib/payments";
import { getTransactionStatus, xoftwareConfigured } from "@/lib/xoftware";

const RECONCILE_INTERVAL_MS = 5 * 60 * 1000;

// GET /api/payments/status?ref=...
// Source of truth payment ada di backend. Frontend cukup polling endpoint ini;
// query param seperti ?success=true tidak pernah dipercaya.
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref") ?? "";
  if (!ref) {
    return NextResponse.json({ error: "Parameter ref wajib diisi" }, { status: 400 });
  }

  const db = getDb();
  const payRef = db.collection("payments").doc(ref);
  const snap = await payRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Pembayaran tidak ditemukan" }, { status: 404 });
  }

  const payment = snap.data() as PaymentRecord;
  if (payment.uid !== user.uid) {
    return NextResponse.json({ error: "Pembayaran bukan milik Anda" }, { status: 403 });
  }

  let current = await expirePaymentIfNeeded(payment);
  const now = Date.now();

  // Reconciliation/fallback: webhook bisa telat atau gagal. Cek ke Xoftware sewaktu-waktu (throttle).
  if (
    current.status === "PENDING" &&
    current.transactionId &&
    xoftwareConfigured() &&
    (!current.lastReconciledAtMs || now - current.lastReconciledAtMs > RECONCILE_INTERVAL_MS)
  ) {
    try {
      const status = await getTransactionStatus(current.refId);
      await payRef.update({
        lastReconciledAtMs: now,
        updatedAt: now,
      });
      if (xofIsSuccess(status)) {
        const result = await finalizePaymentSuccess({
          refId: current.refId,
          amount: status.amount ?? current.amount,
          transactionId: status.transaction_id,
          paidAt: status.paid_at ? Date.parse(status.paid_at) || undefined : undefined,
        });
        if (
          result.outcome === "ok" ||
          result.outcome === "already"
        ) {
          current = (await payRef.get()).data() as PaymentRecord;
        }
      }
    } catch (err) {
      // Jangan putus polling; webhook tetap jadi jalur utama.
      console.error("[api/payments/status] reconcile gagal:", (err as Error)?.message ?? err);
    }
  }

  const userSnap = await db.collection("users").doc(user.uid).get();
  const subscription = {
    subscriptionStatus: (userSnap.data()?.subscriptionStatus as string | undefined) ?? null,
    expiresAtMs: (userSnap.data()?.expiresAtMs as number | undefined) ?? 0,
  };

  return NextResponse.json({
    ok: true,
    payment: toPublicPayment(current),
    subscription,
  });
}