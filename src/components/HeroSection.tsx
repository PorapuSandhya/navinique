import { motion } from "framer-motion";
import heroImg from "@/assets/hero-boutique.jpg";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Elegant boutique fashion"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gold font-elegant text-lg md:text-xl italic mb-4 tracking-wider"
          >
            ✦ Where Tradition Meets Elegance
          </motion.p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
            Elegance{" "}
            <span className="text-gold-gradient">Woven</span>{" "}
            with Love
          </h1>
          <p className="font-body text-foreground/70 text-base md:text-lg mb-8 leading-relaxed max-w-md">
            Discover handcrafted ethnic wear that celebrates the beauty of Indian
            tradition with a modern touch. Curated by Devi & Naveen.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gold-gradient text-background font-body font-bold px-8 py-3.5 rounded-sm tracking-wider uppercase text-sm hover-gold-glow transition-all hover:scale-105">
              Shop Now
            </button>
            <button className="border-2 border-gold text-gold font-body font-bold px-8 py-3.5 rounded-sm tracking-wider uppercase text-sm hover:bg-gold hover:text-background transition-all">
              Explore Collection
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
