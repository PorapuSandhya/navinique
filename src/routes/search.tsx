import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { toggleWishlist, getWishlistItems } from "@/lib/wishlist-store";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Collection — Navinique" },
      { name: "description", content: "Search our exclusive boutique collection." },
    ],
  }),
  component: SearchPage,
});

const RECOMMENDATIONS = [
  { term: "Silk Saree", category: "Fabric" },
  { term: "Bridal Wear", category: "Occasion" },
  { term: "Cotton Collection", category: "Trending" },
  { term: "Designer Blouse", category: "Style" },
  { term: "New Arrivals", category: "Latest" },
  { term: "Floral Print", category: "Pattern" },
];

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(getWishlistItems());

  const [adding, setAdding] = useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(id);
    try {
      await addToCart(id);
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(null);
    }
  };

  useEffect(() => {
    const handler = () => setWishlist(getWishlistItems());
    window.addEventListener("wishlist-updated", handler);
    return () => window.removeEventListener("wishlist-updated", handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(12);
        setResults(data || []);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={24} />
            <input
              autoFocus
              type="text"
              placeholder="Search our exquisite collection..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border-2 border-border focus:border-gold/50 py-6 px-16 rounded-2xl font-display text-xl md:text-2xl focus:outline-none transition-all shadow-lg placeholder:text-muted-foreground/30 text-foreground"
            />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Recommendations */}
          <aside className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="font-display text-sm font-bold text-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp size={16} /> Trending Searches
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-3">
                {RECOMMENDATIONS.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => setQuery(item.term)}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-gold hover:text-gold hover:bg-gold/5 transition-all text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="font-body text-sm font-medium">{item.term}</span>
                      <span className="font-body text-[10px] text-muted-foreground uppercase tracking-tighter">{item.category}</span>
                    </div>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gold/5 border border-gold/10 hidden lg:block">
              <div className="flex items-center gap-2 text-gold mb-3">
                <Sparkles size={18} />
                <span className="font-display font-bold text-sm uppercase tracking-widest">Stylist Tip</span>
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                Searching for specific fabrics like "Banarasi" or "Organza" yields the most accurate results for our designer collections.
              </p>
            </div>
          </aside>

          {/* Results Grid */}
          <section className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                  <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">Searching Collection...</p>
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {results.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      i={i}
                      adding={adding}
                      handleAddToCart={handleAddToCart}
                      isWishlisted={wishlist.includes(p.id)}
                      toggleWish={toggleWishlist}
                    />
                  ))}
                </motion.div>
              ) : query.trim() ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 bg-card rounded-3xl border border-dashed border-border"
                >
                  <Search size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                  <p className="font-display text-2xl text-muted-foreground mb-2">No matches found</p>
                  <p className="font-body text-sm text-muted-foreground/60 max-w-xs mx-auto">
                    We couldn't find anything matching "{query}". Try adjusting your search or browse our recommendations.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center text-gold mb-8">
                    <Search size={40} />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-4">Explore Our Collection</h2>
                  <p className="font-body text-muted-foreground max-w-md mx-auto">
                    Search for sarees, designer wear, or specific fabrics to find exactly what you're looking for.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
