import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { resolveProductImage } from "@/lib/product-images";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist-store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, ShoppingBag, Heart, ChevronLeft, ShieldCheck, Truck, RotateCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { getWishlistItems } from "@/lib/wishlist-store";

export const Route = createFileRoute("/product/$productId")({
  component: ProductDetails,
});

type Product = {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  rating: number | null;
  image_url: string | null;
  description: string | null;
  tag: string | null;
  category_id: string | null;
};

const COLORS = ["Red", "Blue", "Green", "Pink", "Black", "White", "Yellow", "Gold", "Maroon"];
const SIZES = ["XS", "S", "M", "L", "XL", "Free Size"];
const PRODUCT_TYPES = ["Silk", "Cotton", "Georgette", "Chiffon", "Banarasi", "Organza", "Linen", "Bridal", "Casual"];

const COLOR_HEX: Record<string, string> = {
  "Red": "#ef4444", "Blue": "#3b82f6", "Green": "#22c55e", 
  "Pink": "#ec4899", "Black": "#171717", "White": "#ffffff", 
  "Yellow": "#eab308", "Gold": "#cca35c", "Maroon": "#7f1d1d"
};

function getProductMockData(p: Product) {
  const charCode = p.id.charCodeAt(0) || 0;
  let type = PRODUCT_TYPES.find((t) => p.name.includes(t) || (p.description && p.description.includes(t))) || PRODUCT_TYPES[charCode % PRODUCT_TYPES.length];
  
  const color1 = COLORS[charCode % COLORS.length];
  const color2 = COLORS[(charCode + 3) % COLORS.length];
  
  const size1 = SIZES[charCode % SIZES.length];
  const size2 = SIZES[(charCode + 1) % SIZES.length];
  const size3 = SIZES[(charCode + 2) % SIZES.length];
  const isSaree = p.name.toLowerCase().includes("saree") || (p.description && p.description.toLowerCase().includes("saree"));
  const isAcc = p.name.toLowerCase().includes("accessory") || 
                p.name.toLowerCase().includes("bag") || 
                p.name.toLowerCase().includes("jewelry") || 
                p.name.toLowerCase().includes("necklace") || 
                p.name.toLowerCase().includes("earring") || 
                p.name.toLowerCase().includes("bangle") || 
                p.name.toLowerCase().includes("set") || 
                p.category_id === 'accessories';

  // Extract details from description if possible
  const lengthMatch = p.description?.match(/(?:Length|Skirt Length):\s*([^.]+)/i);
  const sleevesMatch = p.description?.match(/Sleeves:\s*([^.]+)/i);
  const fabricMatch = p.description?.match(/(?:Fabric|Material):\s*([^.]+)/i);

  let length = lengthMatch ? lengthMatch[1].trim() : (isSaree ? "5.5 Meters" : (isAcc ? null : "44 Inches"));
  let sleeves = sleevesMatch ? sleevesMatch[1].trim() : (isSaree ? "Customizable" : (isAcc ? null : "3/4 Sleeves"));
  let fabric = fabricMatch ? fabricMatch[1].trim() : (isAcc ? "Premium Alloy" : type);

  // Final fallback to ensure variety if not in description
  if (!lengthMatch && p.name.toLowerCase().includes("kids")) length = "22-26 Inches";
  if (!lengthMatch && p.name.toLowerCase().includes("lehenga")) length = "42 Inches";

  return { 
    type: fabric, 
    colors: [color1, color2], 
    sizes: isSaree ? ["Free Size"] : (isAcc ? ["Standard"] : [size1, size2, size3]),
    length,
    sleeves,
    isAcc
  };
}

