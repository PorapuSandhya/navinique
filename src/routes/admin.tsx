import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth, SUPER_ADMIN_EMAIL } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { LogOut, ShoppingBag, Package, BarChart3, Image, Plus, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Devi Elegance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "dashboard" | "products" | "orders" | "gallery";

function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");

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

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "gallery", label: "Gallery", icon: Image },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-gold-gradient">Devi Elegance Admin</h1>
          <p className="font-body text-xs text-muted-foreground">Super Admin: {user.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground/60 hover:text-destructive transition-colors border border-border rounded-sm">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div className="flex border-b border-border bg-card">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-6 py-3 font-body text-sm transition-colors border-b-2 ${
              tab === t.id ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "gallery" && <GalleryTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: pc }, { count: oc }, { data: rev }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount"),
      ]);
      const totalRev = (rev || []).reduce((s: number, o: any) => s + Number(o.total_amount), 0);
      setStats({ products: pc || 0, orders: oc || 0, revenue: totalRev });
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Products", value: stats.products },
          { label: "Orders", value: stats.orders },
          { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-lg p-5">
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", original_price: "", image_url: "", tag: "", rating: "4.5" });

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      image_url: form.image_url,
      tag: form.tag || null,
      rating: parseFloat(form.rating),
    };

    if (editId) {
      await supabase.from("products").update(payload).eq("id", editId);
    } else {
      await supabase.from("products").insert(payload);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", description: "", price: "", original_price: "", image_url: "", tag: "", rating: "4.5" });
    load();
  };

  const handleEdit = (p: any) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      image_url: p.image_url || "",
      tag: p.tag || "",
      rating: String(p.rating),
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", description: "", price: "", original_price: "", image_url: "", tag: "", rating: "4.5" }); }} className="flex items-center gap-2 bg-gold-gradient text-background font-body font-bold px-4 py-2 rounded-sm text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-display text-lg font-semibold mb-4">{editId ? "Edit Product" : "New Product"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Price *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Original Price" type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Tag (New, Trending, etc.)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Rating (1-5)" type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold min-h-[80px]" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-gold-gradient text-background font-body font-bold px-6 py-2 rounded-sm text-sm">
              {editId ? "Update" : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-border font-body px-6 py-2 rounded-sm text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Tag</th>
              <th className="text-right px-4 py-3 font-body text-xs uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-body text-sm">
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-10 h-12 object-cover rounded" />}
                    <span className="font-semibold text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-body text-sm">₹{Number(p.price).toLocaleString()}</td>
                <td className="px-4 py-3 font-body text-xs"><span className="bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">{p.tag || "-"}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(p)} className="text-muted-foreground hover:text-gold mr-3"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
  }, []);

  const viewOrder = async (order: any) => {
    setSelectedOrder(order);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id);
    setOrderItems(data || []);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status });
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Orders</h2>

      {selectedOrder && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
              <p className="font-body text-sm text-muted-foreground">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground text-sm">Close</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-body text-sm"><strong>Name:</strong> {selectedOrder.customer_name}</p>
              <p className="font-body text-sm"><strong>Email:</strong> {selectedOrder.customer_email}</p>
              <p className="font-body text-sm"><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
            </div>
            <div>
              <p className="font-body text-sm"><strong>Address:</strong> {selectedOrder.address_line1}</p>
              {selectedOrder.address_line2 && <p className="font-body text-sm">{selectedOrder.address_line2}</p>}
              <p className="font-body text-sm">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-body text-sm font-bold mb-2">Items:</p>
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between font-body text-sm py-1 border-b border-border">
                <span>{item.product_name} × {item.quantity}</span>
                <span>₹{(Number(item.product_price) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-body font-bold mt-2">
              <span>Total</span>
              <span className="text-gold">₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm">Status:</span>
            <select
              value={selectedOrder.status}
              onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
              className="px-3 py-1.5 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Order ID</th>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-body text-xs uppercase text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border cursor-pointer hover:bg-muted/50" onClick={() => viewOrder(o)}>
                <td className="px-4 py-3 font-body text-sm font-bold">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-4 py-3 font-body text-sm">{o.customer_name}</td>
                <td className="px-4 py-3 font-body text-sm">₹{Number(o.total_amount).toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`font-body text-xs font-bold px-2 py-0.5 rounded-full ${statusColors[o.status] || ""}`}>{o.status}</span></td>
                <td className="px-4 py-3 font-body text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-muted-foreground">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GalleryTab() {
  const [images, setImages] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", image_url: "", category: "" });

  const load = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    setImages(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await supabase.from("gallery_images").insert({ title: form.title, image_url: form.image_url, category: form.category || null });
    setShowForm(false);
    setForm({ title: "", image_url: "", category: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this image?")) {
      await supabase.from("gallery_images").delete().eq("id", id);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Gallery</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gold-gradient text-background font-body font-bold px-4 py-2 rounded-sm text-sm">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Image URL *" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 border border-border rounded-sm bg-background font-body text-sm focus:outline-none focus:border-gold" />
          </div>
          <button onClick={handleSave} className="mt-4 bg-gold-gradient text-background font-body font-bold px-6 py-2 rounded-sm text-sm">Save</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
            <img src={img.image_url} alt={img.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(img.id)} className="bg-destructive text-destructive-foreground p-2 rounded-full"><Trash2 size={16} /></button>
            </div>
            <div className="p-2">
              <p className="font-body text-sm font-semibold truncate">{img.title}</p>
              {img.category && <p className="font-body text-xs text-muted-foreground">{img.category}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
