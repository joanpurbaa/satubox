"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminAppRow } from "@/components/AdminDashboard";

const CATS = ["STREAMING", "MUSIK", "KREATIF", "PRODUKTIVITAS", "PENDIDIKAN", "LAINNYA"];

interface Draft {
  name: string;
  icon: string;
  category: string;
  cat: string;
  domains: string;
}

const emptyDraft: Draft = {
  name: "",
  icon: "",
  category: "Lainnya",
  cat: "LAINNYA",
  domains: "",
};

function draftFrom(app: AdminAppRow): Draft {
  return {
    name: app.name,
    icon: app.src,
    category: app.category === "Lainnya" ? "Lainnya" : app.category,
    cat: app.cat,
    domains: app.domains.join(", "),
  };
}

function iconUrl(v: string): string {
  const s = String(v || "").trim();
  if (/^https?:\/\//.test(s)) return s;
  return "/" + s.replace(/^\/+/, "");
}

async function api(path: string, method: string, body: unknown) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
  return data;
}

const inputCls =
  "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition-colors focus:border-brand-400";
const btnCls =
  "h-9 rounded-xl px-3 text-sm font-semibold transition-colors disabled:opacity-50";

export default function AdminAppsModule({
  apps,
  unknown,
}: {
  apps: AdminAppRow[];
  unknown: AdminAppRow[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.domains.some((d) => d.includes(q))
    );
  }, [apps, query]);

  function set(key: keyof Draft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError("");
    setOkMsg("");
  }

  function startAdd(domain?: string) {
    setError("");
    setOkMsg("");
    setDraft(
      domain ? { ...emptyDraft, name: domain.split(".")[0].toUpperCase(), domains: domain } : { ...emptyDraft }
    );
    setAdding(true);
    setEditingId(null);
  }

  function startEdit(app: AdminAppRow) {
    setError("");
    setOkMsg("");
    setDraft(draftFrom(app));
    setEditingId(app.id);
    setAdding(false);
  }

  function cancel() {
    setEditingId(null);
    setAdding(false);
    setError("");
    setDraft({ ...emptyDraft });
  }

  async function run(action: () => Promise<void>, ok?: string) {
    setBusy(true);
    setError("");
    setOkMsg("");
    try {
      await action();
      if (ok) setOkMsg(ok);
      cancel();
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Terjadi kesalahan");
    } finally {
      setBusy(false);
    }
  }

  function saveEdit(app: AdminAppRow) {
    return run(async () => {
      const domains = draft.domains
        .split(",")
        .map((d) => d.trim().toLowerCase().replace(/^\.+/, ""))
        .filter(Boolean);
      if (!draft.name.trim()) throw new Error("Nama aplikasi wajib diisi");
      if (domains.length === 0) throw new Error("Minimal satu domain wajib diisi");
      await api("/api/admin/catalog/" + app.id, "PATCH", {
        name: draft.name.trim(),
        icon: draft.icon.trim(),
        category: draft.category.trim(),
        cat: draft.cat,
        domains,
      });
    }, "Perubahan tersimpan.");
  }

  function createApp() {
    return run(async () => {
      const domains = draft.domains
        .split(",")
        .map((d) => d.trim().toLowerCase().replace(/^\.+/, ""))
        .filter(Boolean);
      if (!draft.name.trim()) throw new Error("Nama aplikasi wajib diisi");
      if (domains.length === 0) throw new Error("Minimal satu domain wajib diisi");
      await api("/api/admin/catalog", "POST", {
        name: draft.name.trim(),
        icon: draft.icon.trim(),
        category: draft.category.trim(),
        cat: draft.cat,
        domains,
      });
    }, "Aplikasi ditambahkan.");
  }

  function setEnabled(app: AdminAppRow, enabled: boolean) {
    return run(
      async () => {
        await api("/api/admin/catalog/" + app.id, "PATCH", { enabled });
      },
      enabled ? "Aplikasi diaktifkan kembali." : "Aplikasi disembunyikan dari extension."
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama / domain…"
          className="h-10 w-64 rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-secondary/60 outline-none transition-colors focus:border-brand-400"
        />
        <button
          type="button"
          onClick={() => startAdd()}
          disabled={adding || busy}
          className={
            btnCls +
            " bg-brand-500 text-white hover:bg-brand-600"
          }>
          + Tambah aplikasi
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {okMsg && (
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {okMsg}
        </p>
      )}

      {(adding || editingId) && (
        <div className="mt-6 rounded-3xl border border-brand-500/30 bg-surface/80 p-6 backdrop-blur-md">
          <h3 className="text-base font-semibold text-text-primary">
            {adding ? "Tambah aplikasi baru" : "Ubah aplikasi"}
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Nama
              </label>
              <input
                className={inputCls + " mt-2"}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Netflix"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Ikon (URL)
              </label>
              <input
                className={inputCls + " mt-2"}
                value={draft.icon}
                onChange={(e) => set("icon", e.target.value)}
                placeholder="/netflix.webp"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Kategori pill
              </label>
              <select
                className={inputCls + " mt-2"}
                value={draft.cat}
                onChange={(e) => set("cat", e.target.value)}>
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Domain (pisah koma)
              </label>
              <input
                className={inputCls + " mt-2"}
                value={draft.domains}
                onChange={(e) => set("domains", e.target.value)}
                placeholder="netflix.com, nflxvideo.net"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-surface-dim">
              {draft.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconUrl(draft.icon)}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-text-secondary">
                  {(draft.name || "?").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <p className="font-semibold text-text-primary">{draft.name || "…"}</p>
            <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
              {draft.cat}
            </span>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={adding ? createApp : () => editingId && saveEdit(apps.find((a) => a.id === editingId)!)}
              className={
                btnCls + " bg-brand-500 text-white hover:bg-brand-600"
              }>
              {busy ? "Menyimpan…" : adding ? "Tambah" : "Simpan"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={cancel}
              className={btnCls + " border border-border text-text-secondary hover:text-text-primary"}>
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((a) => {
          const isEditing = editingId === a.id;
          const enabled = a.enabled;
          return (
            <div
              key={a.id}
              className={
                "rounded-3xl border bg-surface/80 p-5 shadow-lg shadow-black/20 backdrop-blur-md transition-opacity " +
                (enabled ? "border-border" : "border-border opacity-60")
              }>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-dim">
                  {a.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.src}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg font-bold text-text-secondary">
                      {a.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text-primary">{a.name}</p>
                  <p className="truncate text-xs text-text-secondary">{a.domains.join(", ")}</p>
                </div>
              </div>

              {!enabled && (
                <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  Disembunyikan dari extension
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                  {a.cat}
                </span>
                <span
                  className={
                    "rounded-full border px-2.5 py-0.5 text-xs font-semibold " +
                    (a.adopted > 0
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-surface-dim text-text-secondary")
                  }>
                  {a.adopted} {a.adopted === 1 ? "user" : "user"}
                </span>
              </div>

              {enabled && a.inUse.length > 0 && (
                <p className="mt-3 text-xs text-text-secondary">
                  Dipakai via <span className="font-semibold text-text-primary">{a.inUse.join(", ")}</span>
                </p>
              )}

              {isEditing ? (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <input
                    className={inputCls}
                    value={draft.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Nama"
                  />
                  <input
                    className={inputCls}
                    value={draft.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    placeholder="/icon.webp"
                  />
                  <select
                    className={inputCls}
                    value={draft.cat}
                    onChange={(e) => set("cat", e.target.value)}>
                    {CATS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    className={inputCls}
                    value={draft.domains}
                    onChange={(e) => set("domains", e.target.value)}
                    placeholder="domain1.com, domain2.id"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => saveEdit(a)}
                      className={btnCls + " bg-brand-500 text-white hover:bg-brand-600"}>
                      {busy ? "…" : "Simpan"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={cancel}
                      className={btnCls + " border border-border text-text-secondary hover:text-text-primary"}>
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => startEdit(a)}
                    className={btnCls + " border border-border text-text-secondary hover:text-text-primary"}>
                    Ubah
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      window.confirm(
                        enabled
                          ? "Sembunyikan '" + a.name + "' dari semua extension?"
                          : "Aktifkan kembali '" + a.name + "'?"
                      ) && setEnabled(a, !enabled)
                    }
                    className={
                      btnCls +
                      " " +
                      (enabled
                        ? "border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                        : "border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10")
                    }>
                    {enabled ? "Sembunyikan" : "Aktifkan"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-border bg-surface/60 px-4 py-10 text-center text-sm text-text-secondary">
            Tidak ada aplikasi yang cocok.
          </p>
        )}
      </div>

      {unknown.length > 0 && (
        <div className="mt-8 rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6">
          <h3 className="text-base font-semibold text-orange-300">
            Domain tak dikenal katalog
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Site yang terpasang user tapi belum ada di katalog. Tambahkan langsung, maka tampil
            otomatis di semua extension.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {unknown.map((u) => (
              <span
                key={u.id}
                className="flex items-center gap-2 rounded-full border border-border bg-surface/80 pl-3 pr-1.5 py-1 text-xs font-medium text-text-primary">
                {u.domains[0]} · {u.adopted} {u.adopted === 1 ? "user" : "user"}
                <button
                  type="button"
                  onClick={() => startAdd(u.domains[0])}
                  disabled={busy}
                  className="rounded-full bg-brand-500/20 px-2 py-0.5 font-semibold text-brand-300 transition-colors hover:bg-brand-500/30">
                  Tambah
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}