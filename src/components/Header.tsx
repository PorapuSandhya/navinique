import { useState, useEffect } from "react";
import { Link, useRouter, useLocation } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartItems } from "@/lib/cart-store";

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

  const refreshCart = async () => {
    try {
      const items = await getCartItems();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshCart();
    const handler = () => refreshCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-gold-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl md:text-2xl font-bold text-gold-gradient">
              Navinique
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-body text-foreground/70 hover:text-gold transition-colors tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-foreground/60 hover:text-gold transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-foreground/60 hover:text-gold transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-[10px] rounded-full flex items-center justify-center text-background font-bold">
                {cartCount}
              </span>
            </Link>
            <Link to="/login" className="p-2 text-foreground/60 hover:text-gold transition-colors">
              <User size={20} />
            </Link>
            <button className="lg:hidden p-2 text-foreground/60" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-6 gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-body text-foreground/70 hover:text-gold py-2 tracking-wide uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/cart"
                className="text-sm font-body text-foreground/70 hover:text-gold py-2 tracking-wide uppercase"
                onClick={() => setMobileOpen(false)}
              >
                Cart ({cartCount})
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
