import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/firebase";
import { requireSession } from "@/lib/session";
import {
  expirePaymentIfNeeded,
  getLatestPaymentForUser,
  type PaymentRecord,
} from "@/lib/payments";
import PaymentSuccessClient from "@/components/PaymentSuccessClient";

export const metadata: Metadata = {
  title: "Status Pembayaran · SatuBox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const user = await requireSession();
  const params = await searchParams;
  const db = getDb();

  let payment: PaymentRecord | null = null;

  if (params.ref) {
    const snap = await db.collection("payments").doc(params.ref).get();
    const data = snap.exists ? (snap.data() as PaymentRecord) : null;
    if (data && data.uid === user.uid) payment = data;
  }
  if (!payment) {
    payment = await getLatestPaymentForUser(user.uid);
  }
  if (!payment) {
    redirect("/dashboard");
  }

  const current = await expirePaymentIfNeeded(payment);
  const userSnap = await db.collection("users").doc(user.uid).get();
  const profile = userSnap.data() ?? {};

  // Halaman ini tidak pernah percaya query param. Status diambil dari backend.
  return (
    <main className="mx-auto w-full max-w-xl px-5 py-16">
      <PaymentSuccessClient
        refId={current.refId}
        initialStatus={current.status}
        planLabel={current.planLabel}
        amount={current.amount}
        username={String(profile.username ?? "")}
        purpose={current.purpose}
      />
    </main>
  );
}