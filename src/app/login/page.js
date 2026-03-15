"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { BuildingIcon } from "@/components/Icons";

function ModeToggle({ value, onChange }) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-slate-200">
      <button
        type="button"
        onClick={() => onChange("center_owner")}
        className={[
          "flex-1 px-3 py-2 text-sm font-semibold transition-colors",
          value === "center_owner"
            ? "bg-[#1a3c8f] text-white"
            : "bg-slate-50 text-slate-500 hover:bg-slate-100",
        ].join(" ")}
      >
        Center Owner
      </button>
      <button
        type="button"
        onClick={() => onChange("admin")}
        className={[
          "flex-1 px-3 py-2 text-sm font-semibold transition-colors",
          value === "admin"
            ? "bg-[#1a3c8f] text-white"
            : "bg-slate-50 text-slate-500 hover:bg-slate-100",
        ].join(" ")}
      >
        Administrator
      </button>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, session } = useAuth();
  const [mode, setMode] = useState("center_owner");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const hints = useMemo(() => {
    if (mode === "admin") return { user: "admin", pass: "admin123" };
    return { user: "owner.manila", pass: "owner123" };
  }, [mode]);

  useEffect(() => {
    if (loading) return;
    if (session) router.replace("/");
  }, [loading, session, router]);

  if (!loading && session) return <div className="min-h-screen bg-[#f0f4ff]" />;

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[860px] items-center justify-center">
        <div className="flex w-full overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(26,60,143,0.15)]">
          <div className="hidden w-[42%] flex-col justify-between bg-gradient-to-br from-yellow-300 to-orange-400 px-9 py-10 md:flex">
            <div>
              <div className="text-3xl font-extrabold tracking-widest text-[#1a3c8f]">TPCAP</div>
              <div className="mt-2 text-sm font-semibold text-[#1a3c8f]/80">
                Tutoring Centers Billing Management
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/40 text-[#1a3c8f] ring-1 ring-white/40">
                <BuildingIcon className="h-16 w-16" />
              </div>
            </div>

            <div className="text-xs font-semibold text-[#1a3c8f]/60">
              Secure portal for authorized
              <br />
              center operators only.
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
            <h2 className="text-2xl font-extrabold text-slate-800">TPCAP Bill Portal</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to access your billing dashboard.</p>

            <div className="mt-6">
              <ModeToggle value={mode} onChange={setMode} />
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                const res = login({ mode, username, password });
                if (!res.ok) {
                  setError(res.error || "Sign in failed.");
                  return;
                }
                router.replace("/");
              }}
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-shadow focus:border-[#2454b8] focus:shadow-[0_0_0_3px_rgba(36,84,184,0.12)]"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-shadow focus:border-[#2454b8] focus:shadow-[0_0_0_3px_rgba(36,84,184,0.12)]"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#1a3c8f] text-sm font-extrabold text-white hover:bg-[#2454b8]"
              >
                Sign In
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-400">
              Demo: use <b>{hints.user}/{hints.pass}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

