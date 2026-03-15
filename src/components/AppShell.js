"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { FileTextIcon, HelpCircleIcon, LayoutDashboardIcon, LogOutIcon, MenuIcon, ShieldIcon, XIcon } from "@/components/Icons";

function initials(text) {
  const parts = String(text || "")
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean);
  const a = parts[0]?.[0] || "U";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

function SidebarLink({ href, label, icon, onNavigate }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold transition-colors",
        "border-l-[3px] border-transparent",
        active
          ? "bg-yellow-300/10 text-yellow-300 border-l-yellow-300"
          : "text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, account, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showAdmin = session?.role === "admin";
  const title = useMemo(() => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/billing") return "Billing";
    if (pathname === "/admin") return "Admin Panel";
    if (pathname === "/faq") return "FAQ";
    return "TPCAP Bill Portal";
  }, [pathname]);

  const roleLabel = session?.role === "admin" ? "Administrator" : "Center Owner";
  const nameLabel = account?.username || "User";

  return (
    <div className="min-h-screen">
      <div
        className={[
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm md:hidden",
          mobileOpen ? "block" : "hidden",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={[
          "fixed left-0 top-0 z-50 h-full w-[230px] bg-gradient-to-b from-[#1a3c8f] to-[#0f2460] text-white transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <div className="inline-flex rounded-lg bg-yellow-300 px-3 py-1.5 text-sm font-extrabold tracking-widest text-[#1a3c8f]">
            TPCAP
          </div>
          <div className="mt-2 text-xs font-semibold text-white/60">Bill Portal</div>
        </div>

        <div className="flex h-full flex-col">
          <div className="flex-1 py-3">
            <div className="px-5 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30">
              Main
            </div>
            <SidebarLink
              href="/"
              label="Dashboard"
              icon={<LayoutDashboardIcon className="h-5 w-5" />}
              onNavigate={() => setMobileOpen(false)}
            />
            <SidebarLink
              href="/billing"
              label="Billing"
              icon={<FileTextIcon className="h-5 w-5" />}
              onNavigate={() => setMobileOpen(false)}
            />

            {showAdmin ? (
              <>
                <div className="mt-3 px-5 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30">
                  Admin
                </div>
                <SidebarLink
                  href="/admin"
                  label="Admin Panel"
                  icon={<ShieldIcon className="h-5 w-5" />}
                  onNavigate={() => setMobileOpen(false)}
                />
              </>
            ) : null}

            <div className="mt-3 px-5 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30">
              Help
            </div>
            <SidebarLink
              href="/faq"
              label="FAQ"
              icon={<HelpCircleIcon className="h-5 w-5" />}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="md:ml-[230px]">
        <header className="sticky top-0 z-40 h-[62px] border-b border-slate-200 bg-white shadow-sm">
          <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
              <div className="text-[17px] font-extrabold text-[#1a3c8f]">{title}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-[#f0f4ff] px-2 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a3c8f] text-xs font-extrabold text-white">
                  {initials(nameLabel)}
                </div>
                <div className="pr-2 leading-tight">
                  <div className="text-xs font-bold text-slate-700">{nameLabel}</div>
                  <div className="text-[10px] font-semibold text-slate-500">{roleLabel}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="hidden h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign Out
              </button>

              <div className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-[#1a3c8f] text-xs font-extrabold text-white">
                {initials(nameLabel)}
              </div>

              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                aria-label="Sign out"
              >
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-7">{children}</main>
      </div>
    </div>
  );
}

