"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockout, setLockout] = useState(0);
  const attemptsRef = useRef(0);
  const lockoutTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    };
  }, []);

  const startLockout = useCallback(() => {
    setLockout(LOCKOUT_MS / 1000);
    const end = Date.now() + LOCKOUT_MS;
    lockoutTimerRef.current = setInterval(() => {
      const remaining = Math.ceil((end - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(lockoutTimerRef.current);
        setLockout(0);
        attemptsRef.current = 0;
      } else {
        setLockout(remaining);
      }
    }, 200);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lockout > 0) return;

    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        attemptsRef.current += 1;
        const remaining = MAX_ATTEMPTS - attemptsRef.current;

        if (remaining <= 0) {
          startLockout();
          toast.error("Too many login attempts. Please wait 60 seconds.");
        } else {
          setError(authError.message);
          toast.error(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`);
        }
        return;
      }

      if (data.session) {
        sessionStorage.setItem("admin_token", data.session.access_token);
        sessionStorage.setItem("admin_email", data.session.user.email ?? "");
        attemptsRef.current = 0;
        toast.success("Welcome back!");
        router.push("/admin");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080E] px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0F0F1A",
            border: "1px solid #22223A",
            color: "#EEEEFF",
          },
        }}
      />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 font-sans text-sm text-[#7A7A9A]">
            Sign in to manage your portfolio
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6"
        >
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={lockout > 0}
              className="w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF] disabled:opacity-40"
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs text-[#7A7A9A]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={lockout > 0}
              className="w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF] disabled:opacity-40"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-sans text-sm text-red-500">{error}</p>
          )}

          {lockout > 0 && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-center">
              <p className="font-sans text-sm text-red-400">
                Locked out. Retry in {lockout}s
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#2A2A38]">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-200"
                  style={{ width: `${(lockout / (LOCKOUT_MS / 1000)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || lockout > 0}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Signing in..." : lockout > 0 ? "Locked" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
