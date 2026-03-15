"use client";

import { useAuth } from "@/components/AuthProvider";
import KpiCard from "@/components/KpiCard";
import { getDashboardKpis } from "@/lib/metrics";

export default function DashboardPage() {
  const { session, activeCenter, activeCenterId } = useAuth();

  const needsCenter = session?.role === "admin" && !activeCenterId;

  const kpis = needsCenter ? [] : getDashboardKpis(activeCenterId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Track KPIs for the currently selected center.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-yellow-200 to-yellow-100 p-4 ring-1 ring-yellow-200 sm:max-w-md">
          <div className="text-xs font-semibold text-zinc-600">Center Info</div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            {activeCenter
              ? activeCenter.name
              : session?.role === "admin"
                ? "Select a center to view data"
                : "No center assigned"}
          </div>
          <div className="mt-1 text-xs text-zinc-600">
            {session?.role === "admin"
              ? "Administrator view"
              : "Center Owner view"}
          </div>
        </div>
      </div>

      {needsCenter ? (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Select a center from the header dropdown to load KPIs.
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <KpiCard key={k.title} title={k.title} value={k.value} subtitle={k.subtitle} />
          ))}
        </section>
      )}
    </div>
  );
}

