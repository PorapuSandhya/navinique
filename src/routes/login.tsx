import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { auth, SUPER_ADMIN_EMAIL } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Navinique" },
      { name: "description", content: "Sign in to your Navinique account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if returning from OTP email link
  if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
    const savedEmail = window.localStorage.getItem("emailForSignIn") || "";
    if (savedEmail) {
      signInWithEmailLink(auth, savedEmail, window.location.href)
        .then((result) => {
          window.localStorage.removeItem("emailForSignIn");
          if (result.user.email === SUPER_ADMIN_EMAIL) {
            navigate({ to: "/admin" });
          } else {
            navigate({ to: "/" });
          }
        })
        .catch(() => { });
    }
  }

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === SUPER_ADMIN_EMAIL) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: typeof window !== "undefined" ? window.location.origin + "/login" : "http://localhost:3000/login",
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("emailForSignIn", email);
      }
      setMessage("Sign-in link sent to your email! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP link");
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
              {mode === "otp" ? "Sign in with email link" : "Sign in to your account"}
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

          {mode === "otp" ? (
            <form onSubmit={handleOTP} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-gradient text-background font-body font-bold py-3 rounded-sm uppercase tracking-wider text-sm hover-gold-glow transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Sign-in Link"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailPassword} className="space-y-4">
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
                {loading ? "Please wait..." : "Sign In"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-3">
            {mode === "login" ? (
              <button onClick={() => { setMode("otp"); setError(""); setMessage(""); }} className="font-body text-sm text-gold hover:underline">
                Sign in with Email Link
              </button>
            ) : (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="font-body text-sm text-gold hover:underline">
                Sign in with Password
              </button>
            )}
            <p className="font-body text-sm text-foreground/70">
              Don't have an account?{" "}
              <Link to="/signup" className="text-gold font-bold hover:underline">
                Sign Up
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
