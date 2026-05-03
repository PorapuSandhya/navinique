import { Link } from "@tanstack/react-router";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { resolveProductImage } from "@/lib/product-images";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number | null;
  image_url: string | null;
  tag: string | null;
};

interface ProductCardProps {
  p: Product;
  i: number;
  adding: string | null;
  handleAddToCart: (e: React.MouseEvent, productId: string) => void;
  isWishlisted: boolean;
  toggleWish: (id: string) => void;
}

export default function ProductCard({ p, i, adding, handleAddToCart, isWishlisted, toggleWish }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
    >
      <Link to="/product/$productId" params={{ productId: p.id }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={resolveProductImage(p.name, p.image_url)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {p.tag && (
            <span className="absolute top-3 left-3 bg-gold text-background text-[10px] font-medium px-2 py-1 rounded-sm uppercase tracking-wider shadow-md">
              {p.tag}
            </span>
          )}
          <button 
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isWishlisted ? "bg-rose/10 text-rose" : "bg-background/80 text-foreground/50 hover:text-rose"
            }`}
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              const added = toggleWish(p.id);
              if (added) toast.success("Added to Wishlist");
              else toast.info("Removed from Wishlist");
            }}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleAddToCart(e, p.id)}
              disabled={adding === p.id}
              className="w-full bg-gold text-background font-body font-medium py-2 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              <ShoppingBag size={14} />
              {adding === p.id ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
        <div className="p-3 md:p-4">
          <h3 className="font-body text-sm md:text-base font-medium text-foreground truncate">{p.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={12} className={idx < Math.floor(p.rating || 0) ? "fill-gold text-gold" : "text-border"} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{p.rating}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body font-medium text-foreground text-sm md:text-base">₹{p.price.toLocaleString()}</span>
            {p.original_price && (
              <span className="font-body text-muted-foreground line-through text-xs">₹{p.original_price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
