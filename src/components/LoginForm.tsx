"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm({
  registered,
  next,
}: {
  registered?: boolean;
  next?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-surface/80 p-8 shadow-xl shadow-black/30 backdrop-blur-md">
      <h1 className="text-2xl font-bold text-text-primary">Masuk</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Masuk pakai email &amp; password akun SatuBox kamu.
      </p>

      {registered && (
        <div className="mt-4 rounded-xl border border-brand-500/40 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
          Akun berhasil dibuat. Silakan masuk.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-dim px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-brand-500 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98] disabled:opacity-60">
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-brand-300 hover:text-brand-200">
          Daftar dulu
        </Link>
      </p>
    </div>
  );
}