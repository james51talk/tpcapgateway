"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function NavLink({ href, label }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AppShell({ children }) {
  const router = useRouter();
  const { session, logout, db, activeCenter, activeCenterId, selectCenter } = useAuth();

  const showAdmin = session?.role === "admin";

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-500 blur-sm opacity-70" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-extrabold text-yellow-300">
                  T
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-tight">TPCAP Bill Gateway</div>
                <div className="text-xs text-zinc-500">
                  {activeCenter
                    ? activeCenter.name
                    : showAdmin
                      ? "No center selected"
                      : "No center"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              {showAdmin ? (
                <select
                  value={activeCenterId ?? ""}
                  onChange={(e) => selectCenter(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-600 sm:w-72"
                >
                  <option value="">Select a center…</option>
                  {(db?.centers ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : null}

              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-2">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
              <NavLink href="/" label="Dashboard" />
              <NavLink href="/billing" label="Billing" />
              {showAdmin ? <NavLink href="/admin" label="Admin" /> : null}
              <NavLink href="/faq" label="FAQ" />
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

