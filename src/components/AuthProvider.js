"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { clearSession, saveSession, SESSION_KEY } from "@/lib/session";
import { DB_KEY, findAccountById, findCenterById, getSeedDB, saveDB } from "@/lib/db";

const AuthContext = createContext(null);

function normalizeRole(mode) {
  return mode === "admin" ? "admin" : "center_owner";
}

function subscribe(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("tpcap:store", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("tpcap:store", handler);
  };
}

function readJSON(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getDbSnapshot() {
  if (typeof window === "undefined") return getSeedDB();
  const parsed = readJSON(DB_KEY);
  if (!parsed?.centers || !parsed?.accounts) return getSeedDB();
  return parsed;
}

function getSessionSnapshot() {
  if (typeof window === "undefined") return null;
  const parsed = readJSON(SESSION_KEY);
  if (!parsed?.accountId || !parsed?.role) return null;
  return parsed;
}

export function AuthProvider({ children }) {
  const db = useSyncExternalStore(subscribe, getDbSnapshot, getSeedDB);
  const session = useSyncExternalStore(subscribe, getSessionSnapshot, () => null);
  const loading = false;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) saveDB(getSeedDB());
  }, []);

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
      login: ({ mode, username, password }) => {
        if (!db) return { ok: false, error: "App is still loading." };
        const role = normalizeRole(mode);
        const match = db.accounts.find(
          (a) =>
            a.role === role &&
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

