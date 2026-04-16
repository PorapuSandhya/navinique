import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth, SUPER_ADMIN_EMAIL } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { motion } from "framer-motion";
import { LogOut, Users, ShoppingBag, Package, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Devi Elegance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u || u.email !== SUPER_ADMIN_EMAIL) {
        navigate({ to: "/login" });
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Total Orders", value: "1,248", icon: ShoppingBag, change: "+12%" },
    { label: "Products", value: "456", icon: Package, change: "+8" },
    { label: "Customers", value: "3,521", icon: Users, change: "+156" },
    { label: "Revenue", value: "₹18.5L", icon: BarChart3, change: "+23%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-gold-gradient">Devi Elegance Admin</h1>
          <p className="font-body text-xs text-muted-foreground">Super Admin: {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground/60 hover:text-destructive transition-colors border border-border rounded-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center">
                  <stat.icon size={18} className="text-gold" />
                </div>
                <span className="text-xs font-body font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Placeholder sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {[
                { id: "#1234", customer: "Priya S.", amount: "₹4,999", status: "Delivered" },
                { id: "#1235", customer: "Anita R.", amount: "₹12,999", status: "Shipped" },
                { id: "#1236", customer: "Meera P.", amount: "₹1,499", status: "Processing" },
                { id: "#1237", customer: "Lakshmi K.", amount: "₹8,999", status: "Pending" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="font-body text-sm font-bold text-foreground">{order.id}</span>
                    <span className="font-body text-xs text-muted-foreground ml-2">{order.customer}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-foreground">{order.amount}</span>
                    <span className={`text-[10px] font-body font-bold px-2 py-0.5 rounded-full ${
                      order.status === "Delivered" ? "bg-green-50 text-green-600" :
                      order.status === "Shipped" ? "bg-blue-50 text-blue-600" :
                      order.status === "Processing" ? "bg-gold/10 text-gold-dark" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Add Product", "View Orders", "Manage Inventory", "Email Campaigns"].map((action) => (
                <button
                  key={action}
                  className="p-4 border border-border rounded-lg font-body text-sm text-foreground/70 hover:border-gold-light/50 hover:text-gold transition-all text-center"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
