"use client";

import { useEffect, useState } from "react";

function getScoreColor(pct) {
  if (pct >= 70) return { stroke: "#10b981", label: "text-emerald-600", bg: "from-emerald-50 to-emerald-100/40", glow: "shadow-emerald-200/40" };
  if (pct >= 40) return { stroke: "#f59e0b", label: "text-amber-600", bg: "from-amber-50 to-amber-100/40", glow: "shadow-amber-200/40" };
  return { stroke: "#ef4444", label: "text-red-600", bg: "from-red-50 to-red-100/40", glow: "shadow-red-200/40" };
}

function getScoreLabel(pct) {
  if (pct >= 80) return "Excellent";
  if (pct >= 60) return "Good";
  if (pct >= 40) return "Fair";
  return "Needs Attention";
}

export default function HealthScoreWidget({ summary }) {
  const { healthPercentage = 0, healthyKpis = 0, needsAttention = 0, totalKpis = 0 } = summary || {};
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(healthPercentage), 200);
    return () => clearTimeout(t);
  }, [healthPercentage]);

  const color = getScoreColor(healthPercentage);
  const scoreLabel = getScoreLabel(healthPercentage);

  // SVG params
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <div
      className={`rounded-2xl border border-blue-200/60 bg-gradient-to-br ${color.bg} p-6 shadow-md ${color.glow} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center gap-6">
        {/* SVG Gauge */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-slate-200/60"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-extrabold font-mono ${color.label}`}>
              {Math.round(animatedPct)}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Health
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Center Health Score</h3>
          <p className={`text-xs font-bold ${color.label} mb-3`}>{scoreLabel}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">
                <span className="font-bold text-emerald-700">{healthyKpis}</span> Healthy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-slate-600">
                <span className="font-bold text-red-600">{needsAttention}</span> Needs Attention
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="text-xs font-medium text-slate-600">
                <span className="font-bold text-slate-700">{totalKpis}</span> Total KPIs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
