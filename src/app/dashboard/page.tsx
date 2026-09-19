import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/firebase";
import {
  PLAN_UNIT,
  formatExpiryDate,
} from "@/lib/plans";
import SubscriptionCountdown from "@/components/SubscriptionCountdown";
import LogoutButton from "@/components/LogoutButton";
import RenewPlans from "@/components/RenewPlans";
import ExtensionInstallGuide from "@/components/ExtensionInstallGuide";

export const metadata: Metadata = {
  title: "Dashboard · SatuBox",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireSession();

  const db = getDb();
  const doc = await db.collection("users").doc(user.uid).get();
  if (!doc.exists) {
    redirect("/login");
  }

  const profile = doc.data()!;
  const expiresAtMs = (profile.expiresAtMs as number) ?? 0;
  /* eslint-disable-next-line react-hooks/purity */
  const expired = expiresAtMs <= Date.now();

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Halo, {profile.username}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{profile.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface/80 shadow-xl shadow-black/30 backdrop-blur-md">
        <div className="border-b border-border px-8 py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Langganan
          </h2>
        </div>
        <div className="grid gap-6 px-8 py-8 sm:grid-cols-2">
          <div>
            <p className="text-sm text-text-secondary">Paket aktif</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {profile.planLabel}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Berakhir pada</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {formatExpiryDate(expiresAtMs)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-text-secondary">Sisa waktu</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              <SubscriptionCountdown
                expiresAtMs={expiresAtMs}
                unit={PLAN_UNIT}
              />
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-dim">
              <div
                className={
                  expired
                    ? "h-full w-0 rounded-full"
                    : "h-full rounded-full bg-brand-500"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {expired && (
        <div className="mt-6 rounded-3xl border border-red-500/40 bg-red-500/10 px-8 py-6">
          <h3 className="text-base font-semibold text-red-300">
            Langganan kedaluwarsa
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Pilih paket untuk mengaktifkan kembali langganan.
          </p>
          <div className="mt-4">
            <RenewPlans />
          </div>
        </div>
      )}
      <ExtensionInstallGuide />
    </main>
  );
}