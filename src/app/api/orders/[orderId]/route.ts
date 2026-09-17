import { NextResponse } from "next/server";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const doc = await getDb().collection("orders").doc(orderId).get();
  if (!doc.exists) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const data = doc.data()!;
  return NextResponse.json({
    orderRef: data.orderRef,
    status: data.status,
    months: data.months,
    amount: data.amount,
    expiresAt: data.expiresAt?.toDate?.()?.toISOString() ?? null,
  });
}