function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <ChevronDown size={24} className="rotate-45" />
        </button>
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Size Guide</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="font-body font-bold text-xs uppercase tracking-widest text-gold mb-3">Sarees</h3>
            <p className="text-sm text-muted-foreground mb-3">All our sarees are standard length of 5.5 meters, accompanied by an unstitched blouse piece of 0.8 meters (unless specified otherwise).</p>
          </section>

          <section>
            <h3 className="font-body font-bold text-xs uppercase tracking-widest text-gold mb-3">Kurtis (Inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 font-medium">Size</th>
                    <th className="py-2 px-4 font-medium">Bust</th>
                    <th className="py-2 px-4 font-medium">Waist</th>
                    <th className="py-2 pl-4 font-medium">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-2 pr-4 font-bold">XS</td><td className="py-2 px-4">32</td><td className="py-2 px-4">26</td><td className="py-2 pl-4">34</td></tr>
                  <tr><td className="py-2 pr-4 font-bold">S</td><td className="py-2 px-4">34</td><td className="py-2 px-4">28</td><td className="py-2 pl-4">36</td></tr>
                  <tr><td className="py-2 pr-4 font-bold">M</td><td className="py-2 px-4">36</td><td className="py-2 px-4">30</td><td className="py-2 pl-4">38</td></tr>
                  <tr><td className="py-2 pr-4 font-bold">L</td><td className="py-2 px-4">38</td><td className="py-2 px-4">32</td><td className="py-2 pl-4">40</td></tr>
                  <tr><td className="py-2 pr-4 font-bold">XL</td><td className="py-2 px-4">40</td><td className="py-2 px-4">34</td><td className="py-2 pl-4">42</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-body font-bold text-xs uppercase tracking-widest text-gold mb-3">Kids Wear</h3>
            <p className="text-sm text-muted-foreground">Sizes are based on age groups. For custom measurements, please contact our support team.</p>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 bg-gold text-background font-body font-bold text-xs rounded-lg uppercase tracking-widest hover:bg-gold-dark transition-colors"
        >
          Close Guide
        </button>
      </motion.div>
    </div>
  );
}

