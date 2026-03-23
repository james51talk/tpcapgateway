"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, loadSession, saveSession, SESSION_KEY } from "@/services/session";

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
  const [centersLoaded, setCentersLoaded] = useState(false);
  const [accountsLoaded, setAccountsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchJson = async (url) => {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return null;
        return await res.json();
      } finally {
        window.clearTimeout(timer);
      }
    };

    const updateCenters = async () => {
      try {
        const data = await fetchJson("/api/centers");
        setCenters(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching centers:", error);
        setCenters([]);
      } finally {
        setCentersLoaded(true);
      }
    };

    const updateAccounts = async () => {
      try {
        const data = await fetchJson("/api/accounts");
        setAccounts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      } finally {
        setAccountsLoaded(true);
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

  const loading = !(accountsLoaded && centersLoaded);

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
