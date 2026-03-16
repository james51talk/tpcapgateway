"use client";

import { useMemo, useState } from "react";
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
      return { icon: <PesoSignIcon className="h-5 w-5" />, variant: "auto" };
    case "CO Share":
      return { icon: <BuildingIcon className="h-5 w-5" />, variant: "auto" };
    case "Teacher Share":
      return { icon: <UserIcon className="h-5 w-5" />, variant: "auto" };
    case "Lesson Share":
      return { icon: <LayersIcon className="h-5 w-5" />, variant: "auto" };
    case "Weekly Billed":
      return { icon: <CalendarCheckIcon className="h-5 w-5" />, variant: "auto" };
    default:
      return { icon: null, variant: "auto" };
  }
}

export default function BillingPage() {
  const { session, activeCenter, activeCenterId } = useAuth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [filterMonth, setFilterMonth] = useState(monthNames[new Date().getMonth()]);

  const needsCenter = session?.role === "admin" && !activeCenterId;

  const billing = useMemo(() => {
    if (needsCenter) return null;
    return getBillingData(activeCenterId);
  }, [activeCenterId, needsCenter]);

  const filteredWeeks = useMemo(() => {
    if (!billing) return [];
    if (filterMonth === 'all') return billing.weeks;
    const selectedMonthIndex = monthNames.indexOf(filterMonth);
    return billing.weeks.filter((w) => w.startDate.getMonth() === selectedMonthIndex);
  }, [billing, filterMonth, monthNames]);

  const filteredTotals = useMemo(() => {
    if (!filteredWeeks.length) return { totalRevenue: 0, coShare: 0, teacherShare: 0, lessonShare: 0 };
    return filteredWeeks.reduce(
      (acc, w) => {
        acc.totalRevenue += w.totalRevenue;
        acc.coShare += w.coShare;
        acc.teacherShare += w.teacherShare;
        acc.lessonShare += w.lessonShare;
        return acc;
      },
      { totalRevenue: 0, coShare: 0, teacherShare: 0, lessonShare: 0 }
    );
  }, [filteredWeeks]);

  const kpis = billing
    ? [
        { title: "Total Revenue", value: formatPHP(filteredTotals.totalRevenue) },
        { title: "CO Share", value: formatPHP(filteredTotals.coShare) },
        { title: "Teacher Share", value: formatPHP(filteredTotals.teacherShare) },
        { title: "Lesson Share", value: formatPHP(filteredTotals.lessonShare) },
        { title: "Weekly Billed", value: formatPHP(filteredTotals.totalRevenue) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-800">Billing</h1>
        <p className="mt-1 text-sm text-slate-500">Weekly billing statement and revenue breakdown.</p>
      </div>

      <CenterSelectorBar />

      {billing && (
        <section className="rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-800">Select month</div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="min-w-[180px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                >
                  {monthNames.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Viewing {filterMonth}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  downloadBillingPdf({
                    centerName: activeCenter?.name,
                    periods: filteredWeeks,
                    totals: filteredTotals,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-semibold text-blue-900 shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download monthly bill
              </button>
              <span className="text-xs text-slate-500">Only includes weeks in the selected month.</span>
            </div>
          </div>
        </section>
      )}

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
                <thead className="sticky top-0 z-10 bg-white/90 text-[11px] font-bold uppercase tracking-wide text-slate-500 shadow-sm">
                  <tr>
                    <th className="px-4 py-3">Week</th>
                    <th className="px-4 py-3 text-right">Total Revenue</th>
                    <th className="px-4 py-3 text-right">CO Share</th>
                    <th className="px-4 py-3 text-right">Teacher Share</th>
                    <th className="px-4 py-3">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWeeks.map((w) => (
                    <tr key={w.week} className="text-slate-700 even:bg-slate-50 hover:bg-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-800">{w.week}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-blue-700">
                        {formatPHP(w.totalRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-blue-700">{formatPHP(w.coShare)}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-blue-700">
                        {formatPHP(w.teacherShare)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            downloadBillingPdf({
                              centerName: activeCenter?.name,
                              periods: [w],
                              totals: {
                                totalRevenue: w.totalRevenue,
                                coShare: w.coShare,
                                teacherShare: w.teacherShare,
                                lessonShare: w.lessonShare,
                              },
                            });
                          }}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 font-extrabold text-slate-900 border-t-2 border-blue-200">
                    <td className="px-4 py-4 text-lg" colSpan={5}>
                      Monthly Bill Total
                    </td>
                  </tr>
                  <tr className="bg-blue-50/80 font-extrabold text-slate-900">
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-blue-700">
                      {formatPHP(filteredTotals.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-blue-700">
                      {formatPHP(filteredTotals.coShare)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-blue-700">
                      {formatPHP(filteredTotals.teacherShare)}
                    </td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

