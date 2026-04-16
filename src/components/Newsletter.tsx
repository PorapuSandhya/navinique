import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="section-padding bg-gold-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)" }} />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-3">
            Stay Updated
          </h2>
          <p className="font-body text-background/80 mb-8">
            Subscribe to get the latest trends, new arrivals, and exclusive offers straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-sm bg-background/20 border border-background/30 text-background placeholder:text-background/50 font-body text-sm focus:outline-none focus:border-background/60"
            />
            <button className="bg-background text-gold font-body font-bold px-6 py-3 rounded-sm text-sm uppercase tracking-wider hover:bg-background/90 transition-colors flex items-center justify-center gap-2">
              <Send size={16} />
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
