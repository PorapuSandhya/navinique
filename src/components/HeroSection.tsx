import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImg1 from "@/assets/hero-boutique.jpg";
import heroImg2 from "@/assets/hero-slide-2.jpg";
import heroImg3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroImg1,
    tagline: "✦ Where Tradition Meets Elegance",
    heading: ["Elegance ", "Woven", " with Love"],
    description: "Discover handcrafted ethnic wear that celebrates the beauty of Indian tradition with a modern touch.",
  },
  {
    image: heroImg2,
    tagline: "✦ Curated Collections",
    heading: ["Style ", "Defined", " by You"],
    description: "Explore our handpicked sarees, lehengas, and designer wear for every special occasion.",
  },
  {
    image: heroImg3,
    tagline: "✦ Bridal Splendor",
    heading: ["Your ", "Dream", " Look Awaits"],
    description: "Find the perfect bridal ensemble crafted with love, tradition, and exquisite detailing.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="Boutique fashion" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-gold font-elegant text-lg md:text-xl italic mb-4 tracking-wider">
              {slide.tagline}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
              {slide.heading[0]}
              <span className="text-gold-gradient">{slide.heading[1]}</span>
              {slide.heading[2]}
            </h1>
            <p className="font-body text-foreground/70 text-base md:text-lg mb-8 leading-relaxed max-w-md">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#products" className="bg-gold-gradient text-background font-body font-bold px-8 py-3.5 rounded-sm tracking-wider uppercase text-sm hover-gold-glow transition-all hover:scale-105">
                Shop Now
              </a>
              <a href="#collections" className="border-2 border-gold text-gold font-body font-bold px-8 py-3.5 rounded-sm tracking-wider uppercase text-sm hover:bg-gold hover:text-background transition-all">
                Explore Collection
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/30 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-gold/50 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/30 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-gold/50 transition-colors">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-gold w-8" : "bg-foreground/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
