import { headers } from "next/headers";

const resolvedUrl = (
	(process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
		(process.env.VERCEL_PROD_URL
			? `https://${process.env.VERCEL_PROD_URL}`
			: "https://satubox.id")) || "https://satubox.id"
).replace(/\/+$/, "");

export const site = {
  name: "SatuBox",
  tagline: "Paket aplikasi premium untuk pelajar & mahasiswa",
  // site.url dipakai saat build (fallback + sitemap/robots).
  // Untuk tag OG agar akurat di domain mana pun, gunakan getSiteUrl() (runtime headers).
  url: resolvedUrl,
  logo: "/icon.png",
  ogImage: "/og.png",
  description:
    "SatuBox kasih akses 30 aplikasi premium dalam 1 paket: ChatGPT, Canva, sampai Netflix. Aktivasi cepat, langsung aktif. Mulai Rp39.000/bulan untuk pelajar & mahasiswa Indonesia.",
} as const;

// Server-only: kembalikan origin asli dari request host, jadi selalu benar
// di domain produksi, *.vercel.app, sampai preview deployment.
export async function getSiteUrl(): Promise<string> {
	const h = await headers();
	const proto = h.get("x-forwarded-proto") ?? "https";
	const host = h.get("x-forwarded-host") ?? h.get("host");
	if (host) return `${proto}://${host}`.replace(/\/+$/, "");
	return site.url;
}