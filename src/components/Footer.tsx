import { Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "Products", href: "/#products" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About Us", href: "/#about-us" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-gold-light mb-3">Navinique</h3>
            <p className="font-body text-sm leading-relaxed text-cream/60 mb-4">
              Where tradition meets modern elegance. Curated ethnic wear for every occasion.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold/30 transition-colors text-sm">IG</a>
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold/30 transition-colors text-sm">FB</a>
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold/30 transition-colors text-sm">TW</a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-body text-sm text-cream/60 hover:text-gold-light transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Contact Info</h4>
            <div className="space-y-2 font-body text-sm text-cream/60">
              <p>123 Fashion Street, Banjara Hills</p>
              <p>Hyderabad, Telangana 500034</p>
              <p>+91 98765 43210</p>
              <p>hello@navinique.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-cream/10 mt-8 pt-6 text-center">
          <p className="font-body text-xs text-cream/40">
            © {new Date().getFullYear()} Navinique. Made with{" "}
            <Heart size={12} className="inline text-rose" /> by Sandhya & Naveen
          </p>
        </div>
      </div>
    </footer>
  );
}
