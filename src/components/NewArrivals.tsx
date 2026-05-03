import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Star, ShoppingBag, Heart, X, ChevronDown, Check, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { resolveProductImage } from "@/lib/product-images";
import { toggleWishlist, isInWishlist, getWishlistItems } from "@/lib/wishlist-store";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number | null;
  image_url: string | null;
  tag: string | null;
  category_id: string | null;
};

type CategoryFilter = { id: string; name: string } | null;

const COLORS = ["Red", "Blue", "Green", "Pink", "Black", "White", "Yellow", "Gold", "Maroon"];
const SIZES = ["XS", "S", "M", "L", "XL", "Free Size"];
const PRODUCT_TYPES = ["Silk", "Cotton", "Georgette", "Chiffon", "Banarasi", "Organza", "Linen", "Bridal", "Casual"];
const PRICE_RANGES = [
  { id: "under2k", label: "Under ₹2,000" },
  { id: "2k-5k", label: "₹2,000 - ₹5,000" },
  { id: "above5k", label: "Above ₹5,000" },
];

function getProductMockData(p: Product) {
  const charCode = p.id.charCodeAt(0) || 0;
  let type = PRODUCT_TYPES.find((t) => p.name.includes(t)) || PRODUCT_TYPES[charCode % PRODUCT_TYPES.length];
  
  const color1 = COLORS[charCode % COLORS.length];
  const color2 = COLORS[(charCode + 3) % COLORS.length];
  
  const size1 = SIZES[charCode % SIZES.length];
  const size2 = SIZES[(charCode + 1) % SIZES.length];
  
  return { type, colors: [color1, color2], sizes: [size1, size2] };
}

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>(null);

  // Filter States
  const [selectedSort, setSelectedSort] = useState("bestseller");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(getWishlistItems());

  useEffect(() => {
    const handler = () => setWishlist(getWishlistItems());
    window.addEventListener("wishlist-updated", handler);
    return () => window.removeEventListener("wishlist-updated", handler);
  }, []);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, original_price, rating, image_url, tag, category_id")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setProducts(data || []));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string; name: string };
      setFilter({ id: detail.id, name: detail.name });
      // Reset filters when changing category
      setSelectedTypes([]);
      setSelectedPrices([]);
      setSelectedSizes([]);
      setSelectedColors([]);
      setSelectedSort("bestseller");
    };
    window.addEventListener("category-selected", handler);
    return () => window.removeEventListener("category-selected", handler);
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
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

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const visibleProducts = useMemo(() => {
    let result = filter ? products.filter((p) => p.category_id === filter.id) : products.slice(0, 8);

    if (filter) {
      result = result.filter((p) => {
        const mock = getProductMockData(p);
        
        if (selectedTypes.length > 0 && !selectedTypes.includes(mock.type)) return false;
        if (selectedSizes.length > 0 && !selectedSizes.some((s) => mock.sizes.includes(s))) return false;
        if (selectedColors.length > 0 && !selectedColors.some((c) => mock.colors.includes(c))) return false;
        
        if (selectedPrices.length > 0) {
          const matchesPrice = selectedPrices.some((range) => {
            if (range === "under2k") return p.price < 2000;
            if (range === "2k-5k") return p.price >= 2000 && p.price <= 5000;
            if (range === "above5k") return p.price > 5000;
            return false;
          });
          if (!matchesPrice) return false;
        }
        
        return true;
      });

      if (selectedSort === "price-asc") result.sort((a, b) => a.price - b.price);
      else if (selectedSort === "price-desc") result.sort((a, b) => b.price - a.price);
      else if (selectedSort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else result.sort((a, b) => (b.original_price || 0) - (a.original_price || 0));
    }

    return result;
  }, [products, filter, selectedTypes, selectedPrices, selectedSizes, selectedColors, selectedSort]);

  const FilterDropdown = ({ title, options, selected, setter, id, isObj = false }: { title: string, options: any[], selected: string[], setter: any, id: string, isObj?: boolean }) => {
    const isOpen = openDropdown === id;
    const ref = useRef<HTMLDivElement>(null);
    
    useClickOutside(ref, () => {
      if (isOpen) setOpenDropdown(null);
    });

    return (
      <div className="relative" ref={ref}>
        <button 
          onClick={() => setOpenDropdown(isOpen ? null : id)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-sm font-body text-sm transition-colors ${isOpen || selected.length > 0 ? "border-gold text-foreground bg-gold/5" : "border-border text-foreground/80 hover:border-gold"}`}
        >
          {title} {selected.length > 0 && <span className="bg-gold text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{selected.length}</span>}
          <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 w-64 bg-card border border-border rounded-md shadow-xl z-50 py-3"
            >
              <div className="max-h-64 overflow-y-auto px-4 space-y-2">
                {options.map((opt) => {
                  const val = isObj ? opt.id : opt;
                  const label = isObj ? opt.label : opt;
                  const isSelected = selected.includes(val);
                  return (
                    <label 
                      key={val} 
                      onClick={(e) => { e.preventDefault(); setter(val); }}
                      className="flex items-center gap-3 cursor-pointer group py-1"
                    >
                      <div className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${isSelected ? "bg-gold border-gold text-background" : "border-border group-hover:border-gold"}`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="font-body text-sm text-foreground/80 group-hover:text-gold transition-colors">{label}</span>
                    </label>
                  );
                })}
              </div>
              {selected.length > 0 && (
                <div className="px-4 pt-3 mt-2 border-t border-border">
                  <button onClick={() => {
                    options.forEach(opt => {
                       const val = isObj ? opt.id : opt;
                       if (selected.includes(val)) setter(val);
                    });
                  }} className="text-xs text-muted-foreground hover:text-foreground font-body">
                    Clear selections
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="products" className="section-padding scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">{filter ? "Collection" : "Just In"}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {filter ? filter.name : "New Arrivals"}
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        {!filter ? (
          /* Normal Grid when no filter is applied */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((p, i) => (
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
          </div>
        ) : (
          /* Collection Active Layout with Top Filter Bar */
          <div>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <button
                  onClick={() => setFilter(null)}
                  className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-gold transition-colors"
                >
                  <X size={14} /> Clear {filter.name}
                </button>
                
                <span className="font-body text-sm text-muted-foreground">
                  Showing {visibleProducts.length} items
                </span>
              </div>

              {/* Filter and Sort Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-40">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 mr-2 text-foreground/60">
                    <Filter size={16} />
                    <span className="font-body text-sm hidden sm:inline">Filter by:</span>
                  </div>
                  
                  <FilterDropdown id="type" title="Product Type" options={PRODUCT_TYPES} selected={selectedTypes} setter={(opt: string) => toggleArrayItem(setSelectedTypes, opt)} />
                  <FilterDropdown id="price" title="Price" options={PRICE_RANGES} selected={selectedPrices} setter={(opt: string) => toggleArrayItem(setSelectedPrices, opt)} isObj />
                  <FilterDropdown id="size" title="Size" options={SIZES} selected={selectedSizes} setter={(opt: string) => toggleArrayItem(setSelectedSizes, opt)} />
                  <FilterDropdown id="color" title="Color" options={COLORS} selected={selectedColors} setter={(opt: string) => toggleArrayItem(setSelectedColors, opt)} />
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <span className="font-body text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                  <div className="relative group z-30">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="appearance-none bg-card border border-border px-4 py-2 pr-10 rounded-sm font-body text-sm focus:outline-none focus:border-gold cursor-pointer"
                    >
                      <option value="bestseller">Best Seller</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {visibleProducts.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-lg">
                  <p className="font-body text-muted-foreground">No products match your selected filters.</p>
                  <button 
                    onClick={() => { setSelectedTypes([]); setSelectedPrices([]); setSelectedSizes([]); setSelectedColors([]); }}
                    className="mt-4 text-gold font-bold hover:underline font-body text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {visibleProducts.map((p, i) => (
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
