import { useState, useEffect } from "react";
import { Link, useRouter, useLocation } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartItems } from "@/lib/cart-store";
import { getWishlistItems } from "@/lib/wishlist-store";

const navLinks = [
  { label: "Home", hash: "home" },
  { label: "Products", hash: "products" },
  { label: "Gallery", hash: "gallery" },
  { label: "About Us", hash: "about-us" },
  { label: "Reviews", hash: "reviews" },
  { label: "Contact Us", hash: "contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const router = useRouter();
  const isHome = location.pathname === "/";

  const refreshCart = async () => {
    try {
      const items = await getCartItems();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    } catch {
      // ignore
    }
  };

  const refreshWishlist = () => {
    setWishlistCount(getWishlistItems().length);
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();
    const cartHandler = () => refreshCart();
    const wishlistHandler = () => refreshWishlist();
    window.addEventListener("cart-updated", cartHandler);
    window.addEventListener("wishlist-updated", wishlistHandler);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("cart-updated", cartHandler);
      window.removeEventListener("wishlist-updated", wishlistHandler);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = async (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isHome) {
      if (hash === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        router.navigate({ to: "/", hash: "" });
      } else {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          router.navigate({ to: "/", hash: hash });
        }
      }
    } else {
      // If not on home, navigate with the hash. 
      // The Index page's useEffect will handle scrolling when it mounts.
      await router.navigate({ to: "/", hash: hash === "home" ? "" : hash });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-lg border-b border-gold/20 shadow-sm ${
        isScrolled 
          ? "border-gold/40 shadow-md py-1" 
          : "py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e as any, "home")}
            className="flex items-center gap-2 group"
          >
            <span className="font-display text-2xl md:text-3xl font-bold text-gold-gradient transition-transform duration-300 group-hover:scale-105">
              Navinique
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`/#${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="relative text-sm font-body font-medium text-foreground/80 hover:text-gold transition-colors tracking-widest uppercase group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/search"
              className="p-2 text-foreground/70 hover:text-gold transition-all hover:scale-110"
            >
              <Search size={24} />
            </Link>
            <Link to="/cart" className="p-2 text-foreground/70 hover:text-gold transition-all relative hover:scale-110">
              <ShoppingBag size={24} />
              <span className="absolute top-1 right-1 w-5 h-5 bg-gold text-[10px] rounded-full flex items-center justify-center text-background font-bold border-2 border-background">
                {cartCount}
              </span>
            </Link>
            <Link to="/wishlist" className="p-2 text-foreground/70 hover:text-gold transition-all relative hover:scale-110">
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-gold text-[10px] rounded-full flex items-center justify-center text-background font-medium border-2 border-background">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="p-2 text-foreground/70 hover:text-gold transition-all hover:scale-110">
              <User size={24} />
            </Link>
            <button className="lg:hidden p-2 text-foreground/70 transition-all hover:scale-110" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background border-t border-gold/20 overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col py-6 px-8 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={`/#${link.hash}`}
                  className="text-base font-body font-medium text-foreground/80 hover:text-gold py-2 tracking-widest uppercase border-b border-border/50"
                  onClick={(e) => handleNavClick(e, link.hash)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/cart"
                className="text-base font-body font-medium text-foreground/80 hover:text-gold py-2 tracking-widest uppercase flex justify-between items-center"
                onClick={() => setMobileOpen(false)}
              >
                <span>Cart</span>
                <span className="bg-gold/10 px-3 py-1 rounded-full text-gold text-sm font-bold">{cartCount}</span>
              </Link>
              <Link
                to="/search"
                className="text-base font-body font-medium text-foreground/80 hover:text-gold py-2 tracking-widest uppercase flex justify-between items-center"
                onClick={() => setMobileOpen(false)}
              >
                <span>Search</span>
                <Search size={18} className="text-gold" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
