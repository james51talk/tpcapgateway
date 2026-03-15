"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function ModeToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 rounded-2xl bg-zinc-100 p-1">
      <button
        type="button"
        onClick={() => onChange("center_owner")}
        className={[
          "h-10 rounded-2xl text-sm font-semibold transition-colors",
          value === "center_owner"
            ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
            : "text-zinc-700 hover:bg-white/70",
        ].join(" ")}
      >
        Center Owner
      </button>
      <button
        type="button"
        onClick={() => onChange("admin")}
        className={[
          "h-10 rounded-2xl text-sm font-semibold transition-colors",
          value === "admin"
            ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
            : "text-zinc-700 hover:bg-white/70",
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

  if (!loading && session) {
    router.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-10">
        <div className="w-full">
          <div className="text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-lg font-extrabold text-zinc-900 shadow-sm">
              T
            </div>
            <div className="mt-4 text-sm font-semibold text-zinc-700">
              Empowering Education Management.
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              Welcome to the TPCAP Bill Portal
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Access your center&apos;s statistics, billing records, and performance metrics all in one
              place.
            </p>
          </div>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
            <div className="text-sm font-semibold text-zinc-900">Enter your details to access your account</div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-zinc-600">Account type</div>
              <div className="mt-2">
                <ModeToggle value={mode} onChange={setMode} />
              </div>
            </div>

            <form
              className="mt-5 space-y-4"
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
                <label className="text-sm font-semibold text-zinc-700">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-blue-600"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-blue-600"
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Sign In
              </button>

              <div className="pt-2 text-center text-sm text-zinc-600">
                Having trouble logging in?{" "}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                  Contact Support
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

