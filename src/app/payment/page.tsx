import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getDb } from "@/lib/firebase";
import { requireSession } from "@/lib/session";
import {
  expirePaymentIfNeeded,
  toPublicPayment,
  type PaymentRecord,
} from "@/lib/payments";
import PaymentClient from "@/components/PaymentClient";

export const metadata: Metadata = {
  title: "Pembayaran · SatuBox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaymentPage({
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
    const pendingSnap = await db
      .collection("payments")
      .where("uid", "==", user.uid)
      .limit(20)
      .get();
    const all = pendingSnap.docs.map((d) => d.data() as PaymentRecord);
    all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    payment = all[0] ?? null;
  }

  if (!payment) {
    redirect("/dashboard");
  }

  const current = await expirePaymentIfNeeded(payment);
  const userSnap = await db.collection("users").doc(user.uid).get();
  const profile = userSnap.data() ?? {};

  const qrDataUrl =
    current.status === "PENDING" && current.qrisText
      ? await QRCode.toDataURL(current.qrisText, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 240,
          color: { dark: "#14121f", light: "#ffffff" },
        })
      : null;

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-16">
      <PaymentClient
        username={String(profile.username ?? "")}
        payment={toPublicPayment(current)}
        qrDataUrl={qrDataUrl}
      />
    </main>
  );
}