import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import { getPlan, expiryFromNow } from "@/lib/plans";
import { getSessionUser } from "@/lib/session";

interface RenewBody {
  planId?: string;
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }

    const body = (await req.json()) as RenewBody;
    const plan = getPlan(body.planId ?? "");

    if (!plan) {
      return NextResponse.json({ error: "Pilihan durasi tidak ditemukan" }, { status: 400 });
    }

    const db = getDb();
    const doc = await db.collection("users").doc(user.uid).get();
    const profile = doc.data();
    if (!doc.exists || !profile) {
      return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
    }

    const now = Date.now();
    const expiresAtMs = expiryFromNow(plan, now);

    await db.collection("users").doc(user.uid).update({
      planId: plan.id,
      planLabel: plan.label,
      planAmount: plan.amount,
      planStartedAt: now,
      expiresAtMs,
    });

    return NextResponse.json({ ok: true, expiresAtMs });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}