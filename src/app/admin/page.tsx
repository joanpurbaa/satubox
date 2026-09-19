import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/firebase";
import { ensureCatalogSeeded } from "@/lib/catalog";
import AdminDashboard from "@/components/AdminDashboard";
import type { AdminAppRow, AdminUserRow } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin · SatuBox",
  robots: { index: false, follow: false },
};

const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeDomain(raw: string | undefined | null): string {
  return String(raw || "")
    .toLowerCase()
    .replace(/^\.+/, "");
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  const db = getDb();

  const catalog = await ensureCatalogSeeded();
  const enabledCatalog = catalog.filter((a) => a.enabled);

  const usersSnap = await db.collection("users").orderBy("createdAt", "desc").get();
  /* eslint-disable-next-line react-hooks/purity */
  const now = Date.now();

  const adoption = new Array(catalog.length).fill(0);
  const domainCount = new Map<string, number>();
  const unknownDomains = new Map<string, number>();

  const userRows: AdminUserRow[] = [];

  for (const doc of usersSnap.docs) {
    const d = doc.data();
    const uid = doc.id;
    const email = String(d.email || "");
    const username = String(d.username || "");
    const createdAt = Number(d.createdAt) || 0;
    const planStartedAt = Number(d.planStartedAt) || 0;
    const expiresAtMs = Number(d.expiresAtMs) || 0;

    const status: AdminUserRow["status"] =
      expiresAtMs <= now ? "expired" : expiresAtMs - now <= 3 * DAY_MS ? "soon" : "active";

    const sitesSnap = await db.collection("users").doc(uid).collection("sites").get();
    const domains = sitesSnap.docs
      .map((sd) => {
        const data = sd.data();
        return normalizeDomain(data.domain as string | undefined);
      })
      .filter(Boolean);

    const userApps = new Set<number>();
    enabledCatalog.forEach((a, idx) => {
      const matched = domains.some((dom) =>
        a.domains.some((m) => dom === m || dom.endsWith("." + m))
      );
      if (matched) userApps.add(idx);
    });
    for (const dom of domains) {
      domainCount.set(dom, (domainCount.get(dom) || 0) + 1);
      const known = enabledCatalog.some((a) =>
        a.domains.some((m) => dom === m || dom.endsWith("." + m))
      );
      if (!known) unknownDomains.set(dom, (unknownDomains.get(dom) || 0) + 1);
    }
    for (const idx of userApps) adoption[idx] += 1;

    userRows.push({
      uid,
      username,
      email,
      planId: String(d.planId || ""),
      planLabel: String(d.planLabel || ""),
      planAmount: Number(d.planAmount) || 0,
      createdAt,
      planStartedAt,
      expiresAtMs,
      sitesCount: domains.length,
      status,
      daysLeft: expiresAtMs > now ? Math.ceil((expiresAtMs - now) / DAY_MS) : 0,
    });
  }

  const appRows: AdminAppRow[] = catalog.map((a, idx) => ({
    id: a.id,
    name: a.name,
    src: a.icon,
    category: a.category,
    cat: a.cat,
    domains: a.domains,
    enabled: a.enabled,
    adopted: adoption[idx] ?? 0,
    inUse: a.domains.filter((d) => domainCount.has(d)),
  }));

  const unknownApps: AdminAppRow[] = [...unknownDomains.entries()].map(([domain, count]) => ({
    id: "unknown-" + domain,
    name: domain,
    src: "",
    category: "Lainnya",
    cat: "LAINNYA",
    domains: [domain],
    enabled: true,
    adopted: count,
    inUse: [domain],
  }));

  const stats = {
    totalUsers: userRows.length,
    activeUsers: userRows.filter((u) => u.status === "active").length,
    soonUsers: userRows.filter((u) => u.status === "soon").length,
    expiredUsers: userRows.filter((u) => u.status === "expired").length,
    totalSites: userRows.reduce((acc, u) => acc + u.sitesCount, 0),
    catalogApps: enabledCatalog.length,
    unknownDomains: unknownApps.length,
  };

  return (
    <AdminDashboard
      adminEmail={admin.email}
      username={(userRows.find((u) => u.uid === admin.uid)?.username as string) || admin.email}
      stats={stats}
      users={userRows}
      apps={appRows}
      unknown={unknownApps}
    />
  );
}