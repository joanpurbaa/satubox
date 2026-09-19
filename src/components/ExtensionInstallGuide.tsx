const steps = [
  {
    title: "Download file extension",
    desc: "Klik tombol di atas untuk mengunduh paket extension. Isinya satu folder bernama satubox.",
  },
  {
    title: "Ekstrak / unzip file",
    desc: "Unzip file-nya. Akan muncul folder bernama satubox yang berisi manifest.json. Simpan folder ini di lokasi yang mudah ditemukan.",
  },
  {
    title: "Buka halaman extension",
    desc: "Buka Google Chrome, lalu ketik chrome://extensions di address bar dan tekan Enter.",
  },
  {
    title: "Aktifkan Developer Mode",
    desc: "Aktifkan toggle Developer mode di pojok kanan atas halaman.",
  },
  {
    title: "Load unpacked",
    desc: "Klik tombol &quot;Load unpacked&quot;, lalu pilih folder satubox hasil ekstrak tadi. Extension SatuBox Akses muncul di daftar.",
  },
  {
    title: "Akses via ikon puzzle",
    desc: "Klik ikon puzzle di toolbar Chrome, lalu pilih SatuBox Akses untuk membuka popup extension.",
  },
  {
    title: "Login dengan akun SatuBox",
    desc: "Masuk pakai akun SatuBox yang baru dibuat. Setelah login, kamu bisa mengakses banyak platform dari extension.",
  },
];

export default function ExtensionInstallGuide() {
  return (
    <div className="mt-6 rounded-3xl border border-border bg-surface/80 px-8 py-8 shadow-xl shadow-black/30 backdrop-blur-md">
      <div className="max-h-max">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Q8Xr7_MLzYU?si=u6kTUr16dYLN-Gsf"
          title="Tutorial Instalasi SatuBox Extension"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Instalasi Extension</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Ikuti langkah berikut untuk memasang SatuBox Akses di Chrome.
          </p>
        </div>
        <a
          href="/satubox-ext.zip"
          download="satubox-ext.zip"
          className="sheen inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-400 active:scale-[0.97]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download Extension (folder satubox)
        </a>
      </div>

      <ol className="mt-8 space-y-4">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-300">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-text-primary">{step.title}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 border-t border-border pt-4 text-xs text-text-muted">
        Ada kendala saat instalasi? Chat CS admin kami di{" "}
        <a
          href="https://www.instagram.com/satuboxx"
          className="font-semibold text-brand-300 hover:text-brand-200">
          @satuboxx
        </a>
        .
      </p>
    </div>
  );
}