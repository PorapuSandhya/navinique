import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

export default function FeaturedCollections() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, slug, image_url")
      .order("created_at")
      .then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <section id="collections" className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">Curated for You</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Collections</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image_url || `https://placehold.co/400x533?text=${cat.name}`}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-lg font-bold text-cream">{cat.name}</h3>
                <p className="font-body text-xs text-cream/80 uppercase tracking-wider mt-1">
                  Shop Now →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
