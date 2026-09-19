import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { getDb } from "@/lib/firebase";
import {
  PLAN_UNIT,
  formatExpiryDate,
  formatRupiah,
} from "@/lib/plans";
import { getLatestPendingPaymentForUser } from "@/lib/payments";
import SubscriptionCountdown from "@/components/SubscriptionCountdown";
import LogoutButton from "@/components/LogoutButton";
import RenewPlans from "@/components/RenewPlans";
import ContinuePaymentButton from "@/components/ContinuePaymentButton";
import ExtensionInstallGuide from "@/components/ExtensionInstallGuide";

export const metadata: Metadata = {
  title: "Dashboard · SatuBox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireSession();

  if (isAdminEmail(user.email)) {
    redirect("/admin");
  }

  const db = getDb();
  const doc = await db.collection("users").doc(user.uid).get();
  if (!doc.exists) {
    redirect("/login");
  }

  const profile = doc.data()!;
  const expiresAtMs = (profile.expiresAtMs as number) ?? 0;
  /* eslint-disable-next-line react-hooks/purity */
  const now = Date.now();
  const subscriptionStatus =
    (profile.subscriptionStatus as string | undefined) ??
    (expiresAtMs > now ? "ACTIVE" : "EXPIRED");
  const isPending = subscriptionStatus === "PENDING_PAYMENT";
  const isExpired = !isPending && expiresAtMs <= now;
  const isActive = !isPending && !isExpired;

  const pendingPayment = isPending
    ? await getLatestPendingPaymentForUser(user.uid)
    : null;

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
            <p className="text-sm text-text-secondary">Paket</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {profile.planLabel}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Berakhir pada</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {isPending ? "-" : formatExpiryDate(expiresAtMs)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-text-secondary">Sisa waktu</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {isPending ? (
                <span className="text-amber-300">Menunggu pembayaran</span>
              ) : (
                <SubscriptionCountdown
                  expiresAtMs={expiresAtMs}
                  unit={PLAN_UNIT}
                />
              )}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-dim">
              <div
                className={
                  isActive
                    ? "h-full rounded-full bg-brand-500"
                    : "h-full w-0 rounded-full"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="mt-6 rounded-3xl border border-amber-500/40 bg-amber-500/10 px-8 py-6">
          <h3 className="text-base font-semibold text-amber-200">
            Menunggu pembayaran
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Akun kamu dibuat. Selesaikan pembayaran untuk mengaktifkan langganan.
            {typeof profile.planAmount === "number" ? (
              <> Paket: <span className="font-semibold text-text-primary">{profile.planLabel} · {formatRupiah(profile.planAmount)}</span>.</>
            ) : null}
          </p>
          <div className="mt-4">
            <Link
              href={
                pendingPayment
                  ? `/payment?ref=${encodeURIComponent(pendingPayment.refId)}`
                  : "/payment"
              }
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.98]"
            >
              Lanjutkan Pembayaran
            </Link>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            Access extension baru aktif setelah pembayaran berhasil diverifikasi.
          </p>
        </div>
      )}

      {isExpired && (
        <div className="mt-6 rounded-3xl border border-red-500/40 bg-red-500/10 px-8 py-6">
          <h3 className="text-base font-semibold text-red-300">
            Langganan kedaluwarsa
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Langganan sudah kedaluwarsa. Lanjutkan pembayaran atau pilih paket lain untuk aktif lagi.
          </p>
          <div className="mt-4">
            <ContinuePaymentButton planId={profile.planId} label="Perpanjang Layanan" />
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-surface-dim px-5 py-4">
            <RenewPlans />
          </div>
          <p className="mt-4 text-xs text-text-muted">
            Perpanjangan menambahkan durasi ke sisa waktu yang masih ada (tidak mengurangi).
          </p>
        </div>
      )}
      <ExtensionInstallGuide />
    </main>
  );
}