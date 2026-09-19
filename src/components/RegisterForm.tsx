"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PLANS, formatRupiah } from "@/lib/plans";

export default function RegisterForm({ initialPlan }: { initialPlan?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [planId, setPlanId] = useState(
    PLANS.some((p) => p.id === initialPlan) ? initialPlan! : PLANS[0].id,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mendaftar");
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-border bg-surface/80 p-8 shadow-xl shadow-black/30 backdrop-blur-md">
      <h1 className="text-2xl font-bold text-text-primary">Daftar Akun</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Pilih durasi, isi data, dan akun langsung aktif untuk dicoba.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-secondary">Pilih durasi</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <label
                key={plan.id}
                className={`relative cursor-pointer rounded-xl border p-4 transition-colors ${
                  planId === plan.id
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-border bg-surface-dim hover:border-brand-500/50"
                }`}>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={planId === plan.id}
                  onChange={() => setPlanId(plan.id)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-text-primary">{plan.label}</span>
                <span className="mt-1 block text-sm text-text-secondary">{formatRupiah(plan.amount)}</span>
                {plan.badge && (
                  <span className="mt-1 inline-block rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {plan.badge}
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-text-secondary">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]{3,20}"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-dim px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-500"
            placeholder="mis. satubox_2024"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-dim px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-500"
            placeholder="kamu@contoh.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-dim px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-500"
            placeholder="Minimal 8 karakter"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-brand-500 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98] disabled:opacity-60">
          {loading ? "Membuat akun…" : "Daftar & Aktifkan"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-brand-300 hover:text-brand-200">
          Masuk
        </Link>
      </p>
    </div>
  );
}