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

const TITLE = `${site.name} — Paket Aplikasi Premium Mulai Rp39.000/bulan`;

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: TITLE,
		template: `%s · ${site.name}`,
	},
	description: site.description,
	applicationName: site.name,
	icons: {
		icon: {
			url: `${site.url}/icon.png`,
			sizes: "512x512",
			type: "image/png",
		},
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "id_ID",
		url: "/",
		siteName: site.name,
		title: TITLE,
		description: site.description,
		images: [
			{
				url: site.ogImage,
				alt: site.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: site.description,
		images: [site.ogImage],
	},
	category: "education",
};

const siteGraphJsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": `${site.url}/#organization`,
			name: site.name,
			url: site.url,
			logo: {
				"@type": "ImageObject",
				url: `${site.url}${site.logo}`,
			},
			description: site.description,
			areaServed: "ID",
			sameAs: [site.instagram],
		},
		{
			"@type": "WebSite",
			"@id": `${site.url}/#website`,
			name: site.name,
			url: site.url,
			inLanguage: "id-ID",
			publisher: {
				"@id": `${site.url}/#organization`,
			},
		},
	],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="id" className={`${inter.variable} antialiased`}>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd) }}
				/>
			</head>
			<body className="min-h-screen">
				{children}
				<a
					href={site.instagram}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Hubungi CS admin ${site.name} via Instagram @satuboxx`}
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
