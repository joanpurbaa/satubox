"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/plans";
import type { PaymentPublic } from "@/lib/payments";

const POLL_MS = 4000;

export default function PaymentSuccessClient({
  refId,
  initialStatus,
  planLabel,
  amount,
  username,
  purpose,
}: {
  refId: string;
  initialStatus: string;
  planLabel: string;
  amount: number;
  username: string;
  purpose: "register" | "renew";
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [planLabelState] = useState(planLabel);
  const [amountState] = useState(amount);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/status?ref=${encodeURIComponent(refId)}`);
      const data = (await res.json()) as { ok: boolean; payment?: PaymentPublic; error?: string };
      if (res.ok && data.payment) setStatus(data.payment.status);
    } catch {
      // abort
    }
  }, [refId]);

  useEffect(() => {
    if (status === "SUCCESS") return;
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [status, refresh]);

  useEffect(() => {
    if (status === "SUCCESS") {
      const dest =
        purpose === "register" ? "/login?paid=1" : "/dashboard";
      const t = setTimeout(() => router.replace(dest), 1200);
      return () => clearTimeout(t);
    }
  }, [status, purpose, router]);

  if (status === "SUCCESS") {
    return (
      <div className="rounded-3xl border border-brand-500/40 bg-surface/80 p-10 text-center shadow-xl shadow-black/30 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/15 text-3xl">
          🎉
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">Pembayaran berhasil</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {planLabelState} · {formatRupiah(amountState)} · terverifikasi otomatis.
        </p>
        <p className="mt-6 text-sm text-text-secondary">
          Mengarahkan kamu ke dashboard, {username}…
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-10 text-center shadow-xl shadow-black/30 backdrop-blur-md">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
      <h1 className="mt-4 text-xl font-bold text-text-primary">Menunggu konfirmasi pembayaran</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Status payment belum selesai diverifikasi. Halaman ini akan ter-refresh otomatis.
      </p>
      <button
        type="button"
        onClick={() => router.push(`/payment?ref=${encodeURIComponent(refId)}`)}
        className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-brand-500"
      >
        Kembali ke halaman pembayaran
      </button>
    </div>
  );
}