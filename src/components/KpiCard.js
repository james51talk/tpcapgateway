function toneFromTitle(title) {
  const t = (title || "").toLowerCase();
  if (t.includes("revenue")) return "emerald";
  if (t.includes("share")) return "blue";
  if (t.includes("attrition")) return "rose";
  if (t.includes("onlist")) return "amber";
  return "zinc";
}

const toneClasses = {
  emerald: "from-emerald-400 to-emerald-600",
  blue: "from-blue-400 to-blue-600",
  rose: "from-rose-400 to-rose-600",
  amber: "from-amber-300 to-amber-500",
  zinc: "from-zinc-300 to-zinc-500",
};

export default function KpiCard({ title, value, subtitle, tone }) {
  const usedTone = tone || toneFromTitle(title);
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 transition-shadow hover:shadow-md">
      <div
        className={[
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          toneClasses[usedTone] || toneClasses.zinc,
        ].join(" ")}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold tracking-wide text-zinc-500">{title}</div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">{value}</div>
        </div>
      </div>
      {subtitle ? <div className="mt-2 text-xs text-zinc-500">{subtitle}</div> : null}
    </div>
  );
}

