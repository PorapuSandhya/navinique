import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-elegant italic text-lg mb-2">Get in Touch</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Contact Us
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">Visit Us</h4>
                  <p className="font-body text-foreground/60 text-sm mt-1">
                    123 Fashion Street, Banjara Hills, Hyderabad, Telangana 500034
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">Call Us</h4>
                  <p className="font-body text-foreground/60 text-sm mt-1">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">Email</h4>
                  <p className="font-body text-foreground/60 text-sm mt-1">hello@devielegance.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">Hours</h4>
                  <p className="font-body text-foreground/60 text-sm mt-1">
                    Mon – Sat: 10 AM – 9 PM<br />
                    Sunday: 11 AM – 7 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.6!2d78.44!3d17.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzM2LjAiTiA3OMKwMjYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Boutique Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-sm text-foreground/70 block mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-sm border border-border bg-card font-body text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="font-body text-sm text-foreground/70 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-sm border border-border bg-card font-body text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="font-body text-sm text-foreground/70 block mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-sm border border-border bg-card font-body text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Write your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold-gradient text-background font-body font-bold py-3.5 rounded-sm uppercase tracking-wider text-sm hover-gold-glow transition-all hover:scale-[1.01]"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
