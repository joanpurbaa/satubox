"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS } from "@/lib/plans";

export default function ContinuePaymentButton({ planId }: { planId?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const target = PLANS.some((p) => p.id === planId) ? planId! : PLANS[0].id;

  async function go() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: target }),
      });
      const data = await res.json();
      const refId = data.payment?.refId as string | undefined;
      if (!res.ok || !refId) {
        setError(data.error || "Gagal membuat pembayaran. Coba lagi.");
        return;
      }
      router.push(`/payment?ref=${encodeURIComponent(refId)}`);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={go}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? "Membuat pembayaran…" : "Lanjutkan Pembayaran"}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}