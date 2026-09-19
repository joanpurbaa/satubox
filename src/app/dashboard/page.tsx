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
import ExtensionInstallGuide from "@/components/ExtensionInstallGuide";

export const metadata: Metadata = {
  title: "Dashboard · SatuBox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ONBOARDING_STEPS = [
  {
    title: "Install SatuBox Extension",
    desc: "Unduh file extension (.zip) lalu unzip, dan muat via chrome://extensions (Developer mode).",
  },
  {
    title: "Buka extension di browser",
    desc: "Klik ikon puzzle di toolbar Chrome, lalu pilih SatuBox Akses.",
  },
  {
    title: "Login menggunakan akun SatuBox",
    desc: "Masuk pakai akun ini di popup extension untuk mengakses semua platform.",
  },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await requireSession();
  const params = await searchParams;

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
  const welcome = params.welcome === "1";

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

      {welcome && isActive && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-brand-500/50 bg-brand-500/10 shadow-xl shadow-black/30 backdrop-blur-md">
          <div className="px-8 py-6">
            <p className="text-2xl">Pembayaran berhasil 🎉</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-text-secondary">Paket</p>
                <p className="mt-1 font-semibold text-text-primary">{profile.planLabel}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Status</p>
                <p className="mt-1 font-semibold text-brand-300">Aktif</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-text-secondary">Berlaku sampai</p>
                <p className="mt-1 font-semibold text-text-primary">{formatExpiryDate(expiresAtMs)}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-brand-500/30 px-8 py-6">
            <p className="font-semibold text-text-primary">Mulai gunakan SatuBox</p>
            <ol className="mt-4 space-y-3">
              {ONBOARDING_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-200">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-text-primary">{step.title}</p>
                    <p className="text-sm text-text-secondary">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-2xl border border-border bg-surface-dim px-5 py-4">
              <p className="text-sm text-text-secondary">Username: <span className="font-semibold text-text-primary">{profile.username}</span></p>
              <p className="mt-1 text-sm text-text-secondary">
                Untuk password, gunakan password yang kamu buat saat mendaftar.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/satubox-ext.zip"
                download="satubox-ext.zip"
                className="sheen inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-400 active:scale-[0.97]"
              >
                Download Extension (.zip)
              </a>
              <span className="inline-flex items-center text-xs text-text-muted">
                Panduan lengkap di bawah.
              </span>
            </div>
          </div>
        </div>
      )}

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
            Pilih paket untuk memperpanjang langganan. Pembayaran dilakukan lewat QRIS.
          </p>
          <div className="mt-4">
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