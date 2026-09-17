import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import { formatRupiah, plans, type PlanMonths } from "@/lib/plans";
import { site } from "@/lib/site";

export function generateMetadata({ params }: { params: Promise<{ months: string }> }): Promise<Metadata> {
  return params.then(({ months }) => {
    const m = Number(months);
    if (!(m in plans)) return {};
    const plan = plans[m as PlanMonths];
    return {
      title: `Checkout Paket ${plan.label} ${formatRupiah(plan.amount)}`,
      description: `Lanjutkan pembayaran paket SatuBox ${plan.label}. Akses 30 aplikasi premium langsung aktif setelah pembayaran konfirmasi.`,
      robots: { index: false, follow: true },
    };
  });
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ months: string }>;
}) {
  const { months } = await params;
  const m = Number(months);
  if (!(m in plans)) notFound();

  const plan = plans[m as PlanMonths];

  return (
    <main className="relative min-h-screen overflow-hidden pb-16 pt-10 sm:pt-16">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="animate-pulse-soft absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5 md:px-8">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="Kembali ke beranda SatuBox"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface">
              <Image
                src={site.logo}
                alt=""
                width={36}
                height={36}
                className="object-contain"
              />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-text-primary">
              SatuBox
            </span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
            Checkout
          </span>
        </header>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Checkout Paket {plan.label}
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Isi data di bawah, lalu lanjut ke pembayaran. 30 aplikasi premium
            aktif otomatis setelah pembayaran terkonfirmasi.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-2" role="tablist" aria-label="Pilih paket">
          {(Object.keys(plans) as unknown as PlanMonths[]).map((k) => {
            const other = plans[k];
            const active = k === m;
            return (
              <Link
                key={k}
                href={`/checkout/${k}`}
                role="tab"
                aria-selected={active}
                className={`rounded-xl px-3 py-3 text-center transition-all ${
                  active
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "text-text-secondary hover:bg-surface-dim"
                }`}
              >
                <span className="block text-sm font-bold">{other.label}</span>
                <span
                  className={`mt-0.5 block text-xs ${
                    active ? "text-brand-100" : "text-text-muted"
                  }`}
                >
                  {formatRupiah(other.amount)}
                </span>
              </Link>
            );
          })}
        </div>

        <CheckoutForm months={m as PlanMonths} />
      </div>
    </main>
  );
}