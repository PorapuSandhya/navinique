import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  { name: "Royal Blue Silk Saree", price: "₹4,999", originalPrice: "₹6,999", rating: 4.8, image: product1, tag: "New" },
  { name: "Pink Embroidered Kurti", price: "₹1,499", originalPrice: "₹2,299", rating: 4.6, image: product2, tag: "Trending" },
  { name: "Green Bridal Lehenga", price: "₹12,999", originalPrice: "₹18,999", rating: 4.9, image: product3, tag: "Bestseller" },
  { name: "Maroon Silk Saree", price: "₹5,499", originalPrice: "₹7,999", rating: 4.7, image: product4, tag: "New" },
];

export default function NewArrivals() {
  return (
    <section id="new-arrivals" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">Just In</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            New Arrivals
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-gold text-background text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                  {p.tag}
                </span>
                <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center text-foreground/50 hover:text-rose transition-colors">
                  <Heart size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-full bg-gold text-background font-body font-bold py-2 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors">
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-display text-sm md:text-base font-semibold text-foreground truncate">{p.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      className={idx < Math.floor(p.rating) ? "fill-gold text-gold" : "text-border"}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{p.rating}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-body font-bold text-foreground text-sm md:text-base">{p.price}</span>
                  <span className="font-body text-muted-foreground line-through text-xs">{p.originalPrice}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
