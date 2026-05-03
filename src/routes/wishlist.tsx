import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getWishlistItems, toggleWishlist } from "@/lib/wishlist-store";
import { resolveProductImage } from "@/lib/product-images";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, ShoppingBag, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

type Product = {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number | null;
  image_url: string | null;
  tag: string | null;
};

function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>(getWishlistItems());

  useEffect(() => {
    const fetchWishlist = async () => {
      const ids = getWishlistItems();
      setWishlistIds(ids);
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("id, name, price, original_price, rating, image_url, tag")
        .in("id", ids);
      
      setProducts(data || []);
      setLoading(false);
    };

    fetchWishlist();
    const handler = () => fetchWishlist();
    window.addEventListener("wishlist-updated", handler);
    return () => window.removeEventListener("wishlist-updated", handler);
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-medium text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground font-body">Keep track of your favorite pieces</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
              <Heart size={32} />
            </div>
            <h2 className="text-xl font-display font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 font-body">Explore our collections and save items for later.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gold-gradient text-background px-8 py-3 rounded-full font-body font-medium uppercase tracking-widest hover-gold-glow transition-all"
            >
              Start Shopping <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Link to="/product/$productId" params={{ productId: product.id }}>
                    <img 
                      src={resolveProductImage(product.name, product.image_url)} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-rose/10 text-rose rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4">
                  <Link to="/product/$productId" params={{ productId: product.id }}>
                    <h3 className="font-display font-medium text-foreground truncate mb-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="fill-gold text-gold" />
                    <span className="text-xs text-muted-foreground font-body">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-body font-medium text-foreground">₹{product.price.toLocaleString()}</span>
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
