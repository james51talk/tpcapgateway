"use client";

import { useAuth } from "@/components/AuthProvider";
import { BuildingIcon } from "@/components/Icons";

export default function CenterSelectorBar({ className = "" }) {
  const { session, db, activeCenterId, selectCenter } = useAuth();

  if (session?.role !== "admin") return null;

  return (
    <div
      className={[
        "flex flex-col gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-yellow-900">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200">
          <BuildingIcon className="h-4 w-4" />
        </span>
        Viewing center
      </div>

      <select
        value={activeCenterId ?? ""}
        onChange={(e) => selectCenter(e.target.value)}
        className="h-10 w-full rounded-xl border border-yellow-200 bg-yellow-50 px-3 text-sm font-semibold text-yellow-900 outline-none focus:border-blue-600 sm:w-96"
      >
        <option value="">Select a center…</option>
        {(db?.centers ?? []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

