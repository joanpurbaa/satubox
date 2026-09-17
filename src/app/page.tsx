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