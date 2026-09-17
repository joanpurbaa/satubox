import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { createPaymentRequest } from "@/lib/mayar";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { plans } from "@/lib/plans";

export const dynamic = "force-dynamic";

function orderRef() {
  return `SB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; mobile?: string; months?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const mobile = body.mobile?.trim();
  const months = body.months;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }
  if (!months || !(months in plans)) {
    return NextResponse.json(
      { error: "Durasi paket tidak valid" },
      { status: 400 },
    );
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Sistem pembayaran belum aktif. Set konfigurasi Firebase di .env.local lalu deploy ulang.",
      },
      { status: 503 },
    );
  }

  const plan = plans[months as keyof typeof plans];
  const ref = orderRef();

  try {
    const mayar = await createPaymentRequest({
      name,
      email,
      mobile,
      amount: plan.amount,
      description: `SatuBox Paket ${plan.months} Bulan`,
      months: plan.months,
    });

    const db = getDb();
    await db
      .collection("orders")
      .doc(ref)
      .set({
        orderRef: ref,
        name,
        email,
        mobile: mobile ?? null,
        months: plan.months,
        amount: plan.amount,
        status: "pending",
        mayarPaymentId: mayar.paymentId,
        mayarTransactionId: mayar.transactionId,
        expiresAt: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json({ link: mayar.link, orderRef: ref });
  } catch (err) {
    console.error("[api/pay] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat pembayaran" },
      { status: 502 },
    );
  }
}