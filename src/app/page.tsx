import type { Metadata } from "next";
import { site, getSiteUrl } from "@/lib/site";
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

export async function generateMetadata(): Promise<Metadata> {
	const url = await getSiteUrl();
	const ogImage = `${url}${site.ogImage}`;
	return {
		alternates: { canonical: `${url}/` },
		openGraph: {
			title: `${site.name}: 30 Aplikasi Premium, Sekali Bayar Mulai Rp39.000`,
			description: site.description,
			type: "website",
			locale: "id_ID",
			siteName: site.name,
			url: `${url}/`,
			images: [
				{
					url: ogImage,
					width: 1672,
					height: 941,
					alt: "SatuBox: 30 aplikasi premium untuk pelajar & mahasiswa, mulai Rp39.000/bulan",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${site.name}: 30 Aplikasi Premium, Sekali Bayar Mulai Rp39.000`,
			description: site.description,
			images: [ogImage],
		},
	};
}

export default function Home() {
  return (
    <>
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