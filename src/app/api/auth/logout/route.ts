import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/firebase";
import { SESSION_COOKIE, getSessionUser } from "@/lib/session";

export async function POST() {
  const jar = await cookies();
  const user = await getSessionUser();
  if (user) {
    try {
      await getAuthAdmin().revokeRefreshTokens(user.uid);
    } catch {
      // revoke best-effort; cookie tetap dihapus
    }
  }
  jar.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}