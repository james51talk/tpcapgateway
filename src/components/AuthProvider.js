"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, loadSession, saveSession, SESSION_KEY } from "@/lib/session";

const AuthContext = createContext(null);

function readJSON(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [centers, setCenters] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [session, setSession] = useState(() => (typeof window === "undefined" ? null : loadSession()));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateCenters = async () => {
      try {
        const res = await fetch("/api/centers");
        if (res.ok) {
          const data = await res.json();
          setCenters(data);
        } else {
          console.error("Failed to fetch centers");
          setCenters([]);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
        setCenters([]);
      }
    };

    const updateAccounts = async () => {
      try {
        const res = await fetch("/api/accounts");
        if (res.ok) {
          const data = await res.json();
          setAccounts(data);
        } else {
          console.error("Failed to fetch accounts");
          setAccounts([]);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      }
    };

    const updateSession = () => {
      const parsed = readJSON(SESSION_KEY);
      if (!parsed?.accountId || !parsed?.role) {
        setSession(null);
      } else {
        setSession(parsed);
      }
    };

    updateCenters();
    updateAccounts();
    updateSession();

    const handler = () => {
      updateSession();
    };

    window.addEventListener("storage", handler);
    window.addEventListener("tpcap:store", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("tpcap:store", handler);
    };
  }, []);

  const loading = accounts.length === 0 && centers.length === 0; // rough loading check

  const api = useMemo(() => {
    const account = accounts.find((a) => a.id === session?.accountId) || null;

    const activeCenterId =
      session?.role === "admin" ? session?.selectedCenterId ?? null : account?.centerId ?? null;
    const activeCenter = centers.find((c) => c.id === activeCenterId) || null;

    return {
      centers,
      accounts,
      session,
      loading,
      account,
      activeCenter,
      activeCenterId,
      login: ({ username, password }) => {
        const match = accounts.find(
          (a) =>
            a.username.trim().toLowerCase() === username.trim().toLowerCase() &&
            a.password === password
        );
        if (!match) return { ok: false, error: "Invalid credentials." };
        const nextSession = {
          accountId: match.id,
          role: match.role,
          selectedCenterId: match.role === "admin" ? null : match.centerId ?? null,
        };
        saveSession(nextSession);
        setSession(nextSession);
        return { ok: true };
      },
      logout: () => {
        clearSession();
        setSession(null);
      },
      selectCenter: (centerId) => {
        if (!session || session.role !== "admin") return;
        const nextSession = { ...session, selectedCenterId: centerId || null };
        saveSession(nextSession);
        setSession(nextSession);
      },
      refreshData: async () => {
        // To refresh centers and accounts after changes
        try {
          const [centersRes, accountsRes] = await Promise.all([
            fetch("/api/centers"),
            fetch("/api/accounts"),
          ]);
          if (centersRes.ok) setCenters(await centersRes.json());
          if (accountsRes.ok) setAccounts(await accountsRes.json());
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      },
    };
  }, [centers, accounts, session, loading]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

