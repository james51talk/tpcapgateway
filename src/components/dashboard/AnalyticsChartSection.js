"use client";

import { useEffect, useState } from "react";

/* ─── Animated bar for the comparison chart ─────────────────────────────────── */
function AnimatedBar({ value, maxValue, color, delay = 0 }) {
  const [height, setHeight] = useState(0);
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  useEffect(() => {
    const t = setTimeout(() => setHeight(Math.min(100, Math.max(4, pct))), 150 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div
      className={`w-full rounded-t-md bg-gradient-to-t ${color} transition-all duration-700 ease-out`}
      style={{ height: `${height}%` }}
    />
  );
}

/* ─── Comparison Bar Chart: current vs previous ─────────────────────────────── */
function ComparisonBarChart({ kpis }) {
  // Filter to numeric-friendly KPIs
  const items = kpis
    .filter((k) => ["Active Onlist", "Overall Onlist", "Attrition"].includes(k.title))
    .map((k) => {
      const cur = parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0;
      const prev = parseFloat(String(k.previous).replace(/[^0-9.]/g, "")) || 0;
      return { title: k.title.replace("Overall ", "").replace("Active ", "Act. "), current: cur, previous: prev };
    });

  const allValues = items.flatMap((i) => [i.current, i.previous]);
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-50/30 p-5 shadow-md backdrop-blur-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
        <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" /><path d="M7 16h2V9H7z" /><path d="M12 16h2V5h-2z" /><path d="M17 16h2v-4h-2z" />
        </svg>
        Enrollment Comparison
      </h4>

      <div className="flex items-end gap-4 h-36">
        {items.map((item, idx) => (
          <div key={item.title} className="flex-1 flex flex-col items-center gap-1 h-full">
            <div className="flex-1 flex items-end gap-1 w-full">
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <span className="text-[9px] font-bold text-slate-400 mb-1">{item.previous}</span>
                <div className="w-full h-full flex items-end">
                  <AnimatedBar
                    value={item.previous}
                    maxValue={maxVal}
                    color="from-slate-300 to-slate-200"
                    delay={idx * 100}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end">
                <span className="text-[9px] font-bold text-blue-600 mb-1">{item.current}</span>
                <div className="w-full h-full flex items-end">
                  <AnimatedBar
                    value={item.current}
                    maxValue={maxVal}
                    color="from-blue-500 to-blue-400"
                    delay={idx * 100 + 50}
                  />
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 mt-1 text-center leading-tight">
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-200/50">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
          <span className="text-[10px] font-semibold text-slate-400">Previous</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          <span className="text-[10px] font-semibold text-slate-400">Current</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Donut Ring Chart: Capacity & Utilization ──────────────────────────────── */
function DonutRingChart({ kpis }) {
  const capacityKpi = kpis.find((k) => k.title === "Center Capacity");
  const utilizationKpi = kpis.find((k) => k.title === "Utilization");

  const capacity = parseFloat(String(capacityKpi?.value).replace(/[^0-9.]/g, "")) || 0;
  const utilization = parseFloat(String(utilizationKpi?.value).replace(/[^0-9.]/g, "")) || 0;

  const [animCap, setAnimCap] = useState(0);
  const [animUtil, setAnimUtil] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimCap(capacity), 200);
    const t2 = setTimeout(() => setAnimUtil(utilization), 350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [capacity, utilization]);

  const size = 140;
  const outerR = 58;
  const innerR = 44;
  const outerCirc = 2 * Math.PI * outerR;
  const innerCirc = 2 * Math.PI * innerR;
  const outerOffset = outerCirc - (animCap / 100) * outerCirc;
  const innerOffset = innerCirc - (animUtil / 100) * innerCirc;

  return (
    <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-yellow-50/30 p-5 shadow-md backdrop-blur-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
        <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
        Capacity & Utilization
      </h4>

      <div className="flex items-center justify-center gap-6">
        {/* Concentric rings */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Outer ring track */}
            <circle cx={size/2} cy={size/2} r={outerR} fill="none" stroke="#e2e8f0" strokeWidth={10} />
            {/* Outer ring (Capacity) */}
            <circle
              cx={size/2} cy={size/2} r={outerR} fill="none"
              stroke="#3b82f6" strokeWidth={10} strokeLinecap="round"
              strokeDasharray={outerCirc} strokeDashoffset={outerOffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* Inner ring track */}
            <circle cx={size/2} cy={size/2} r={innerR} fill="none" stroke="#e2e8f0" strokeWidth={8} />
            {/* Inner ring (Utilization) */}
            <circle
              cx={size/2} cy={size/2} r={innerR} fill="none"
              stroke="#8b5cf6" strokeWidth={8} strokeLinecap="round"
              strokeDasharray={innerCirc} strokeDashoffset={innerOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold font-mono text-slate-700">
              {Math.round(animCap)}%
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Cap</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-slate-700">Capacity</span>
            </div>
            <div className="text-lg font-extrabold font-mono text-blue-600 ml-5">{capacity}%</div>
            {capacityKpi?.previous && (
              <div className="text-[10px] text-slate-400 font-medium ml-5">
                was {capacityKpi.previous}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-slate-700">Utilization</span>
            </div>
            <div className="text-lg font-extrabold font-mono text-purple-600 ml-5">{utilization}%</div>
            {utilizationKpi?.previous && (
              <div className="text-[10px] text-slate-400 font-medium ml-5">
                was {utilizationKpi.previous}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────────────────── */
export default function AnalyticsChartSection({ kpis }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <ComparisonBarChart kpis={kpis} />
      <DonutRingChart kpis={kpis} />
    </div>
  );
}
