import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { auth, SUPER_ADMIN_EMAIL } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Navinique" },
      { name: "description", content: "Create your Navinique account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }
      setMessage("Account created! You are now logged in.");
      
      if (email === SUPER_ADMIN_EMAIL) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-blush-gradient px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card rounded-lg border border-border p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-gold-gradient">Navinique</h1>
            <p className="font-body text-muted-foreground text-sm mt-1">
              Create your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-destructive text-xs font-body">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-gold/10 border border-gold/20 rounded-sm text-gold-dark text-xs font-body">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground/70 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="font-body text-sm text-foreground/70 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="font-body text-sm text-foreground/70 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-sm border border-border bg-background font-body text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient text-background font-body font-bold py-3 rounded-sm uppercase tracking-wider text-sm hover-gold-glow transition-all disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="font-body text-sm text-foreground/70">
              Already have an account?{" "}
              <Link to="/login" className="text-gold font-bold hover:underline">
                Login
              </Link>
            </p>
            <div>
              <Link to="/" className="font-body text-xs text-muted-foreground hover:text-gold transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
