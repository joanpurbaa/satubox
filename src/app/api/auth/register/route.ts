import { NextResponse } from "next/server";
import { getAuthAdmin, getDb, isFirebaseConfigured } from "@/lib/firebase";
import { getPlan, expiryFromNow } from "@/lib/plans";

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
    const expiresAtMs = expiryFromNow(plan, now);

    await db.collection("users").doc(uid).set({
      username,
      email: userEmail,
      planId: plan.id,
      planLabel: plan.label,
      planAmount: plan.amount,
      createdAt: now,
      planStartedAt: now,
      expiresAtMs,
    });

    await db.collection("usernames").doc(usernameKey).set({ uid, createdAt: now });

    return NextResponse.json({ ok: true, username, email: userEmail, planId: plan.id });
  } catch (err) {
    console.error("[api/auth/register] error:", (err as Error)?.message ?? err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}