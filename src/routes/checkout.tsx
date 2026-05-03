import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/cart-store";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    title: "Checkout — Navinique",
    meta: [
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
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");
  const [upiOption, setUpiOption] = useState<"gpay" | "phonepe" | "paytm" | "other">("gpay");
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

  const validateForm = () => {
    // Email: must end with @gmail.com
    if (!form.customer_email.toLowerCase().endsWith("@gmail.com")) {
      toast.error("Please use a valid @gmail.com email address");
      return false;
    }

    // Phone: Exactly 10 digits, starts with 7, 8, or 9
    const phoneRegex = /^[789]\d{9}$/;
    if (!phoneRegex.test(form.customer_phone)) {
      toast.error("Phone number must be 10 digits and start with 7, 8, or 9");
      return false;
    }

    // Pincode: Exactly 6 digits
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(form.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return false;
    }

    // State: Required and letters only
    const stateRegex = /^[a-zA-Z\s]+$/;
    if (!stateRegex.test(form.state)) {
      toast.error("State should contain only letters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    if (!validateForm()) return;
    
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

      // Also record payment method (simulated)
      console.log(`Payment processed via ${paymentMethod} for order ${order.id}`);

      await clear();
      setOrderId(order.id);
      setOrderPlaced(true);
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep("payment");
      window.scrollTo(0, 0);
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
          <p className="font-body text-muted-foreground mb-2">Thank you for shopping with Navinique.</p>
          <p className="font-body text-sm text-muted-foreground mb-8">Order ID: <span className="font-bold text-foreground">{orderId.slice(0, 8).toUpperCase()}</span></p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/" })}
              className="bg-gold-gradient text-background font-body font-medium px-6 py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all"
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
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {step === "shipping" ? (
                <>
                  {/* Shipping Form (Same as before but inside step check) */}
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
                        <input 
                          name="customer_phone" 
                          value={form.customer_phone} 
                          onChange={handleChange} 
                          required 
                          placeholder="Starts with 7, 8, or 9"
                          pattern="[789][0-9]{9}"
                          maxLength={10}
                          className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors" 
                        />
                      </div>
                    </div>
                  </div>

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
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-lg font-semibold text-foreground">Select Payment Method</h2>
                    <button onClick={() => setStep("shipping")} className="text-gold text-sm font-medium hover:underline">Back to Details</button>
                  </div>
                  
                  <div className="space-y-4">
                    <label 
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "online" ? "border-gold bg-gold/5 shadow-sm" : "border-border hover:border-gold/50"}`}
                      onClick={() => setPaymentMethod("online")}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "online" ? "border-gold" : "border-muted-foreground"}`}>
                          {paymentMethod === "online" && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">Online Payment</p>
                          <p className="font-body text-xs text-muted-foreground">UPI, Cards, Net Banking</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-4 w-6 bg-muted/20 rounded-sm border border-border" />
                        <div className="h-4 w-6 bg-muted/20 rounded-sm border border-border" />
                      </div>
                    </label>

                    <label 
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "cod" ? "border-gold bg-gold/5 shadow-sm" : "border-border hover:border-gold/50"}`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-gold" : "border-muted-foreground"}`}>
                          {paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">Cash on Delivery</p>
                          <p className="font-body text-xs text-muted-foreground">Pay when you receive your order</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === "online" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-6 space-y-4"
                    >
                      <p className="font-body text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Select UPI App</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setUpiOption("gpay")}
                          className={`flex items-center gap-3 p-3 border rounded-md transition-all ${upiOption === "gpay" ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${upiOption === "gpay" ? "border-gold bg-gold" : "border-muted-foreground"}`}>
                            {upiOption === "gpay" && <div className="w-1.5 h-1.5 bg-background rounded-full" />}
                          </div>
                          <span className="font-body text-sm">Google Pay</span>
                        </button>
                        <button 
                          onClick={() => setUpiOption("phonepe")}
                          className={`flex items-center gap-3 p-3 border rounded-md transition-all ${upiOption === "phonepe" ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${upiOption === "phonepe" ? "border-gold bg-gold" : "border-muted-foreground"}`}>
                            {upiOption === "phonepe" && <div className="w-1.5 h-1.5 bg-background rounded-full" />}
                          </div>
                          <span className="font-body text-sm">PhonePe</span>
                        </button>
                        <button 
                          onClick={() => setUpiOption("paytm")}
                          className={`flex items-center gap-3 p-3 border rounded-md transition-all ${upiOption === "paytm" ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${upiOption === "paytm" ? "border-gold bg-gold" : "border-muted-foreground"}`}>
                            {upiOption === "paytm" && <div className="w-1.5 h-1.5 bg-background rounded-full" />}
                          </div>
                          <span className="font-body text-sm">Paytm</span>
                        </button>
                        <button 
                          onClick={() => setUpiOption("other")}
                          className={`flex items-center gap-3 p-3 border rounded-md transition-all ${upiOption === "other" ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"}`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${upiOption === "other" ? "border-gold bg-gold" : "border-muted-foreground"}`}>
                            {upiOption === "other" && <div className="w-1.5 h-1.5 bg-background rounded-full" />}
                          </div>
                          <span className="font-body text-sm">Other UPI ID</span>
                        </button>
                      </div>
                      
                      <div className="p-4 bg-muted/10 border border-dashed border-border rounded-lg text-center">
                        <p className="font-body text-[11px] text-muted-foreground">You will be redirected to complete payment on your selected app.</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={resolveProductImage(item.product.name, item.product.image_url)} alt={item.product.name} className="w-12 h-16 object-cover rounded" />
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
              
              {step === "shipping" ? (
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="w-full mt-4 bg-gold-gradient text-background font-body font-medium py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all"
                >
                  Continue to Payment
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-4 bg-gold-gradient text-background font-body font-medium py-3 rounded-sm uppercase text-sm tracking-wider hover-gold-glow transition-all disabled:opacity-50"
                >
                  {submitting ? "Processing..." : paymentMethod === "cod" ? "Confirm Order" : "Pay & Place Order"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
