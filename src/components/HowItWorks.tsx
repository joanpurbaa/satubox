const steps = [
  {
    number: "1",
    title: "Pilih paket sesuai kebutuhan",
    desc: "Tentukan durasi langgananmu, 1, 3, atau 6 bulan. Semua paket akses ke 30 aplikasi.",
  },
  {
    number: "2",
    title: "Selesaikan pembayaran",
    desc: "Pilih metode pembayaran paling nyaman. Transaksi diproses cepat dan aman.",
  },
  {
    number: "3",
    title: "Terima instruksi aktivasi",
    desc: "Detail akses dikirim ke kamu. Ikuti langkahnya, tinggal daftarkan akunmu.",
  },
  {
    number: "4",
    title: "Mulai pakai semua aplikasi",
    desc: "ChatGPT untuk tugas, Canva untuk desain, Netflix untuk hiburan. Semua siap.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-surface-alt py-20 md:py-28" id="cara-kerja">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
            03 · Cara Kerja
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Daftar sampai aplikasi aktif cuma 4 langkah
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Pilih paket, bayar, selesai. Semua aplikasi premium langsung aktif
            bersamaan, tanpa nunggu lama.
          </p>
        </div>

        <ol className="reveal-stagger relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Dashed connector, desktop only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 left-[12.5%] right-[12.5%] hidden border-t border-dashed border-brand-500/20 lg:block"
          />

          {steps.map((step) => (
            <li
              key={step.number}
              className="relative rounded-2xl border border-border bg-surface p-7 transition-all hover:-translate-y-0.5 hover:shadow-md hover:rotate-3"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-lg shadow-brand-500/30">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-text-secondary">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}