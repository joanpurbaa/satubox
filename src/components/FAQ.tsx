"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Apakah SatuBox aman digunakan?",
    answer:
      "Aman, karena kamu tetap memakai akun dan data pribadimu sendiri. SatuBox hanya menyediakan akses aplikasi premium melalui proses yang sudah terverifikasi. Ada kendala apa pun, tim support siap bantu.",
  },
  {
    question: "Bagaimana cara aktivasi setelah daftar?",
    answer:
      "Setelah akunmu aktif, langkah aktivasi langsung bisa diikuti di dashboard akun kamu. Secara umum, kamu tinggal mendaftarkan akunmu ke aplikasi yang tersedia dan aplikasinya langsung bisa dipakai. Prosesnya cepat, nggak perlu nunggu berhari-hari.",
  },
  {
    question: "Apakah bisa upgrade atau ganti paket?",
    answer:
      "Bisa. Kamu bisa menyesuaikan durasi paket sesuai kebutuhanmu. Detail proses upgrade dan selisih biayanya bisa kamu tanyakan langsung ke CS admin kami di Instagram @satuboxx.",
  },
  {
    question: "Bagaimana kalau ada kendala akses?",
    contact: true,
    answer:
      "Tim support kami siap membantu setiap kendala, mulai dari aktivasi yang gagal sampai aplikasi yang tidak bisa diakses. Langsung chat CS admin kami di Instagram @satuboxx, atau hubungi kami melalui kontak yang tersedia di halaman ini.",
  },
  {
    question: "Apakah semua aplikasi langsung aktif bersamaan?",
    answer:
      "Ya, semua aplikasi premium dalam paket bisa diakses selama satu periode langgananmu berjalan. Tidak perlu ribet berlangganan per aplikasi satu-satu lagi. Satu bayar, semua kebuka.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface-alt py-20 md:py-28" id="faq">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="reveal text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
            06 · FAQ
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Masih ragu? Ini jawaban sebelum kamu berlangganan
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Pertanyaan paling sering ditanya soal langganan aplikasi premium SatuBox,
            dijawab ringkas.
          </p>
        </div>

        <div className="reveal-stagger mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="text-base font-semibold text-text-primary md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      open
                        ? "rotate-45 bg-brand-500 text-white"
                        : "bg-surface-dim text-text-secondary"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8 3v10M3 8h10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className={`grid transition-all duration-300 ease-in-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-text-secondary">
                      {faq.answer}
                    </p>
                    {faq.contact ? (
                      <a
                        href="https://www.instagram.com/satuboxx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-6 mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-dim px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-brand-500/40 hover:text-text-primary">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-brand-400"
                          aria-hidden="true">
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
                        </svg>
                        CS Admin: @satuboxx
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}