import { NextResponse } from "next/server";
import { getAuthAdmin, getDb, isFirebaseConfigured } from "@/lib/firebase";
import { getPlan, PLAN_UNIT } from "@/lib/plans";
import {
  createPaymentRecord,
  openXoftwarePayment,
  toPublicPayment,
  type PaymentRecord,
} from "@/lib/payments";

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
  planId?: string;
}

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;

    const username = body.username?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const planId = body.planId ?? "";

    const plan = getPlan(planId);

    if (!USERNAME_RE.test(username)) {
      return NextResponse.json(
        { error: "Username 3-20 karakter (huruf, angka, underscore)" },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }
    if (!plan) {
      return NextResponse.json({ error: "Pilihan durasi tidak ditemukan" }, { status: 400 });
    }

    if (!isFirebaseConfigured()) {
      console.error(
        "[api/auth/register] Firebase Admin belum dikonfigurasi: FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY",
      );
      return NextResponse.json(
        { error: "Server belum dikonfigurasi lengkap. Hubungi admin." },
        { status: 500 },
      );
    }

    const db = getDb();
    const usernameKey = username.toLowerCase();
    const usernameDoc = await db.collection("usernames").doc(usernameKey).get();
    if (usernameDoc.exists) {
      return NextResponse.json({ error: "Username sudah dipakai" }, { status: 409 });
    }

    let uid: string;
    let userEmail: string;
    try {
      const created = await getAuthAdmin().createUser({ email, password });
      uid = created.uid;
      userEmail = created.email ?? email;
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-exists") {
        return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
      }
      console.error("[api/auth/register] createUser gagal:", (err as Error)?.message ?? err);
      return NextResponse.json(
        { error: "Gagal membuat akun. Coba lagi." },
        { status: 500 },
      );
    }

    const now = Date.now();

    // Account dibuat PENDING_PAYMENT. Bukan subscriber aktif sampai webhook payment SUCCESS.
    await db.collection("users").doc(uid).set({
      username,
      email: userEmail,
      planId: plan.id,
      planLabel: plan.label,
      planAmount: plan.amount,
      subscriptionStatus: "PENDING_PAYMENT",
      createdAt: now,
      expiresAtMs: 0,
      updatedAt: now,
    });

    await db.collection("usernames").doc(usernameKey).set({ uid, createdAt: now });

    // Buat payment record + buka transaction di Xoftware (SATU source of truth untuk transaksi pertama).
    const { refId } = await createPaymentRecord({
      uid,
      username,
      email: userEmail,
      planId: plan.id,
      planLabel: plan.label,
      amount: plan.amount,
      durationMonths: plan.duration,
      durationUnit: PLAN_UNIT,
    });

    let transactionReady = false;
    try {
      await openXoftwarePayment(
        refId,
        {
          uid,
          username,
          email: userEmail,
          planId: plan.id,
          planLabel: plan.label,
          amount: plan.amount,
          durationMonths: plan.duration,
          durationUnit: PLAN_UNIT,
        },
        { id: uid, name: username, email: userEmail },
      );
      transactionReady = true;
    } catch (err) {
      // User tetap ada (PENDING_PAYMENT) dan dapat retry lewat payment page.
      console.error("[api/auth/register] Xoftware createTransaction gagal:", (err as Error)?.message ?? err);
    }

    const updatedDoc = await db.collection("payments").doc(refId).get();
    const payment = updatedDoc.data() as PaymentRecord | undefined;

    return NextResponse.json({
      ok: true,
      username,
      email: userEmail,
      planId: plan.id,
      transactionReady,
      payment: payment ? toPublicPayment({ ...payment, status: "PENDING" }) : null,
    });
  } catch (err) {
    console.error("[api/auth/register] error:", (err as Error)?.message ?? err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}