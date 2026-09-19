"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, formatRupiah } from "@/lib/plans";

export default function RenewPlans() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function renew(planId: string) {
    setLoadingId(planId);
    setError("");
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat pembayaran");
        return;
      }
      const refId = data.payment?.refId;
      if (refId) {
        router.push(`/payment?ref=${encodeURIComponent(refId)}`);
      } else {
        setError("Gagal membuat pembayaran. Coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-text-secondary">Pilih paket baru:</p>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            disabled={loadingId !== null}
            onClick={() => renew(plan.id)}
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand-500 hover:bg-brand-500/10 disabled:opacity-60">
            {plan.label} · {formatRupiah(plan.amount)}
          </button>
        ))}
      </div>
    </div>
  );
}