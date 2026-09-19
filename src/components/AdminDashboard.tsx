"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import AdminAppsModule from "@/components/AdminAppsModule";

export type UserStatus = "active" | "soon" | "expired";

export interface AdminUserRow {
  uid: string;
  username: string;
  email: string;
  planId: string;
  planLabel: string;
  planAmount: number;
  createdAt: number;
  planStartedAt: number;
  expiresAtMs: number;
  sitesCount: number;
  status: UserStatus;
  daysLeft: number;
}

export interface AdminAppRow {
  id: string;
  name: string;
  src: string;
  category: string;
  cat: string;
  domains: string[];
  enabled: boolean;
  adopted: number;
  inUse: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  soonUsers: number;
  expiredUsers: number;
  totalSites: number;
  catalogApps: number;
  unknownDomains: number;
}

interface AdminDashboardProps {
  adminEmail: string;
  username: string;
  stats: AdminStats;
  users: AdminUserRow[];
  apps: AdminAppRow[];
  unknown: AdminAppRow[];
}

type Tab = "ringkasan" | "pengguna" | "aplikasi";

const fmtDate = (ms: number) =>
  ms
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(ms)
    : "—";

const fmtMoney = (n: number) => (n ? "Rp " + n.toLocaleString("id-ID") : "—");

