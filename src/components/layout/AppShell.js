"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/layout/AuthProvider";
import { FileTextIcon, HelpCircleIcon, LayoutDashboardIcon, LogOutIcon, MenuIcon, ShieldIcon, UserIcon, XIcon } from "@/components/ui/Icons";

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
        "flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold transition-all duration-200",
        "border-l-[3px] border-transparent",
        active
          ? "bg-yellow-300/20 text-yellow-300 border-l-yellow-300"
          : "text-white/70 hover:bg-white/10 hover:text-white/90",
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
    if (pathname === "/") return "Analytics";
    if (pathname === "/centers") return "Center Information";
    if (pathname === "/billing") return "Earnings";
if (pathname === "/account-settings") return "Account Settings";
    if (pathname === "/admin") return "Center Management";
    if (pathname === "/faq") return "FAQ";
    return "TPCAP-CO Portal";
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
          <div className="flex items-center gap-3">
            <img
              src="/51talklogo.png"
              alt="TPCAP-CO Logo"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <div className="text-sm font-extrabold tracking-widest text-yellow-300">
              TPCAP-CO Portal
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col">
          <div className="flex-1 py-3">
            <div className="px-5 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30">
              Main
            </div>
            <SidebarLink
              href="/"
              label="Analytics"
              icon={<LayoutDashboardIcon className="h-5 w-5" />}
              onNavigate={() => setMobileOpen(false)}
            />
            <SidebarLink
              href="/centers"
              label="Center Information"
              icon={<FileTextIcon className="h-5 w-5" />}
              onNavigate={() => setMobileOpen(false)}
            />
            <SidebarLink
              href="/billing"
              label="Earnings"
              icon={<FileTextIcon className="h-5 w-5" />}
              onNavigate={() => setMobileOpen(false)}
            />
            {!showAdmin && (
              <SidebarLink
href="/account-settings"
                label="Account"
                icon={<UserIcon className="h-5 w-5" />}
                onNavigate={() => setMobileOpen(false)}
              />
            )}
            {showAdmin ? (
              <>
                <div className="mt-3 px-5 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/30">
                  Admin
                </div>
                <SidebarLink
                  href="/admin"
                  label="Center Management"
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
                setMobileOpen(false);
                router.replace("/logout");
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
        <header className="sticky top-0 z-40 h-[62px] border-b border-blue-200/40 bg-gradient-to-r from-white to-yellow-50/30 shadow-sm backdrop-blur-sm">
          <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/50 bg-white text-blue-700 hover:bg-blue-50 md:hidden transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
              <div className="text-lg font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">{title}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-yellow-50/50 px-2 py-1 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white">
                  {initials(nameLabel)}
                </div>
                <div className="pr-2 leading-tight">
                  <div className="text-xs font-bold text-slate-900">{nameLabel}</div>
                  <div className="text-[10px] font-medium text-slate-600">{roleLabel}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  router.replace("/logout");
                }}
                className="hidden h-10 items-center justify-center gap-2 rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50 to-yellow-50/30 px-3 text-sm font-semibold text-slate-900 hover:bg-blue-100/50 sm:flex transition-colors"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign Out
              </button>

              <div className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white">
                {initials(nameLabel)}
              </div>

              <button
                onClick={() => {
                  router.replace("/logout");
                }}
                className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/50 bg-white text-blue-700 hover:bg-blue-50 transition-colors"
                aria-label="Sign out"
              >
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-7 bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-white min-h-[calc(100vh-62px)] relative overflow-hidden">
          <div className="absolute top-20 right-20 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-400/15 rounded-full blur-3xl"></div>
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
