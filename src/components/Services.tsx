import { motion } from "framer-motion";
import { Scissors, Crown, Ruler } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Custom Stitching",
    description: "Get your outfits tailored to perfection with our expert tailors who bring your vision to life.",
  },
  {
    icon: Crown,
    title: "Bridal Consultation",
    description: "Personalized bridal wear consultation to help you find the perfect ensemble for your special day.",
  },
  {
    icon: Ruler,
    title: "Alterations",
    description: "Professional alteration services to ensure every outfit fits you like it was made just for you.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">What We Offer</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Our Services
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-lg bg-card border border-border hover:border-gold-light/50 hover-gold-glow transition-all group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-champagne flex items-center justify-center group-hover:bg-gold-light/30 transition-colors">
                <s.icon size={28} className="text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="font-body text-foreground/60 leading-relaxed text-sm">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
