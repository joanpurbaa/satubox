import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: `${site.name}: Paket 30 Aplikasi Premium Mulai Rp39.000/bulan`,
		template: `%s · ${site.name}`,
	},
	description: site.description,
	keywords: [
		"aplikasi premium mahasiswa",
		"paket aplikasi premium",
		"langganan aplikasi murah",
		"berlangganan netflix canva chatgpt murah",
		"aplikasi untuk kuliah",
		"tools produktivitas mahasiswa",
		"paket berlangganan aplikasi hemat",
		"aplikasi premium dalam satu paket",
	],
	applicationName: site.name,
	icons: {
		icon: "/icon.png",
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: `${site.name}: 30 Aplikasi Premium, Sekali Bayar Mulai Rp39.000`,
		description: site.description,
		type: "website",
		locale: "id_ID",
		siteName: site.name,
		url: "/",
		images: [
			{
				url: "/og.webp",
				width: 1254,
				height: 1254,
				alt: "Logo SatuBox · Paket aplikasi premium mahasiswa",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${site.name}: 30 Aplikasi Premium, Sekali Bayar Mulai Rp39.000`,
		description: site.description,
		images: ["/icon.png"],
	},
	category: "education",
};

const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: site.name,
	url: site.url,
	logo: `${site.url}${site.logo}`,
	description: site.description,
	slogan: "30 aplikasi premium mahasiswa dalam satu paket",
	areaServed: "ID",
	sameAs: ["https://www.instagram.com/satuboxx"],
};

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Apakah SatuBox aman digunakan?",
			acceptedAnswer: {
				"@type": "Answer",
				text:
					"Aman. SatuBox hanya menyediakan akses aplikasi premium melalui proses yang sudah terverifikasi. Kamu tetap memakai akun dan data pribadimu sendiri, dan bisa menghubungi tim support setiap ada kendala.",
			},
		},
		{
			"@type": "Question",
			name: "Bagaimana cara aktivasi setelah bayar?",
			acceptedAnswer: {
				"@type": "Answer",
				text:
					"Setelah pembayaran berhasil, kamu menerima instruksi aktivasi lengkap. Daftarkan akunmu ke aplikasi yang tersedia dan langsung bisa dipakai.",
			},
		},
		{
			"@type": "Question",
			name: "Apakah semua aplikasi langsung aktif bersamaan?",
			acceptedAnswer: {
				"@type": "Answer",
				text:
					"Ya, semua aplikasi premium dalam paket bisa diakses selama satu periode langganan berjalan. Tidak perlu berlangganan per aplikasi lagi.",
			},
		},
		{
			"@type": "Question",
			name: "Apakah bisa upgrade atau ganti paket?",
			acceptedAnswer: {
				"@type": "Answer",
				text:
					"Bisa. Kamu bisa menyesuaikan durasi paket sesuai kebutuhanmu. Detail proses upgrade bisa ditanyakan langsung ke CS admin SatuBox di Instagram @satuboxx.",
			},
		},
		{
			"@type": "Question",
			name: "Bagaimana kalau ada kendala akses?",
			acceptedAnswer: {
				"@type": "Answer",
				text:
					"Tim support SatuBox siap membantu mulai dari aktivasi gagal sampai aplikasi tidak bisa diakses. Chat CS admin kami di Instagram @satuboxx.",
			},
		},
	],
};

const productJsonLd = {
	"@context": "https://schema.org",
	"@type": "Product",
	name: `${site.name} · Paket Aplikasi Premium`,
	description: site.description,
	image: `${site.url}${site.logo}`,
	brand: { "@type": "Brand", name: site.name },
	offers: {
		"@type": "AggregateOffer",
		priceCurrency: "IDR",
		lowPrice: "39000",
		highPrice: "179000",
		offerCount: "3",
		availability: "https://schema.org/InStock",
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="id" className={`${inter.variable} antialiased`}>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
				/>
			</head>
			<body className="min-h-screen">
				{children}
				<a
					href="https://www.instagram.com/satuboxx"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Hubungi CS admin SatuBox via Instagram @satuboxx"
					className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300">
					<span className="pointer-events-none absolute inset-0 rounded-full">
						<Image
							src="/instagram.png"
							alt=""
							fill
							sizes="56px"
							className="rounded-full object-contain p-1.5"
						/>
					</span>
					<span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-lg shadow-black/30 transition-opacity duration-200 sm:block">
						CS Admin @satuboxx
					</span>
				</a>
			</body>
		</html>
	);
}
