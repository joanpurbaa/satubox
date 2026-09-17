"use client";

import Link from "next/link";
import { useState } from "react";
import { formatRupiah, plans } from "@/lib/plans";

interface CheckoutFormProps {
  months: 1 | 3 | 6;
}

export default function CheckoutForm({ months }: CheckoutFormProps) {
  const plan = plans[months];
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile || undefined,
          months,
        }),
      });
      const data = (await res.json()) as { link?: string; error?: string };
      if (!res.ok || !data.link) {
        throw new Error(data.error ?? "Terjadi kesalahan, coba lagi");
      }
      window.location.assign(data.link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-2xl shadow-black/40 sm:p-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
          Ringkasan Pesanan
        </span>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Paket</span>
            <span className="font-semibold text-text-primary">
              SatuBox · {plan.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Efektif</span>
            <span className="font-semibold text-text-primary">{plan.perMonth}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-text-secondary">
              Total tagihan
            </span>
            <span className="text-2xl font-extrabold text-text-primary">
              {formatRupiah(plan.amount)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-text-secondary">
              Nama lengkap
            </span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama kamu"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-500/60 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="kamu@email.com"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-500/60 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-text-secondary">
              No. WhatsApp
            </span>
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              placeholder="08xxxxxxxxxx (opsional)"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-500/60 focus:outline-none"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="sheen inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="animate-spin"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="currentColor"
                    strokeOpacity=".25"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M18 10a8 8 0 00-8-8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                Membuat pembayaran…
              </>
            ) : (
              "Lanjut ke Pembayaran"
            )}
          </button>
        </form>

        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-text-muted">
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            className="mt-0.5 shrink-0 text-brand-400"
            aria-hidden="true"
          >
            <path
              d="M10 2l7.5 3v4.5c0 4-2.9 7.6-7.5 8.5-4.6-.9-7.5-4.5-7.5-8.5V5L10 2z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 10l1.8 1.8 3.5-3.8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Pembayaran diproses aman oleh Mayar. Setelah sukses, akses SatuBox
          diaktifkan otomatis dalam beberapa menit. Butuh bantuan? Chat CS admin
          di Instagram @satuboxx.
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali ke Beranda
          </Link>
          <Link
            href="/#harga"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Pilih paket lain
          </Link>
        </div>
      </div>
    </div>
  );
}