const statusMeta: Record<UserStatus, { label: string; cls: string }> = {
  active: { label: "Aktif", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  soon: { label: "Segera habis", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  expired: { label: "Kedaluwarsa", cls: "bg-red-500/15 text-red-300 border-red-500/30" },
};

function SideIcon({ kind }: { kind: Tab }) {
  const paths: Record<Tab, ReactNode> = {
    ringkasan: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" />
      </>
    ),
    pengguna: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    aplikasi: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4.5 w-4.5 shrink-0"
      aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}

export default function AdminDashboard({
  adminEmail,
  username,
  stats,
  users,
  apps,
  unknown,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const router = useRouter();
  const [deletingUid, setDeletingUid] = useState<string | null>(null);
  const [adminMsg, setAdminMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function deleteUser(u: AdminUserRow) {
    if (deletingUid) return;
    const yes = window.confirm(
      `Hapus user "${u.username}" (${u.email})?\n\nSeluruh data ikut terhapus permanen: login, lembar site, dan riwayat pembayaran. Tidak bisa dikembalikan. Lanjut?`,
    );
    if (!yes) return;
    setDeletingUid(u.uid);
    setAdminMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(u.uid)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menghapus user");
      setAdminMsg({ kind: "ok", text: `User "${u.username}" berhasil dihapus.` });
      router.refresh();
    } catch (e) {
      setAdminMsg({ kind: "err", text: (e as Error).message || "Terjadi kesalahan" });
    } finally {
      setDeletingUid(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (!q) return true;
      return (
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.planLabel.toLowerCase().includes(q)
      );
    });
  }, [users, query, statusFilter]);

  const summary = useMemo(() => {
    const totalRaw = users.reduce((acc, u) => acc + u.planAmount, 0);
    return {
      totalUsers: users.length,
      active: users.filter((u) => u.status === "active").length,
      soon: users.filter((u) => u.status === "soon").length,
      expired: users.filter((u) => u.status === "expired").length,
      totalSites: users.reduce((acc, u) => acc + u.sitesCount, 0),
      totalRaw,
    };
  }, [users]);

  const cards: { label: string; value: string; cls: string }[] = [
    { label: "Total user", value: String(stats.totalUsers), cls: "text-text-primary" },
    { label: "Aktif", value: String(stats.activeUsers), cls: "text-emerald-300" },
    { label: "Segera habis", value: String(stats.soonUsers), cls: "text-amber-300" },
    { label: "Kedaluwarsa", value: String(stats.expiredUsers), cls: "text-red-300" },
    { label: "App katalog", value: String(stats.catalogApps), cls: "text-brand-300" },
    { label: "Site terpasang", value: String(stats.totalSites), cls: "text-text-primary" },
    { label: "Domain tak dikenal", value: String(stats.unknownDomains), cls: "text-orange-300" },
  ];

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-4 py-6 backdrop-blur-md md:flex">
        <div className="px-2">
          <p className="text-lg font-bold tracking-tight text-text-primary">SatuBox</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
            Admin Panel
          </p>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {(
            [
              ["ringkasan", "Ringkasan"],
              ["pengguna", "Pengguna"],
              ["aplikasi", "Aplikasi Premium"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                (tab === key
                  ? "bg-brand-500/15 text-brand-300"
                  : "text-text-secondary hover:bg-surface-dim hover:text-text-primary")
              }>
              <SideIcon kind={key} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-border bg-surface-dim/60 px-3 py-4">
          <p className="truncate text-sm font-semibold text-text-primary">{username}</p>
          <p className="truncate text-xs text-text-secondary">{adminEmail}</p>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface-alt/80 px-6 py-4 backdrop-blur-md md:hidden">
          <p className="text-base font-bold text-text-primary">SatuBox Admin</p>
          <LogoutButton />
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl">
            {tab === "ringkasan" && (
              <section>
                <h2 className="text-xl font-bold text-text-primary">Ringkasan</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Pantauan singkat kondisi SatuBox.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {cards.map((c) => (
                    <div
                      key={c.label}
                      className="rounded-3xl border border-border bg-surface/80 p-5 shadow-lg shadow-black/20 backdrop-blur-md">
                      <p className="text-sm text-text-secondary">{c.label}</p>
                      <p className={"mt-2 text-3xl font-bold tabular-nums " + c.cls}>{c.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-md">
                    <p className="text-sm text-text-secondary">Pendapatan total (paket)</p>
                    <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums">
                      {fmtMoney(summary.totalRaw)}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-md">
                    <p className="text-sm text-text-secondary">Akselerasi langganan</p>
                    <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums">
                      {summary.active}
                      <span className="text-base font-medium text-text-secondary"> aktif</span>
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-md">
                    <p className="text-sm text-text-secondary">Domain tak dikenal katalog</p>
                    <p className="mt-2 text-2xl font-bold text-orange-300 tabular-nums">
                      {stats.unknownDomains}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Site terpasang yang belum masuk apps.ts — segera tambahkan.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {tab === "pengguna" && (
              <section>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">Pengguna</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Semua akun, langganan & pembayaran terakhir.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cari username / email / paket…"
                      className="h-10 w-64 rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition-colors focus:border-brand-400"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | UserStatus)}
                      className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-400">
                      <option value="all">Semua status</option>
                      <option value="active">Aktif</option>
                      <option value="soon">Segera habis</option>
                      <option value="expired">Kedaluwarsa</option>
                    </select>
                  </div>
                </div>

                {adminMsg && (
                  <p
                    className={
                      "mt-4 rounded-xl border px-4 py-3 text-sm " +
                      (adminMsg.kind === "ok"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/30 bg-red-500/10 text-red-300")
                    }>
                    {adminMsg.text}
                  </p>
                )}

                <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface/80 backdrop-blur-md">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[880px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border bg-surface-dim/50 text-xs uppercase tracking-wider text-text-secondary">
                          <th className="px-5 py-3.5 font-semibold">User</th>
                          <th className="px-5 py-3.5 font-semibold">Paket</th>
                          <th className="px-5 py-3.5 font-semibold">Terakhir bayar/aktivasi</th>
                          <th className="px-5 py-3.5 font-semibold">Kadaluarsa</th>
                          <th className="px-5 py-3.5 font-semibold">Sisa</th>
                          <th className="px-5 py-3.5 text-center font-semibold">Site</th>
                          <th className="px-5 py-3.5 font-semibold">Status</th>
                          <th className="px-5 py-3.5 text-center font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => {
                          const s = statusMeta[u.status];
                          return (
                            <tr
                              key={u.uid}
                              className="border-b border-border/60 last:border-0 hover:bg-surface-dim/40">
                              <td className="px-5 py-3.5">
                                <p className="font-semibold text-text-primary">{u.username}</p>
                                <p className="text-xs text-text-secondary">{u.email}</p>
                              </td>
                              <td className="px-5 py-3.5">
                                <p className="text-text-primary">{u.planLabel || u.planId || "—"}</p>
                                <p className="text-xs text-text-secondary">
                                  {u.planAmount ? fmtMoney(u.planAmount) : "—"}
                                </p>
                              </td>
                              <td className="px-5 py-3.5 text-text-primary tabular-nums">
                                {fmtDate(u.planStartedAt)}
                              </td>
                              <td className="px-5 py-3.5 text-text-primary tabular-nums">
                                {fmtDate(u.expiresAtMs)}
                              </td>
                              <td className="px-5 py-3.5 text-text-primary tabular-nums">
                                {u.status === "expired"
                                  ? "—"
                                  : u.daysLeft + (u.daysLeft === 1 ? " hari" : " hari")}
                              </td>
                              <td className="px-5 py-3.5 text-center text-text-primary tabular-nums">
                                {u.sitesCount}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={
                                    "rounded-full border px-2.5 py-1 text-xs font-semibold " +
                                    s.cls
                                  }>
                                  {s.label}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <button
                                  type="button"
                                  disabled={deletingUid !== null}
                                  onClick={() => deleteUser(u)}
                                  className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50">
                                  {deletingUid === u.uid ? "Menghapus…" : "Hapus"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td
                              colSpan={8}
                              className="px-5 py-10 text-center text-text-secondary">
                              Tidak ada user yang cocok.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {tab === "aplikasi" && (
              <section>
                <h2 className="text-xl font-bold text-text-primary">Aplikasi Premium</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Kelola nama, ikon & kategori aplikasi. Tersimpan di server dan otomatis dipakai
                  semua extension.
                </p>
                <AdminAppsModule apps={apps} unknown={unknown} />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}