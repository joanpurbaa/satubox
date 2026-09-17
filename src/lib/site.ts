import { headers } from "next/headers";

const resolvedUrl = (
	process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
	(process.env.VERCEL_PROD_URL
		? `https://${process.env.VERCEL_PROD_URL}`
		: "https://satubox.id") ||
	"https://satubox.id"
).replace(/\/+$/, "");

export const site = {
	name: "Satubox",
	tagline: "Paket aplikasi premium untuk pelajar & mahasiswa",
	// site.url = production URL yang deterministik.
	// WAJIB dipakai untuk canonical & JSON-LD (Google butuh URL yang stabil).
	url: resolvedUrl,
	logo: "/icon.png",
	ogImage: "/og.webp",
	instagram: "https://www.instagram.com/satuboxx",
	description:
		"Satubox kasih akses 30 aplikasi premium dalam 1 paket: ChatGPT, Canva, sampai Netflix. Aktivasi cepat, langsung aktif. Mulai Rp39.000/bulan untuk pelajar & mahasiswa Indonesia.",
} as const;

// Server-only: kembalikan origin asli dari request host.
// CATATAN: jangan pakai fungsi ini untuk canonical/JSON-LD/OG url —
// pakai site.url (deterministik). getSiteUrl() hanya untuk kebutuhan
// non-SEO yang benar-benar butuh tahu host request saat ini.
export async function getSiteUrl(): Promise<string> {
	const h = await headers();
	const proto = h.get("x-forwarded-proto") ?? "https";
	const host = h.get("x-forwarded-host") ?? h.get("host");
	if (host) return `${proto}://${host}`.replace(/\/+$/, "");
	return site.url;
}
