const resolvedUrl = (
	(process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
		(process.env.VERCEL_PROD_URL
			? `https://${process.env.VERCEL_PROD_URL}`
			: "https://satubox.id")) || "https://satubox.id"
).replace(/\/+$/, "");

export const site = {
  name: "SatuBox",
  tagline: "Paket aplikasi premium untuk pelajar & mahasiswa",
  // Wajib: set NEXT_PUBLIC_SITE_URL ke domain final (mis. https://satubox.id) di Vercel
  // Fallback otomatis ke VERCEL_PROD_URL (domain *.vercel.app) saat deploy.
  url: resolvedUrl,
  logo: "/icon.webp",
  ogImage: "/og.png",
  description:
    "SatuBox kasih akses 30 aplikasi premium dalam 1 paket: ChatGPT, Canva, sampai Netflix. Aktivasi cepat, langsung aktif. Mulai Rp39.000/bulan untuk pelajar & mahasiswa Indonesia.",
} as const;