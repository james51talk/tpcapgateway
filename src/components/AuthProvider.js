"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, saveSession, SESSION_KEY } from "@/lib/session";
import { DB_KEY, findAccountById, findCenterById, getSeedDB, saveDB } from "@/lib/db";

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
  const [db, setDb] = useState(() => typeof window === "undefined" ? getSeedDB() : null);
  const [session, setSession] = useState(() => typeof window === "undefined" ? null : null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDb = () => {
      const parsed = readJSON(DB_KEY);
      if (!parsed?.centers || !parsed?.accounts) {
        const seeded = getSeedDB();
        setDb(seeded);
        saveDB(seeded);
      } else {
        setDb(parsed);
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

    updateDb();
    updateSession();

    const handler = () => {
      updateDb();
      updateSession();
    };

    window.addEventListener("storage", handler);
    window.addEventListener("tpcap:store", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("tpcap:store", handler);
    };
  }, []);

  const loading = db === null;

  const api = useMemo(() => {
    const account = db && session ? findAccountById(db, session.accountId) : null;

    const activeCenterId =
      session?.role === "admin" ? session?.selectedCenterId ?? null : account?.centerId ?? null;
    const activeCenter = db && activeCenterId ? findCenterById(db, activeCenterId) : null;

    return {
      db,
      session,
      loading,
      account,
      activeCenter,
      activeCenterId,
      login: ({ username, password }) => {
        if (!db) return { ok: false, error: "App is still loading." };
        const match = db.accounts.find(
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
        return { ok: true };
      },
      logout: () => {
        clearSession();
      },
      selectCenter: (centerId) => {
        if (!session || session.role !== "admin") return;
        saveSession({ ...session, selectedCenterId: centerId || null });
      },
      updateDB: (updater) => {
        if (!db) return;
        const next = updater(structuredClone(db));
        saveDB(next);
      },
    };
  }, [db, session, loading]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

