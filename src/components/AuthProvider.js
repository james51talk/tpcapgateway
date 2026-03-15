"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { clearSession, loadSession, saveSession } from "@/lib/session";
import { findAccountById, findCenterById, loadDB, saveDB } from "@/lib/db";

const AuthContext = createContext(null);

function normalizeRole(mode) {
  return mode === "admin" ? "admin" : "center_owner";
}

export function AuthProvider({ children }) {
  const [db, setDb] = useState(() => loadDB());
  const [session, setSession] = useState(() => loadSession());
  const [loading] = useState(false);

  function persistDB(nextDB) {
    setDb(nextDB);
    saveDB(nextDB);
  }

  function persistSession(nextSession) {
    setSession(nextSession);
    if (nextSession) saveSession(nextSession);
    else clearSession();
  }

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
        persistSession(nextSession);
        return { ok: true };
      },
      logout: () => {
        persistSession(null);
      },
      selectCenter: (centerId) => {
        if (!session || session.role !== "admin") return;
        persistSession({ ...session, selectedCenterId: centerId || null });
      },
      updateDB: (updater) => {
        if (!db) return;
        const next = updater(structuredClone(db));
        persistDB(next);
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

