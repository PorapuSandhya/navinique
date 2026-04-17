import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import bridalImg from "@/assets/gal-bridal.jpg";
import silkSareesImg from "@/assets/gal-silk-sarees.jpg";
import kurtisImg from "@/assets/gal-kurtis.jpg";
import accessoriesImg from "@/assets/gal-accessories.jpg";
import kidsImg from "@/assets/gal-kids.jpg";
import lehengasImg from "@/assets/gal-lehengas.jpg";

const GALLERY_IMAGES: Record<string, string> = {
  "Bridal Collection": bridalImg,
  "Silk Sarees": silkSareesImg,
  "Festive Kurtis": kurtisImg,
  "Ethnic Accessories": accessoriesImg,
  "Kids Ethnic Wear": kidsImg,
  "Designer Lehengas": lehengasImg,
};

// Map gallery titles + categories to product category slugs
const TITLE_TO_SLUG: Record<string, string> = {
  "Bridal Collection": "lehengas",
  "Silk Sarees": "sarees",
  "Festive Kurtis": "kurtis",
  "Ethnic Accessories": "accessories",
  "Kids Ethnic Wear": "kids-wear",
  "Designer Lehengas": "lehengas",
};

const CATEGORY_TO_SLUG: Record<string, string> = {
  Sarees: "sarees",
  Lehengas: "lehengas",
  Kurtis: "kurtis",
  "Kids Wear": "kids-wear",
  Accessories: "accessories",
  Bridal: "lehengas",
};

const SLUG_TO_NAME: Record<string, string> = {
  sarees: "Sarees",
  lehengas: "Lehengas",
  kurtis: "Kurtis",
  "kids-wear": "Kids Wear",
  accessories: "Accessories",
};

type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
};

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState("All");
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, title, image_url, category")
      .order("sort_order")
      .then(({ data }) => setImages(data || []));

    supabase
      .from("categories")
      .select("id, slug")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((c) => {
          map[c.slug] = c.id;
        });
        setCategoryMap(map);
      });
  }, []);

  const handleImageClick = (img: GalleryImage) => {
    const slug =
      TITLE_TO_SLUG[img.title] ||
      (img.category ? CATEGORY_TO_SLUG[img.category] : undefined);
    if (!slug) return;
    const id = categoryMap[slug];
    if (!id) return;
    window.dispatchEvent(
      new CustomEvent("category-selected", {
        detail: { id, slug, name: SLUG_TO_NAME[slug] || img.category || img.title },
      })
    );
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categories = ["All", ...Array.from(new Set(images.map((i) => i.category).filter(Boolean)))];
  const filtered = filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <section id="gallery" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">Our Lookbook</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Gallery</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as string)}
                className={`px-4 py-2 rounded-sm font-body text-xs uppercase tracking-wider transition-all ${
                  filter === cat
                    ? "bg-gold text-background font-bold"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={GALLERY_IMAGES[img.title] || img.image_url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="font-display text-sm font-bold text-cream">{img.title}</p>
                {img.category && (
                  <p className="font-body text-xs text-cream/70">{img.category}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-body text-muted-foreground py-12">Gallery coming soon...</p>
        )}
      </div>
    </section>
  );
}
