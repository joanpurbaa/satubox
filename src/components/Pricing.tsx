import type { CSSProperties } from "react";
import Link from "next/link";

interface Plan {
  months: 1 | 3 | 6;
  price: string;
  duration: string;
  framing: string;
  highlighted?: boolean;
  badge?: string;
  effective: string;
}

const plans: Plan[] = [
  {
    months: 1,
    price: "Rp39.000",
    duration: "1 Bulan",
    framing: "Buat yang mau cobain dulu",
    effective: "Rp39.000/bulan",
  },
  {
    months: 3,
    price: "Rp99.000",
    duration: "3 Bulan",
    framing: "Paling banyak dipilih mahasiswa",
    highlighted: true,
    badge: "Paling Dipilih",
    effective: "Rp33.000/bulan",
  },
  {
    months: 6,
    price: "Rp179.000",
    duration: "6 Bulan",
    framing: "Makin lama, makin hemat",
    effective: "Rp29.000/bulan",
  },
];

export default function Pricing() {
  return (
    <section className="relative py-24 md:py-32" id="harga">
      <div
        className="bg-grid bg-grid-lg-align"
        style={{ "--grid-col": "220.8px" } as CSSProperties}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[420px] w-[720px] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
            05 · Harga
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Mulai Rp39.000, semua aplikasi aktif
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Semua paket dapat akses ke 30 aplikasi premium lengkap. Yang beda cuma
            durasinya, jadi makin lama makin hemat.
          </p>
        </div>

        <div className="reveal-stagger mt-16 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.months}
              className={`relative flex flex-col rounded-3xl border p-8 text-center lg:p-9 ${
                plan.highlighted
                  ? "z-10 order-first border-brand-500 bg-brand-500 text-white shadow-xl shadow-brand-500/30 lg:order-none lg:-translate-y-8 lg:scale-[1.03]"
                  : "border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300 px-4 py-1 text-xs font-bold text-brand-900">
                  {plan.badge}
                </span>
              )}

              <p
                className={`text-sm font-medium ${
                  plan.highlighted ? "text-brand-100" : "text-text-secondary"
                }`}
              >
                {plan.duration}
              </p>
              <p
                className={`mt-3 text-lg ${
                  plan.highlighted ? "text-brand-100" : "text-text-secondary"
                }`}
              >
                {plan.framing}
              </p>

              <p className="mt-2 text-5xl font-extrabold tracking-tight">
                {plan.price}
              </p>
              <p
                className={`mt-2 text-sm ${
                  plan.highlighted ? "text-brand-100" : "text-text-muted"
                }`}
              >
                per {plan.duration}
              </p>

              <ul
                className={`mx-auto mt-8 flex max-w-sm flex-1 flex-col gap-3 text-left text-sm ${
                  plan.highlighted ? "text-white" : "text-text-secondary"
                }`}
              >
                {[
                  "Akses ke 30 aplikasi premium",
                  "Semua kategori: study, creative, entertainment",
                  "Support jika ada kendala akses",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`mt-0.5 shrink-0 ${
                        plan.highlighted ? "text-brand-200" : "text-brand-400"
                      }`}
                      aria-hidden="true"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        fill={plan.highlighted ? "#cbbdff" : "#221e37"}
                      />
                      <path
                        d="M6 10.5l2.5 2.5L14 7.5"
                        stroke={plan.highlighted ? "#fff" : "#916fff"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href={`/checkout/${plan.months}`}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                    plan.highlighted
                      ? "bg-white text-brand-700 hover:bg-brand-50"
                      : "sheen bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400"
                  }`}
                >
                  {plan.highlighted ? "Mulai Berlangganan" : "Pilih Paket Ini"}
                </Link>
              </div>

              <p
                className={`mt-4 text-xs ${
                  plan.highlighted ? "text-brand-100/80" : "text-text-muted"
                }`}
              >
                Efektif {plan.effective}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}