import type { Metadata } from "next";
import { site } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AppMarquee from "@/components/AppMarquee";
import ValueProp from "@/components/ValueProp";
import AppCategories from "@/components/AppCategories";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const TITLE = `${site.name} — Paket Aplikasi Premium Mulai Rp39.000/bulan`;

export const metadata: Metadata = {
	alternates: { canonical: `${site.url}/` },
	openGraph: {
		title: TITLE,
		description: site.description,
		type: "website",
		locale: "id_ID",
		siteName: site.name,
		url: `${site.url}/`,
		images: [
			{
				url: `${site.url}${site.ogImage}`,
				width: 1672,
				height: 941,
				alt: `${site.name} — paket aplikasi premium untuk pelajar & mahasiswa`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: site.description,
		images: [`${site.url}${site.ogImage}`],
	},
};

const webPageJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": `${site.url}/#webpage`,
	url: `${site.url}/`,
	name: TITLE,
	description: site.description,
	inLanguage: "id-ID",
	isPartOf: { "@id": `${site.url}/#website` },
	about: { "@id": `${site.url}/#organization` },
};

export default function Home() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
			/>
			<Navbar />
			<ScrollReveal />
			<main>
				<Hero />
				<AppMarquee />
				<ValueProp />
				<AppCategories />
				<HowItWorks />
				<Testimonials />
				<Pricing />
				<FAQ />
				<FinalCTA />
			</main>
			<Footer />
		</>
	);
}
