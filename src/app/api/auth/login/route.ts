import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/firebase";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS, sessionCookieOptions } from "@/lib/session";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_FIREBASE_API_KEY belum diisi di .env.local" },
        { status: 503 },
      );
    }

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    const data = (await res.json()) as { idToken?: string; error?: { message?: string } };

    if (!res.ok || !data.idToken) {
      const message = data.error?.message ?? "";
      const isWrongCreds =
        message.includes("INVALID_LOGIN_CREDENTIALS") ||
        message.includes("INVALID_PASSWORD") ||
        message.includes("EMAIL_NOT_FOUND") ||
        message.includes("USER_NOT_FOUND") ||
        message.includes("INVALID_EMAIL");
      return NextResponse.json(
        { error: isWrongCreds ? "Email atau password salah" : "Login gagal. Coba lagi." },
        { status: isWrongCreds ? 401 : 500 },
      );
    }

    const idToken = data.idToken;

    let sessionCookie: string;
    try {
      sessionCookie = await getAuthAdmin().createSessionCookie(idToken, {
        expiresIn: SESSION_MAX_AGE_MS,
      });
    } catch {
      return NextResponse.json(
        { error: "Gagal membuat sesi. Pastikan Firebase terkonfigurasi." },
        { status: 500 },
      );
    }

    const jar = await cookies();
    jar.set(SESSION_COOKIE, sessionCookie, sessionCookieOptions());

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}