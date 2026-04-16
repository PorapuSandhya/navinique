import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewArrivals from "@/components/NewArrivals";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Devi Elegance Boutique — Elegance Woven with Love" },
      { name: "description", content: "Discover handcrafted ethnic wear at Devi Elegance Boutique. Sarees, lehengas, kurtis, and bridal wear curated by Devi & Naveen." },
      { property: "og:title", content: "Devi Elegance Boutique — Elegance Woven with Love" },
      { property: "og:description", content: "Handcrafted ethnic wear that celebrates Indian tradition with modern elegance." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedCollections />
      <NewArrivals />
      <AboutUs />
      <Services />
      <Testimonials />
      <Newsletter />
      <ContactSection />
      <Footer />
    </div>
  );
}