function Accordion({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center font-display font-medium text-foreground group">
        <span className="group-hover:text-gold transition-colors tracking-widest text-xs uppercase">{title}</span>
        <ChevronDown className={`transition-transform duration-300 text-muted-foreground group-hover:text-gold ${open ? 'rotate-180' : ''}`} size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-4 font-body text-foreground/80 leading-relaxed text-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductDetails() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mockData, setMockData] = useState<any>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(getWishlistItems());

  useEffect(() => {
    const updateWish = () => {
      setIsWishlisted(isInWishlist(productId));
      setWishlist(getWishlistItems());
    };
    updateWish();
    window.addEventListener("wishlist-updated", updateWish);
    return () => window.removeEventListener("wishlist-updated", updateWish);
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()
      .then(({ data }) => {
        setProduct(data);
        if (data) {
          const mock = getProductMockData(data);
          setMockData(mock);
          setSelectedSize(mock.sizes[0]);
          setSelectedColor(mock.colors[0]);
          
          supabase
            .from("products")
            .select("*")
            .eq("category_id", data.category_id)
            .neq("id", productId)
            .limit(4)
            .then(({ data: related }) => {
              setRelatedProducts(related || []);
            });
        }
        setLoading(false);
      });
  }, [productId]);

  const handleProductCardAddToCart = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(id);
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity, selectedSize, selectedColor);
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity, selectedSize, selectedColor);
      toast.success("Proceeding to checkout...");
      window.dispatchEvent(new Event("cart-updated"));
      navigate({ to: "/checkout" });
    } catch {
      toast.error("Failed to process");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product || !mockData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-display font-medium mb-4 text-gold">Product Not Found</h1>
        <Link to="/" className="text-foreground/60 hover:text-gold underline underline-offset-4">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-sm sticky top-24 bg-card">
              <img 
                src={resolveProductImage(product.name, product.image_url)} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {product.tag && (
              <span className="inline-block bg-gold/10 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 self-start">
                {product.tag}
              </span>
            )}
            
            <h1 className="font-body text-2xl md:text-3xl font-medium text-foreground mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={16} className={idx < Math.floor(product.rating || 0) ? "fill-gold text-gold" : "text-border"} />
                ))}
                <span className="text-sm font-body font-medium ml-2 text-foreground">{product.rating}</span>
              </div>
              <span className="text-muted-foreground text-xs uppercase tracking-widest border-l border-border pl-4 font-normal">Authentic Quality</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-2xl font-body font-medium text-foreground">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through italic font-light">₹{product.original_price.toLocaleString()}</span>
                  <span className="text-gold text-sm font-medium ml-2 tracking-tighter">
                    ({Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF)
                  </span>
                </>
              )}
            </div>

            <div className="mb-8 p-6 bg-card border border-border rounded-xl">
              <div className="mb-6">
                <span className="block font-body font-medium uppercase text-[10px] tracking-[0.2em] mb-4 text-muted-foreground">Select Color</span>
                <div className="flex flex-wrap gap-4">
                  {mockData.colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === c ? "border-gold scale-110 shadow-lg" : "border-transparent hover:border-gold/30"
                      }`}
                    >
                      <span 
                        className="w-8 h-8 rounded-full border border-black/10 shadow-inner" 
                        style={{ backgroundColor: COLOR_HEX[c] || "#cccccc" }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body font-medium uppercase text-[10px] tracking-[0.2em] text-muted-foreground">Select Size</span>
                  <button 
                    onClick={() => setShowSizeGuide(true)}
                    className="text-gold text-[10px] font-medium uppercase tracking-widest hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {mockData.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-11 rounded-lg border flex items-center justify-center font-body font-medium text-xs transition-all ${
                        mockData.sizes.length === 1 ? "px-8 border-gold bg-gold/5 text-gold cursor-default" : "w-12"
                      } ${
                        selectedSize === s && mockData.sizes.length > 1
                          ? "border-gold bg-gold text-background shadow-md scale-105" 
                          : mockData.sizes.length > 1 ? "border-border text-foreground hover:border-gold" : ""
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-border rounded-sm bg-card h-10 px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 text-lg hover:text-gold transition-colors">−</button>
                  <span className="w-8 text-center font-body text-xs font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-6 text-lg hover:text-gold transition-colors">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 min-w-[120px] h-10 bg-background border border-gold text-gold font-body font-medium text-[10px] rounded-sm uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-gold/5 transition-all active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag size={14} />
                  {adding ? "Adding" : "Add to Cart"}
                </button>

                <button 
                  onClick={handleBuyNow}
                  disabled={adding}
                  className="flex-1 min-w-[100px] h-10 bg-gold-gradient text-background font-body font-medium text-[10px] rounded-sm uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover-gold-glow transition-all active:scale-95 shadow-sm"
                >
                  Buy Now
                </button>

                <button 
                  onClick={() => {
                    const added = toggleWishlist(product.id);
                    if (added) toast.success("Added to Wishlist");
                    else toast.info("Removed from Wishlist");
                  }}
                  className={`w-10 h-10 border rounded-sm flex items-center justify-center transition-all ${
                    isWishlisted ? "border-rose bg-rose/10 text-rose" : "border-border text-foreground/40 hover:text-rose hover:border-rose"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Accordion title="Description" defaultOpen={true}>
                <p className="leading-loose text-foreground/70">
                  {product.description || "Experience timeless elegance with this handcrafted piece from Navinique."}
                </p>
              </Accordion>
              
              <Accordion title="Specifications">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-2">
                  <div className="border-b border-border/50 pb-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{mockData.isAcc ? 'Material' : 'Fabric Type'}</p>
                    <p className="font-body font-medium text-sm text-foreground">{mockData.type}</p>
                  </div>
                  {!mockData.isAcc && (
                    <>
                      <div className="border-b border-border/50 pb-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Sleeves</p>
                        <p className="font-body font-medium text-sm text-foreground">{mockData.sleeves}</p>
                      </div>
                      <div className="border-b border-border/50 pb-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Length</p>
                        <p className="font-body font-medium text-sm text-foreground">{mockData.length}</p>
                      </div>
                    </>
                  )}
                  <div className="border-b border-border/50 pb-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{mockData.isAcc ? 'Category' : 'Wash Care'}</p>
                    <p className="font-body font-medium text-sm text-foreground">{mockData.isAcc ? 'Premium Accessory' : 'Premium Dry Clean'}</p>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Shipping & Returns">
                <div className="space-y-4 py-2">
                  <div className="flex items-start gap-3">
                    <Truck size={18} className="text-gold mt-1 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Free Express Shipping</p>
                      <p className="text-xs text-muted-foreground">Delivery in 3-5 business days across India.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw size={18} className="text-gold mt-1 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">7-Day Easy Returns</p>
                      <p className="text-xs text-muted-foreground">Not the right fit? Return it within 7 days for a full refund.</p>
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-gold font-elegant italic text-lg mb-1">More to Explore</p>
                <h2 className="font-display text-3xl font-bold text-foreground">You May Also Like</h2>
              </div>
              <Link to="/" className="text-gold text-sm font-bold uppercase tracking-widest hover:underline">View Gallery</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, i) => (
                <ProductCard 
                  key={p.id} 
                  p={p} 
                  i={i} 
                  adding={adding ? p.id : null} 
                  handleAddToCart={handleProductCardAddToCart} 
                  isWishlisted={wishlist.includes(p.id)}
                  toggleWish={toggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
