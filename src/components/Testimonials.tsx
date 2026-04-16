import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    text: "The bridal lehenga I got from Devi Elegance was absolutely stunning! The craftsmanship and attention to detail were exceptional.",
    rating: 5,
    location: "Hyderabad",
  },
  {
    name: "Anita Reddy",
    text: "I've been a loyal customer for years. Their saree collection is unmatched. Every piece feels like a work of art.",
    rating: 5,
    location: "Vijayawada",
  },
  {
    name: "Meera Patel",
    text: "The custom stitching service is fantastic. They transformed my mother's old silk into a beautiful modern outfit.",
    rating: 5,
    location: "Bangalore",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-blush-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">What Our Customers Say</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Testimonials
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card p-6 rounded-lg border border-border relative"
            >
              <Quote size={32} className="text-gold-light/40 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-foreground/70 text-sm leading-relaxed mb-4 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-light/30 flex items-center justify-center font-display font-bold text-gold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-body font-bold text-foreground text-sm">{t.name}</p>
                  <p className="font-body text-muted-foreground text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
