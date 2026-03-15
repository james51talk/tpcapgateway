"use client";

import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/Badge";
import CenterSelectorBar from "@/components/CenterSelectorBar";
import { BuildingIcon, BookIcon, BookOpenIcon, CalendarIcon, GraduationCapIcon, PieChartIcon, TrendingUpIcon, UserCheckIcon, UserMinusIcon, UsersIcon } from "@/components/Icons";
import KpiCard from "@/components/KpiCard";
import { getDashboardKpis } from "@/lib/metrics";

function kpiVisual(title) {
  switch (title) {
    case "Active Onlist":
      return { icon: <UsersIcon className="h-5 w-5" />, variant: "blue" };
    case "Overall Onlist":
      return { icon: <UserCheckIcon className="h-5 w-5" />, variant: "blue" };
    case "Attrition":
      return { icon: <UserMinusIcon className="h-5 w-5" />, variant: "red" };
    case "CO Revenue":
      return { icon: <TrendingUpIcon className="h-5 w-5" />, variant: "green" };
    case "Teacher Revenue":
      return { icon: <GraduationCapIcon className="h-5 w-5" />, variant: "yellow" };
    case "CO Monthly Revenue":
      return { icon: <CalendarIcon className="h-5 w-5" />, variant: "green" };
    case "CO Share":
      return { icon: <PieChartIcon className="h-5 w-5" />, variant: "blue" };
    case "Teacher Share":
      return { icon: <BookOpenIcon className="h-5 w-5" />, variant: "purple" };
    case "All Day Book/Open":
      return { icon: <BookIcon className="h-5 w-5" />, variant: "yellow" };
    default:
      return { icon: null, variant: "blue" };
  }
}

export default function DashboardPage() {
  const { session, activeCenter, activeCenterId } = useAuth();

  const needsCenter = session?.role === "admin" && !activeCenterId;

  const kpis = needsCenter ? [] : getDashboardKpis(activeCenterId);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your center&apos;s performance and enrollment metrics.
          </p>
        </div>

        <CenterSelectorBar />
      </div>

      {needsCenter ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          Select a center to view KPI data.
        </section>
      ) : (
        <>
          <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-4 px-5 py-5">
              <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain" />
              <div className="min-w-0">
                <div className="truncate text-base font-extrabold text-slate-800">
                  {activeCenter?.name || "Center"}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">Active center · Current billing cycle</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="green">Active</Badge>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((k) => {
              const v = kpiVisual(k.title);
              return (
                <KpiCard
                  key={k.title}
                  title={k.title}
                  value={k.value}
                  subtitle={k.subtitle}
                  icon={v.icon}
                  variant={v.variant}
                />
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

