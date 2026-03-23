"use client";

import { useEffect, useRef, useState } from "react";

// ─── Helper: build a sessionStorage cache key ────────────────────────────────
function cacheKey(centerId) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `tpcap.briefing.${centerId}.${today}`;
}

// ─── Shimmer loading card ─────────────────────────────────────────────────────
function BriefingShimmer() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading AI briefing"
      className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 p-5 shadow-md backdrop-blur-sm animate-pulse"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-lg bg-blue-200/70" />
        <div className="h-4 w-36 rounded bg-blue-200/70" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-200/80" />
        <div className="h-3 w-5/6 rounded bg-slate-200/80" />
        <div className="h-3 w-4/6 rounded bg-slate-200/80" />
      </div>
    </section>
  );
}

// ─── Sparkle / AI Icon ────────────────────────────────────────────────────────
function SparkleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 L13.5 8.5 L19 10 L13.5 11.5 L12 17 L10.5 11.5 L5 10 L10.5 8.5 Z" />
      <path d="M19 3 L19.8 5.2 L22 6 L19.8 6.8 L19 9 L18.2 6.8 L16 6 L18.2 5.2 Z" />
      <path d="M4 16 L4.6 17.8 L6.4 18.4 L4.6 19 L4 20.8 L3.4 19 L1.6 18.4 L3.4 17.8 Z" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SmartBriefing({ centerId, centerName, kpisToday, kpisYesterday, role, userName }) {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!centerId || !centerName || !kpisToday?.length) {
      setLoading(false);
      return;
    }

    // Reset on center change
    fetchedRef.current = false;
    setBriefing(null);
    setError(null);
    setLoading(true);

    const key = cacheKey(centerId);

    // Check sessionStorage cache first
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setBriefing(cached);
        setLoading(false);
        fetchedRef.current = true;
        return;
      }
    } catch {
      // sessionStorage might be unavailable
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Enrich KPI data with rawValues for delta analysis
    const enriched = kpisToday.map((k) => ({
      title: k.title,
      value: k.value,
      rawValue: k.rawValue ?? (parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0),
      status: k.status,
    }));
    const enrichedPrev = (kpisYesterday || []).map((k) => ({
      title: k.title,
      value: k.value,
      rawValue: k.rawValue ?? (parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0),
    }));

    fetch("/api/ai/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        centerId,
        centerName,
        role,
        userName,
        kpisToday: enriched,
        kpisYesterday: enrichedPrev,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 429) {
          setError("Daily AI quota reached — briefing will be available again tomorrow.");
        } else if (data.briefing) {
          setBriefing(data.briefing);
          try {
            sessionStorage.setItem(key, data.briefing);
          } catch {
            // ignore
          }
        } else {
          setError(data.error || "Briefing unavailable.");
        }
      })
      .catch(() => {
        setError("Could not connect to the AI service.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [centerId, centerName]);

  if (!centerId) return null;
  if (loading) return <BriefingShimmer />;

  if (error) {
    return (
      <section className="rounded-2xl border border-slate-200/60 bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm text-sm text-slate-400 flex items-center gap-2">
        <SparkleIcon className="h-4 w-4 text-slate-300 shrink-0" />
        <span>AI Business Analyst unavailable right now.</span>
      </section>
    );
  }

  if (!briefing) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/90 via-white to-yellow-50/60 p-5 shadow-md backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-yellow-300/10 blur-2xl" />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md shadow-blue-200">
          <SparkleIcon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">AI Business Analyst</p>
          <p className="text-[11px] text-slate-400 leading-none mt-0.5">Powered by Gemini · Daily summary</p>
        </div>
      </div>

      {/* Briefing text */}
      <p className="relative text-sm leading-relaxed text-slate-700 font-medium">
        {briefing}
      </p>
    </section>
  );
}
