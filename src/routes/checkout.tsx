import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/cart-store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Devi Elegance" },
      { name: "description", content: "Complete your order with delivery details." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const shippingCost = total > 2000 ? 0 : 99;
  const grandTotal = total + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          session_id: getSessionId(),
          ...form,
          total_amount: grandTotal,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      await clear();
      setOrderId(order.id);
      setOrderPlaced(true);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16 max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="font-body text-muted-foreground mb-2">Thank you for shopping with Devi Elegance.</p>
          <p className="font-body text-sm text-muted-foreground mb-8">Order ID: <span className="font-bold text-foreground">{orderId.slice(0, 8).toUpperCase()}</span></p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/" })}
              className="bg-gold-gradient text-background font-body font-bold px-6 py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground mb-4">No items in cart</p>
            <button onClick={() => navigate({ to: "/" })} className="text-gold hover:underline font-body">
              Go shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-foreground/70 block mb-1">Full Name *</label>
                    <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground/70 block mb-1">Email *</label>
                    <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} required className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-sm text-foreground/70 block mb-1">Phone Number *</label>
                    <input name="customer_phone" value={form.customer_phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="font-body text-sm text-foreground/70 block mb-1">Address Line 1 *</label>
                    <input name="address_line1" value={form.address_line1} onChange={handleChange} required placeholder="House/Flat No., Building Name" className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="font-body text-sm text-foreground/70 block mb-1">Address Line 2</label>
                    <input name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Street, Area, Landmark" className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-body text-sm text-foreground/70 block mb-1">City *</label>
                      <input name="city" value={form.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-sm text-foreground/70 block mb-1">State *</label>
                      <input name="state" value={form.state} onChange={handleChange} required className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-sm text-foreground/70 block mb-1">Pincode *</label>
                      <input name="pincode" value={form.pincode} onChange={handleChange} required pattern="[0-9]{6}" maxLength={6} className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.product.image_url || ""} alt={item.product.name} className="w-12 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{item.product.name}</p>
                      <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-body font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-gold">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-gold-gradient text-background font-body font-bold py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
