import { NextResponse } from "next/server";
import { getAuthAdmin } from "./firebase";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

export async function verifySessionToken(idToken: unknown) {
  if (typeof idToken !== "string" || !idToken) {
    return { error: "idToken dibutuhkan", status: 400 } as const;
  }
  try {
    const decoded = await getAuthAdmin().verifyIdToken(idToken, true);
    return { uid: decoded.uid, email: decoded.email ?? "" } as const;
  } catch {
    return { error: "Sesi tidak valid", status: 401 } as const;
  }
}