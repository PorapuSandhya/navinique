import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Collections", href: "#collections" },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "About Us", href: "#about-us" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-gold-light mb-3">Devi Elegance</h3>
            <p className="font-body text-sm leading-relaxed text-cream/60 mb-4">
              Where tradition meets modern elegance. Curated ethnic wear for every occasion.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold/30 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold/30 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold/30 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-cream/60 hover:text-gold-light transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Contact Info</h4>
            <div className="space-y-2 font-body text-sm text-cream/60">
              <p>123 Fashion Street, Banjara Hills</p>
              <p>Hyderabad, Telangana 500034</p>
              <p>+91 98765 43210</p>
              <p>hello@devielegance.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-8 pt-6 text-center">
          <p className="font-body text-xs text-cream/40">
            © {new Date().getFullYear()} Devi Elegance Boutique. Made with{" "}
            <Heart size={12} className="inline text-rose" /> by Devi & Naveen
          </p>
        </div>
      </div>
    </footer>
  );
}
