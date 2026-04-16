import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — Devi Elegance" },
      { name: "description", content: "Review your cart and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, loading, total, update, remove } = useCart();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-body text-muted-foreground mb-6">Your cart is empty</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gold-gradient text-background font-body font-bold px-6 py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 bg-card border border-border rounded-lg p-4"
                >
                  <img
                    src={item.product.image_url || ""}
                    alt={item.product.name}
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{item.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body font-bold text-foreground">₹{item.product.price.toLocaleString()}</span>
                      {item.product.original_price && (
                        <span className="font-body text-muted-foreground line-through text-sm">
                          ₹{item.product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => update(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-border rounded flex items-center justify-center hover:border-gold transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-body font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => update(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-border rounded flex items-center justify-center hover:border-gold transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-body font-bold text-foreground">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{total > 2000 ? "Free" : "₹99"}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-body font-bold">
                    <span>Total</span>
                    <span className="text-gold">₹{(total > 2000 ? total : total + 99).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-background font-body font-bold py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link
                to="/"
                className="block text-center mt-3 font-body text-sm text-muted-foreground hover:text-gold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
