
const variantColors = {
  blue: {
    bg: "from-blue-50 to-blue-100/50",
    border: "border-blue-200/60",
    glow: "shadow-blue-100/50",
    icon: "from-blue-600 to-blue-500",
    iconBg: "from-blue-100 to-blue-50 border-blue-200",
    text: "text-blue-900",
    label: "text-blue-600",
  },
  yellow: {
    bg: "from-yellow-50 to-amber-100/50",
    border: "border-yellow-200/60",
    glow: "shadow-yellow-100/50",
    icon: "from-yellow-500 to-amber-500",
    iconBg: "from-yellow-100 to-yellow-50 border-yellow-200",
    text: "text-yellow-900",
    label: "text-yellow-600",
  },
  green: {
    bg: "from-emerald-50 to-emerald-100/50",
    border: "border-emerald-200/60",
    glow: "shadow-emerald-100/50",
    icon: "from-emerald-600 to-emerald-500",
    iconBg: "from-emerald-100 to-emerald-50 border-emerald-200",
    text: "text-emerald-900",
    label: "text-emerald-600",
  },
  red: {
    bg: "from-red-50 to-red-100/50",
    border: "border-red-200/60",
    glow: "shadow-red-100/50",
    icon: "from-red-600 to-red-500",
    iconBg: "from-red-100 to-red-50 border-red-200",
    text: "text-red-900",
    label: "text-red-600",
  },
};

function TrendArrow({ percentChange, status }) {
  const isPositive = status === "success";
  const color = isPositive ? "text-emerald-600" : "text-red-500";
  const bgColor = isPositive
    ? "bg-emerald-50 border-emerald-200/50"
    : "bg-red-50 border-red-200/50";
  const arrow = isPositive ? "▲" : "▼";
  const display = Math.abs(percentChange);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${color} ${bgColor}`}
    >
      <span className="text-[9px]">{arrow}</span>
      {display}%
    </span>
  );
}


export default function AnalyticsCard({
  title,
  value,
  previous,
  icon,
  variant = "blue",
  status,
  percentChange = 0,
}) {
  const statusVariant =
    status === "success" ? "green" : status === "danger" ? "red" : variant;
  const c = variantColors[statusVariant] || variantColors.blue;

  return (
    <div
      className={`group relative rounded-2xl border bg-gradient-to-br ${c.bg} ${c.border} p-5 shadow-md ${c.glow} backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
    >
      {/* Decorative glow dot */}
      <div
        className={`pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.icon} opacity-[0.07] blur-2xl group-hover:opacity-[0.12] transition-opacity duration-500`}
      />

      {/* Header row */}
      <div className="relative flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-widest ${c.label}`}>
              {title}
            </span>
            <TrendArrow percentChange={percentChange} status={status} />
          </div>

          {/* Value */}
          <div className={`text-2xl font-extrabold tracking-tight font-mono ${c.text}`}>
            {typeof value === "string" && value.startsWith("₱") ? (
              <span className="inline-flex items-baseline gap-1">
                <span className="text-base opacity-70">₱</span>
                <span>{value.slice(1).trim()}</span>
              </span>
            ) : (
              value
            )}
          </div>
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.iconBg} border shadow-sm flex-shrink-0`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Previous comparison */}
      {previous && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
          <span className="text-[10px] font-medium text-slate-400">Previous</span>
          <span className="text-xs font-bold text-slate-600">{previous}</span>
        </div>
      )}
    </div>
  );
}
