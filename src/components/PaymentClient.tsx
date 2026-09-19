"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/plans";
import type { PaymentPublic } from "@/lib/payments";

interface StatusResponse {
  ok: boolean;
  payment?: PaymentPublic;
  error?: string;
}

const POLL_MS = 4000;

function countdownText(targetMs: number, nowMs: number): string {
  const ms = Math.max(0, targetMs - nowMs);
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function PaymentClient({
  username,
  payment: initial,
  qrDataUrl,
}: {
  username: string;
  payment: PaymentPublic;
  qrDataUrl: string | null;
}) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentPublic>(initial);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/status?ref=${encodeURIComponent(payment.refId)}`);
      const data = (await res.json()) as StatusResponse;
      if (res.ok && data.payment) {
        setPayment(data.payment);
      }
    } catch {
      // abort
    }
  }, [payment.refId]);

  useEffect(() => {
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (payment.status === "SUCCESS") {
      const t = setTimeout(() => router.push("/dashboard?welcome=1"), 1200);
      return () => clearTimeout(t);
    }
  }, [payment.status, router]);

  const createPayment = useCallback(
    async () => {
      setBusy(true);
      setFormError("");
      try {
        const res = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: payment.planId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || "Gagal membuat pembayaran");
          return;
        }
        const nextRef = data.payment?.refId as string | undefined;
        if (!nextRef) {
          setFormError("Gagal membuat pembayaran. Coba lagi.");
          return;
        }
        if (data.reused && nextRef === payment.refId) {
          setPayment(data.payment as PaymentPublic);
          return;
        }
        router.push(`/payment?ref=${encodeURIComponent(nextRef)}`);
      } catch {
        setFormError("Terjadi kesalahan. Coba lagi.");
      } finally {
        setBusy(false);
      }
    },
    [payment.planId, payment.refId, router],
  );

  const copyQris = async () => {
    if (!payment.qrisText) return;
    try {
      await navigator.clipboard.writeText(payment.qrisText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFormError("Gagal menyalin. Salin manual dari kolom di bawah.");
    }
  };

  const statusMeta = (() => {
    switch (payment.status) {
      case "SUCCESS":
        return { label: "Pembayaran berhasil", cls: "border-brand-500/50 bg-brand-500/10 text-brand-200" };
      case "FAILED":
        return { label: "Pembayaran gagal", cls: "border-red-500/50 bg-red-500/10 text-red-300" };
      case "EXPIRED":
        return { label: "Pembayaran kedaluwarsa", cls: "border-amber-500/50 bg-amber-500/10 text-amber-300" };
      default:
        return { label: "Menunggu pembayaran", cls: "border-brand-500/50 bg-brand-500/10 text-brand-200" };
    }
  })();

  const isPending = payment.status === "PENDING";
  const hasQris = !!payment.qrisText;
  const expired = payment.expiresAtMs <= now;

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-8 shadow-xl shadow-black/30 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Pembayaran</h1>
          <p className="mt-1 text-sm text-text-secondary">Halo, {username}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.cls}`}>
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface-dim p-5">
        <p className="text-sm text-text-secondary">Paket</p>
        <p className="mt-1 text-lg font-semibold text-text-primary">{payment.planLabel}</p>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-sm text-text-secondary">Total pembayaran</p>
          <p className="text-2xl font-bold text-text-primary">{formatRupiah(payment.amount)}</p>
        </div>
      </div>

      {isPending && hasQris && (
        <div className="mt-6 rounded-2xl border border-border bg-surface-dim p-6 text-center">
          <p className="text-sm font-medium text-text-secondary">Scan QRIS dengan aplikasi e-wallet / mobile banking</p>
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="QRIS"
              width={240}
              height={240}
              className="mx-auto mt-4 h-60 w-60 rounded-2xl border-4 border-white bg-white object-contain"
            />
          ) : null}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={copyQris}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-brand-500"
            >
              {copied ? "Tersalin ✓" : "Salin QRIS"}
            </button>
          </div>
          <p className="mt-3 break-all rounded-lg bg-white/90 px-3 py-2 font-mono text-[11px] text-text-primary">
            {payment.qrisText}
          </p>
        </div>
      )}

      {isPending && (
        <div className="mt-6 rounded-2xl border border-border bg-surface-dim p-5 text-center">
          <p className="text-sm text-text-secondary">Kedaluwarsa dalam</p>
          <p className={`mt-1 text-3xl font-bold tabular-nums ${expired ? "text-red-400" : "text-brand-300"}`}>
            {countdownText(payment.expiresAtMs, now)}
          </p>
        </div>
      )}

      {isPending && !hasQris && (
        <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <p className="text-sm font-medium text-amber-200">Pembayaran belum siap dibuat.</p>
          <p className="mt-1 text-sm text-text-secondary">
            Transaksi di payment gateway belum berhasil dibuat saat pendaftaran. Coba buat sekarang.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => createPayment()}
            className="mt-4 h-11 w-full rounded-xl bg-brand-500 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? "Memproses…" : "Buat QRIS Sekarang"}
          </button>
        </div>
      )}

      {payment.status !== "PENDING" && payment.status !== "SUCCESS" && (
        <div className="mt-6 rounded-2xl border border-border bg-surface-dim p-5">
          <p className="text-sm text-text-secondary">
            Pembayaran ini tidak jadi / kedaluwarsa. Kamu bisa membuat pembayaran baru untuk paket yang sama.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => createPayment()}
            className="mt-4 h-11 w-full rounded-xl bg-brand-500 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? "Memproses…" : "Buat Pembayaran Baru"}
          </button>
        </div>
      )}

      {formError && (
        <p className="mt-4 text-sm text-red-400">{formError}</p>
      )}

      <p className="mt-6 border-t border-border pt-4 text-xs text-text-muted">
        Pembayaran diverifikasi otomatis oleh sistem. Setelah berhasil, kamu akan diarahkan ke
        dashboard. Kendala? Chat CS admin kami di{" "}
        <span className="font-semibold text-brand-300">@satuboxx</span>.
      </p>
    </div>
  );
}