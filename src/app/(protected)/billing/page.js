"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import KpiCard from "@/components/KpiCard";
import { formatPHP, getBillingData } from "@/lib/metrics";
import { downloadBillingPdf } from "@/lib/pdf";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            Billing
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Weekly breakdown, totals, and downloadable statement.
          </p>
        </div>

        <button
          onClick={() => {
            if (!billing) return;
            downloadBillingPdf({
              centerName: activeCenter?.name,
              weeks: billing.weeks,
              totals: billing.totals,
            });
          }}
          disabled={!billing}
          className={[
            "h-11 rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition-colors",
            billing ? "bg-blue-600 hover:bg-blue-500" : "bg-zinc-300",
          ].join(" ")}
        >
          Download Bill as PDF
        </button>
      </div>

      {needsCenter ? (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Select a center from the header dropdown to load billing data.
        </section>
      ) : null}

      {billing ? (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {kpis.map((k) => (
              <KpiCard key={k.title} title={k.title} value={k.value} subtitle={k.subtitle} />
            ))}
          </section>

          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
            <div className="border-b border-zinc-100 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Weekly Breakdown</div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    Center: {activeCenter?.name || "Not selected"}
                  </div>
                </div>
                <div className="text-xs font-semibold text-zinc-500">Currency: PHP</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Week</th>
                    <th className="px-4 py-3 text-right">Total Revenue</th>
                    <th className="px-4 py-3 text-right">CO Share</th>
                    <th className="px-4 py-3 text-right">Teacher Share</th>
                    <th className="px-4 py-3 text-right">Lesson Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {billing.weeks.map((w) => (
                    <tr key={w.week} className="text-zinc-800 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium">{w.week}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatPHP(w.totalRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatPHP(w.coShare)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPHP(w.teacherShare)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPHP(w.lessonShare)}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-yellow-100 font-extrabold text-zinc-900">
                    <td className="px-4 py-3">TOTAL</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatPHP(billing.totals.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPHP(billing.totals.coShare)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatPHP(billing.totals.teacherShare)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatPHP(billing.totals.lessonShare)}
                    </td>
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

