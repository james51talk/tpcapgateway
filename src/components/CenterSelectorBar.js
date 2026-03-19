"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { BuildingIcon } from "@/components/Icons";

export default function CenterSelectorBar({ className = "" }) {
  const { session, centers, activeCenterId, selectCenter } = useAuth();
  const [selectedIsland, setSelectedIsland] = useState("");

  if (session?.role !== "admin") return null;

  const islands = useMemo(() => {
    const unique = [...new Set(centers.map(c => c.island).filter(Boolean))];
    return unique.sort();
  }, [centers]);

  const filteredCenters = useMemo(() => {
    if (!selectedIsland) return centers;
    return centers.filter(c => c.island === selectedIsland);
  }, [centers, selectedIsland]);

  const handleIslandChange = (island) => {
    setSelectedIsland(island);
    // If current active center is not in the new filtered list, reset selection
    if (activeCenterId && !filteredCenters.find(c => c.id === activeCenterId)) {
      selectCenter(null);
    }
  };

  return (
    <div
      className={[
        "flex flex-col gap-3 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-yellow-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between shadow-md backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3 text-sm font-bold text-blue-900">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-200 to-blue-100 text-blue-700 border border-blue-300">
          <BuildingIcon className="h-5 w-5" />
        </span>
        Select your center
      </div>

      <div className="flex gap-3 sm:flex-row">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-blue-700">Island</label>
          <select
            value={selectedIsland}
            onChange={(e) => handleIslandChange(e.target.value)}
            className="h-11 w-full rounded-xl border border-blue-200/70 bg-white/80 backdrop-blur-sm px-4 text-sm font-semibold text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] hover:border-blue-300 sm:w-48"
          >
            <option value="">All Islands</option>
            {islands.map((island) => (
              <option key={island} value={island}>
                {island}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-blue-700">Center</label>
          <select
            value={activeCenterId ?? ""}
            onChange={(e) => selectCenter(e.target.value)}
            className="h-11 w-full rounded-xl border border-blue-200/70 bg-white/80 backdrop-blur-sm px-4 text-sm font-semibold text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] hover:border-blue-300 sm:w-96"
          >
            <option value="">Select a center…</option>
            {filteredCenters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

