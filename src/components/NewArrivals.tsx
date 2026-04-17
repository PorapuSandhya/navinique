import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";
import sareeBlue from "@/assets/prod-saree-blue.jpg";
import sareeMaroon from "@/assets/prod-saree-maroon.jpg";
import kurtiPink from "@/assets/prod-kurti-pink.jpg";
import kurtiYellow from "@/assets/prod-kurti-yellow.jpg";
import lehengaGreen from "@/assets/prod-lehenga-green.jpg";
import lehengaRed from "@/assets/prod-lehenga-red.jpg";
import kidsAnarkali from "@/assets/prod-kids-anarkali.jpg";
import necklace from "@/assets/prod-necklace.jpg";

const PRODUCT_IMAGES: Record<string, string> = {
  "Royal Blue Silk Saree": sareeBlue,
  "Maroon Silk Saree": sareeMaroon,
  "Pink Embroidered Kurti": kurtiPink,
  "Yellow Festive Kurti": kurtiYellow,
  "Green Bridal Lehenga": lehengaGreen,
  "Red Bridal Lehenga": lehengaRed,
  "Kids Anarkali Set": kidsAnarkali,
  "Gold Temple Necklace": necklace,
};

type Product = {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number | null;
  image_url: string | null;
  tag: string | null;
};

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, original_price, rating, image_url, tag")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setProducts(data || []));
  }, []);

  const handleAddToCart = async (productId: string) => {
    setAdding(productId);
    try {
      await addToCart(productId);
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(null);
    }
  };

  return (
    <section id="products" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">Just In</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Products</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={PRODUCT_IMAGES[p.name] || p.image_url || "https://placehold.co/600x800?text=Product"}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.tag && (
                  <span className="absolute top-3 left-3 bg-gold text-background text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                    {p.tag}
                  </span>
                )}
                <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center text-foreground/50 hover:text-rose transition-colors">
                  <Heart size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    disabled={adding === p.id}
                    className="w-full bg-gold text-background font-body font-bold py-2 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag size={14} />
                    {adding === p.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-display text-sm md:text-base font-semibold text-foreground truncate">{p.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={12} className={idx < Math.floor(p.rating || 0) ? "fill-gold text-gold" : "text-border"} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{p.rating}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-body font-bold text-foreground text-sm md:text-base">₹{p.price.toLocaleString()}</span>
                  {p.original_price && (
                    <span className="font-body text-muted-foreground line-through text-xs">₹{p.original_price.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
