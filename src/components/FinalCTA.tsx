const chips = [
  "30 aplikasi premium",
  "3 kategori lengkap",
  "Mulai Rp39rb/bulan",
];

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal relative overflow-hidden rounded-3xl border border-brand-500/30 bg-brand-500 px-6 py-16 text-center md:px-16 md:py-24">
          {/* Glow orbs */}
          <div
            className="animate-pulse-soft pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-400/40 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="animate-pulse-soft pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-800/50 blur-3xl"
            aria-hidden="true"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 blur-3xl"
            aria-hidden="true"
          />

          {/* Sparkles */}
          <div className="float-animate pointer-events-none absolute top-12 left-10 hidden text-brand-200/60 md:block" aria-hidden="true" style={{ animationDelay: "0.5s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z" /></svg>
          </div>
          <div className="float-animate pointer-events-none absolute right-12 bottom-14 hidden text-brand-200/50 md:block" aria-hidden="true" style={{ animationDelay: "1.6s" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z" /></svg>
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-brand-100">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-200" />
              Mulai hemat dari hari pertama
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Jangan tunda langgananmu.
              <br />
              30 aplikasi siap dipakai hari ini.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-brand-100">
              Pilih paket, selesaikan pembayaran, dan langsung akses aplikasi
              premium untuk kuliah &amp; harimu. Semakin lama durasinya, semakin
              hemat.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-100"
                >
                  {chip}
                </span>
              ))}
            </div>

            <a
              href="#harga"
              className="mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-10 text-base font-semibold text-brand-700 shadow-lg shadow-brand-900/30 transition-all hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-xl active:scale-[0.97]"
            >
              Mulai Berlangganan Sekarang
              <svg
                width="17"
                height="17"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}