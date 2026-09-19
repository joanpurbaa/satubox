import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

// Perpanjangan kini wajib melalui payment gateway.
// Route lama ini dinetralkan agar tidak menjadi "free activation" bypass.
export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  return NextResponse.json(
    {
      error: "Perpanjangan wajib melalui pembayaran. Gunakan /api/payments/create.",
    },
    { status: 410 },
  );
}