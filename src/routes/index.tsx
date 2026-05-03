import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewArrivals from "@/components/NewArrivals";
import GallerySection from "@/components/GallerySection";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Navinique — Elegance Woven with Love" },
      { name: "description", content: "Discover handcrafted ethnic wear at Navinique. Sarees, lehengas, kurtis, and bridal wear curated by Sandhya & Naveen." },
      { property: "og:title", content: "Navinique — Elegance Woven with Love" },
      { property: "og:description", content: "Handcrafted ethnic wear that celebrates Indian tradition with modern elegance." },
    ],
  }),
  component: Index,
});

function Index() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small delay to ensure all sections are rendered
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedCollections />
      <NewArrivals />
      <GallerySection />
      <AboutUs />
      <Services />
      <Testimonials />
      <Newsletter />
      <ContactSection />
      <Footer />
    </div>
  );
}
