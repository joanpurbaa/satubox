import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { getDb } from "@/lib/firebase";
import { CATALOG_COLLECTION, slugify, type CatalogApp } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Login Gratis App · SatuBox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function findApp(catalog: CatalogApp[], slug: string): CatalogApp | null {
  return (
    catalog.find((a) => a.id === slug || slugify(a.name) === slug || a.domains.includes(slug)) ||
    null
  );
}

export default async function GatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireSession();

  if (isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const db = getDb();
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists) {
    redirect("/login");
  }

  const profile = userDoc.data()!;
  const now = Date.now();
  const isActive =
    (profile.subscriptionStatus as string | undefined) === "ACTIVE" ||
    ((profile.expiresAtMs as number) ?? 0) > now;
  if (!isActive) {
    redirect("/dashboard");
  }

  const colSnap = await db.collection(CATALOG_COLLECTION).get();
  const catalog = colSnap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }) as unknown as CatalogApp
  );
  const app = findApp(catalog, slug);

  if (!app || !app.enabled) {
    redirect("/dashboard");
  }
  if (!app.gateEnabled) {
    redirect("/dashboard");
  }

  const target =
    "https://" + String(app.domains[0] || "").replace(/^\.+/, "").replace(/\s/g, "");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface/80 shadow-xl shadow-black/30 backdrop-blur-md">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-surface-dim">
                {app.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={app.icon.startsWith("http") ? app.icon : "/" + app.icon.replace(/^\/+/, "")}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-text-secondary">
                    {app.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">{app.name}</h1>
                <p className="text-xs text-text-secondary">Kredensial login SatuBox</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Email
              </label>
              <div className="mt-1 rounded-xl border border-border bg-surface-dim px-3 py-3 text-sm font-medium text-text-primary break-all">
                {app.gateEmail || "-"}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Password
              </label>
              <div className="mt-1 rounded-xl border border-border bg-surface-dim px-3 py-3 text-sm font-medium text-text-primary break-all">
                {app.gatePassword || "-"}
              </div>
            </div>

            <Link
              href={target}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98]"
            >
              Pergi ke halaman {app.name} &amp; Login
            </Link>

            <p className="mt-5 text-xs leading-relaxed text-text-muted">
              Buka {target.replace(/^https:\/\//, "")} di tab baru, lalu masukkan email dan
              password di atas untuk login.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          <Link href="/dashboard" className="font-semibold text-brand-300 hover:text-brand-200">
            ← Kembali ke dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}