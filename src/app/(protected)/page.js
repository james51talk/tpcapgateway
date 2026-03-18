"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/Badge";
import CenterSelectorBar from "@/components/CenterSelectorBar";
import DashboardDateFilter from "@/components/DashboardDateFilter";
import { BuildingIcon, BookIcon, BookOpenIcon, CalendarIcon, GraduationCapIcon, PieChartIcon, TrendingUpIcon, UserCheckIcon, UserMinusIcon, UsersIcon } from "@/components/Icons";
import KpiCard from "@/components/KpiCard";
import { getDashboardKpis } from "@/lib/metrics";

function kpiVisual(title) {
  switch (title) {
    case "Time Coverage":
      return { icon: <CalendarIcon className="h-5 w-5" />, variant: "blue" };
    case "Active Onlist":
      return { icon: <UsersIcon className="h-5 w-5" />, variant: "blue" };
    case "Overall Onlist":
      return { icon: <UserCheckIcon className="h-5 w-5" />, variant: "blue" };
    case "Center Capacity":
      return { icon: <BuildingIcon className="h-5 w-5" />, variant: "blue" };
    case "Utilization":
      return { icon: <PieChartIcon className="h-5 w-5" />, variant: "blue" };
    case "Teacher Earnings":
      return { icon: <GraduationCapIcon className="h-5 w-5" />, variant: "yellow" };
    case "CO Earnings":
      return { icon: <TrendingUpIcon className="h-5 w-5" />, variant: "green" };
    case "Attrition":
      return { icon: <UserMinusIcon className="h-5 w-5" />, variant: "red" };
    default:
      return { icon: null, variant: "blue" };
  }
}

export default function DashboardPage() {
  const { session, activeCenter, activeCenterId } = useAuth();
  const [filterOptions, setFilterOptions] = useState({ filterType: "week", filterDate: new Date() });

  const needsCenter = session?.role === "admin" && !activeCenterId;

  const dashboardData = needsCenter ? { dateRange: "", kpis: [] } : getDashboardKpis(activeCenterId, filterOptions);
  const { dateRange, kpis } = dashboardData;

  const handleFilterChange = (options) => {
    setFilterOptions(options);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
            <Badge variant="yellow">Weekly Update</Badge>
          </div>
          <p className="mt-3 text-base lg:text-lg text-slate-600 font-medium">Overview of your center&apos;s performance</p>
        </div>

        <CenterSelectorBar />

        {!needsCenter && <DashboardDateFilter onFilterChange={handleFilterChange} />}
      </div>

      {needsCenter ? (
        <section className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 p-6 text-base text-slate-700 font-medium shadow-md backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" />
            </svg>
            Select a center to view KPI data.
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-2xl bg-gradient-to-br from-white to-yellow-50/30 shadow-md border border-blue-200/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  {activeCenter?.name || "Center"}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500">Active center</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="blue">Active</Badge>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {kpis.map((k) => {
              const v = kpiVisual(k.title);
              return (
                <KpiCard
                  key={k.title}
                  title={k.title}
                  value={k.value}
                  previous={k.previous}
                  subtitle={k.subtitle}
                  icon={v.icon}
                  variant={v.variant}
                  status={k.status}
                />
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

