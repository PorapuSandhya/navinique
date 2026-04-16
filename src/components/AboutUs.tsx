import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section id="about-us" className="section-padding bg-blush-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold font-elegant italic text-lg mb-2">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              About Navinique
            </h2>
            <div className="w-16 h-0.5 bg-gold mb-6" />
            <p className="font-body text-foreground/70 leading-relaxed mb-4">
              Founded by <strong className="text-foreground">Sandhya</strong> and her brother{" "}
              <strong className="text-foreground">Naveen</strong>, Navinique is a celebration of
              Indian craftsmanship and modern elegance. What started as a small dream in a cozy
              corner has blossomed into a destination for those who cherish tradition with a
              contemporary twist.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed mb-4">
              Sandhya brings her keen eye for design and deep love for handwoven textiles, while Naveen
              ensures every customer experience is seamless and memorable. Together, they curate
              collections that honor the artistry of Indian weavers and tailors.
            </p>
            <p className="font-body text-foreground/70 leading-relaxed">
              Every piece in our boutique tells a story — of tradition, of passion, and of the
              unwavering belief that true elegance never goes out of style.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-lg bg-champagne/50 border-2 border-gold-light/30 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="font-display text-6xl md:text-7xl font-bold text-gold-gradient">10+</p>
                <p className="font-body text-foreground/60 mt-2 text-lg">Years of Excellence</p>
                <div className="w-12 h-0.5 bg-gold mx-auto my-4" />
                <p className="font-elegant text-xl italic text-foreground/50">
                  "Fashion fades, style is eternal"
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gold-light/30 rounded-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
