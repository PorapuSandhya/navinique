import { motion } from "framer-motion";
import sarees from "@/assets/collection-sarees.jpg";
import lehengas from "@/assets/collection-lehengas.jpg";
import kurtis from "@/assets/collection-kurtis.jpg";
import kidswear from "@/assets/collection-kidswear.jpg";
import accessories from "@/assets/collection-accessories.jpg";

const collections = [
  { name: "Sarees", image: sarees, count: "120+ Designs" },
  { name: "Lehengas", image: lehengas, count: "85+ Designs" },
  { name: "Kurtis", image: kurtis, count: "200+ Designs" },
  { name: "Kids Wear", image: kidswear, count: "60+ Designs" },
  { name: "Accessories", image: accessories, count: "150+ Items" },
];

export default function FeaturedCollections() {
  return (
    <section id="collections" className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">Our Curated</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Featured Collections
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                <img
                  src={col.image}
                  alt={col.name}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="font-display text-lg font-semibold text-cream">{col.name}</h3>
                  <p className="font-body text-xs text-cream/80 mt-1">{col.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
