"use client";

import { useMemo, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Badge from '@/components/Badge';
import CenterSelectorBar from '@/components/CenterSelectorBar';
import DashboardDateFilter from '@/components/DashboardDateFilter';
import { BuildingIcon, PesoSignIcon } from '@/components/Icons';
import { formatPHP, getBillingData } from '@/lib/metrics';
import { downloadBillingPdf } from '@/lib/pdf';

export default function EarningsPage() {
  const { session, activeCenter, activeCenterId } = useAuth();

  const [filterOptions, setFilterOptions] = useState({ filterType: 'month', filterDate: new Date() });

  const needsCenter = session?.role === 'admin' && !activeCenterId;

  const billing = useMemo(() => {
    if (needsCenter) return null;
    return getBillingData(activeCenterId);
  }, [activeCenterId, needsCenter]);

  const handleFilterChange = (options) => {
    setFilterOptions(options);
  };

  const { filterType, filterDate } = filterOptions;

  const filteredWeeks = useMemo(() => {
    if (!billing) return [];
    const allWeeks = billing.weeks || [];
    if (filterType === 'week') {
      return allWeeks.filter(w => {
        const weekStart = w.startDate;
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return filterDate >= weekStart && filterDate <= weekEnd;
      });
    } else {
      const currentMonth = filterDate.getMonth();
      const currentYear = filterDate.getFullYear();
      return allWeeks.filter(w => w.startDate.getMonth() === currentMonth && w.startDate.getFullYear() === currentYear);
    }
  }, [billing, filterType, filterDate]);

  const filteredTotals = useMemo(() => {
    if (!filteredWeeks.length) return { totalRevenue: 0, coShare: 0, teacherShare: 0 };
    return filteredWeeks.reduce((acc, w) => ({
      totalRevenue: acc.totalRevenue + w.totalRevenue,
      coShare: acc.coShare + w.coShare,
      teacherShare: acc.teacherShare + w.teacherShare
    }), { totalRevenue: 0, coShare: 0, teacherShare: 0 });
  }, [filteredWeeks]);

  const downloadLabel = filterType === 'week' ? 'Download week earnings' : 'Download monthly earnings';

  const downloadFiltered = () => {
    downloadBillingPdf({
      centerName: activeCenter?.name,
      periods: filteredWeeks,
      totals: filteredTotals,
    });
  };

  const downloadWeek = (w) => {
    downloadBillingPdf({
      centerName: activeCenter?.name,
      periods: [w],
      totals: {
        totalRevenue: w.totalRevenue,
        coShare: w.coShare,
        teacherShare: w.teacherShare,
      },
    });
  };

  return (
    <div className="space-y-6 relative z-0">
      <div className="space-y-3">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-900 via-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Earnings
            </h1>
            <Badge variant="yellow">Financial Overview</Badge>
          </div>
          <p className="mt-3 text-base lg:text-lg text-slate-600 font-medium">
            Weekly statements and revenue breakdowns
          </p>
        </div>
        <CenterSelectorBar />
      </div>

      {!needsCenter && (
        <section className="relative z-40 rounded-2xl bg-gradient-to-br from-white to-yellow-50/30 shadow-md border border-blue-200/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700 delay-100 pb-12">
          <div className="px-6 py-5">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200">
                <PesoSignIcon className="h-6 w-6 text-yellow-700" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-bold bg-gradient-to-r from-blue-900 to-yellow-700 bg-clip-text text-transparent">
                  {activeCenter?.name || "Center"}
                </div>
                <div className="text-xs font-medium text-slate-500">Earnings Active</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="blue">PHP</Badge>
              </div>
            </div>
            <div className="pl-16 relative z-50">
              <DashboardDateFilter onFilterChange={handleFilterChange} initialFilterType="month" />
            </div>
          </div>
        </section>
      )}

      {needsCenter ? (
        <section className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 p-6 text-base text-slate-700 font-medium shadow-md backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700 z-0">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
            Select a center to view earnings data.
          </div>
        </section>
      ) : null}

      {billing && filteredWeeks.length > 0 && (
        <section className="overflow-hidden rounded-2xl bg-white/80 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 relative z-10 -mt-16 pt-24">
          <div className="border-b border-slate-200/50 px-6 py-4 bg-gradient-to-r from-blue-50/50 to-yellow-50/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-slate-900">Weekly Earnings Breakdown</div>
                <div className="mt-1 text-sm text-slate-600">{activeCenter?.name || "Center"}</div>
              </div>
              <Badge variant="yellow">Filtered View</Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-20 bg-white/95 text-xs font-bold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left">Week</th>
                  <th className="px-6 py-4 text-right">Total Revenue</th>
                  <th className="px-6 py-4 text-right">CO Earnings</th>
                  <th className="px-6 py-4 text-right">Teacher Earnings</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWeeks.map((w) => (
                  <tr key={w.week} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                    <td className="px-6 py-4 font-semibold text-slate-900">{w.week}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-yellow-700 tabular-nums">
                      {formatPHP(w.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-blue-700 tabular-nums">{formatPHP(w.coShare)}</td>
                    <td className="px-6 py-4 text-right font-mono text-green-700 tabular-nums">
                      {formatPHP(w.teacherShare)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadWeek(w)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredWeeks.length > 1 && (
                  <>
                    <tr className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border-t-2 border-yellow-200 font-bold text-slate-900">
                      <td className="px-6 py-4 text-base font-extrabold" colSpan={4}>
                        Total ({filterType.toUpperCase()})
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={downloadFiltered}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2 text-sm font-semibold text-yellow-900 shadow-lg hover:shadow-xl hover:from-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-200"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {downloadLabel}
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-gradient-to-r from-yellow-100 to-orange-100/50 font-extrabold text-slate-900">
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-right font-mono font-bold tabular-nums text-yellow-800">
                        {formatPHP(filteredTotals.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold tabular-nums text-blue-800">
                        {formatPHP(filteredTotals.coShare)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold tabular-nums text-green-800">
                        {formatPHP(filteredTotals.teacherShare)}
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

