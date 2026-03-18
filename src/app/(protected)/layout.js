"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (loading) return;
    if (!session) return;
    if (pathname === "/admin" && session.role !== "admin") router.replace("/");
  }, [loading, session, pathname, router]);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!session) {
    return <div className="min-h-screen bg-white" />;
  }

  return <AppShell>{children}</AppShell>;
}

