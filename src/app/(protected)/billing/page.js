"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/Badge";
import CenterSelectorBar from "@/components/CenterSelectorBar";
import { BuildingIcon, CalendarCheckIcon, LayersIcon, PesoSignIcon, UserIcon } from "@/components/Icons";
import KpiCard from "@/components/KpiCard";
import { formatPHP, getBillingData } from "@/lib/metrics";
import { downloadBillingPdf } from "@/lib/pdf";

function kpiVisual(title) {
  switch (title) {
    case "Total Revenue":
      return { icon: <PesoSignIcon className="h-5 w-5" />, variant: "green" };
    case "CO Share":
      return { icon: <BuildingIcon className="h-5 w-5" />, variant: "blue" };
    case "Teacher Share":
      return { icon: <UserIcon className="h-5 w-5" />, variant: "purple" };
    case "Lesson Share":
      return { icon: <LayersIcon className="h-5 w-5" />, variant: "yellow" };
    case "Weekly Billed":
      return { icon: <CalendarCheckIcon className="h-5 w-5" />, variant: "green" };
    default:
      return { icon: null, variant: "blue" };
  }
}

export default function BillingPage() {
  const { session, activeCenter, activeCenterId } = useAuth();

  const needsCenter = session?.role === "admin" && !activeCenterId;

  const billing = useMemo(() => {
    if (needsCenter) return null;
    return getBillingData(activeCenterId);
  }, [activeCenterId, needsCenter]);

  const kpis = billing
    ? [
        { title: "Total Revenue", value: formatPHP(billing.totals.totalRevenue) },
        { title: "CO Share", value: formatPHP(billing.totals.coShare) },
        { title: "Teacher Share", value: formatPHP(billing.totals.teacherShare) },
        { title: "Lesson Share", value: formatPHP(billing.totals.lessonShare) },
        { title: "Weekly Billed", value: formatPHP(billing.weeklyBilled) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-800">Billing</h1>
        <p className="mt-1 text-sm text-slate-500">Weekly billing statement and revenue breakdown.</p>
      </div>

      <CenterSelectorBar />

      {needsCenter ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          Select a center to view billing data.
        </section>
      ) : null}

      {billing ? (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Weekly Billing Breakdown</div>
                  <div className="mt-0.5 text-xs text-slate-500">{activeCenter?.name}</div>
                </div>
                <Badge variant="blue">PHP</Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Week</th>
                    <th className="px-4 py-3 text-right">Total Revenue</th>
                    <th className="px-4 py-3 text-right">CO Share</th>
                    <th className="px-4 py-3 text-right">Teacher Share</th>
                    <th className="px-4 py-3 text-right">Lesson Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billing.weeks.map((w) => (
                    <tr key={w.week} className="text-slate-700 hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{w.week}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                        {formatPHP(w.totalRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">{formatPHP(w.coShare)}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {formatPHP(w.teacherShare)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {formatPHP(w.lessonShare)}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-yellow-300/80 font-extrabold text-blue-900">
                    <td className="px-4 py-3">TOTAL</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatPHP(billing.totals.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatPHP(billing.totals.coShare)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatPHP(billing.totals.teacherShare)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {formatPHP(billing.totals.lessonShare)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={() => {
                downloadBillingPdf({
                  centerName: activeCenter?.name,
                  weeks: billing.weeks,
                  totals: billing.totals,
                });
              }}
              className="h-11 rounded-xl bg-yellow-400 px-4 text-sm font-extrabold text-blue-900 shadow-sm hover:bg-yellow-300"
            >
              Download Bill as PDF
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

