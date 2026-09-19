"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="h-11 rounded-xl border border-border px-5 text-sm font-medium text-text-secondary transition-colors hover:border-red-500/50 hover:text-red-300 disabled:opacity-60">
      {loading ? "Keluar…" : "Keluar"}
    </button>
  );
}