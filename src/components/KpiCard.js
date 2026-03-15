const variantToIcon = {
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

const variantToValue = {
  blue: "text-blue-900",
  yellow: "text-amber-700",
  green: "text-emerald-700",
  red: "text-red-600",
  purple: "text-purple-700",
};

export default function KpiCard({ title, value, subtitle, icon, variant = "blue" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </div>
          <div
            className={[
              "mt-2 text-3xl font-extrabold tracking-tight font-mono",
              variantToValue[variant] || variantToValue.blue,
            ].join(" ")}
          >
            {value}
          </div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
        </div>

        {icon ? (
          <div
            className={[
              "inline-flex h-11 w-11 items-center justify-center rounded-xl",
              variantToIcon[variant] || variantToIcon.blue,
            ].join(" ")}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

