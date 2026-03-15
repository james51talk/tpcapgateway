const variantToIcon = {
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

const variantToValue = {
  blue: "text-blue-900",
  yellow: "text-yellow-700",
  green: "text-emerald-700",
  red: "text-red-600",
  purple: "text-purple-700",
};

function inferVariant(value, explicitVariant) {
  if (explicitVariant && explicitVariant !== "auto") return explicitVariant;

  const str = String(value);
  const hasNumber = /\d/.test(str);
  const isNegative = /-/g.test(str);
  const isPositive = /\+/g.test(str);

  if (!hasNumber) return "blue";
  if (isNegative) return "red";
  if (isPositive) return "green";
  return "blue";
}

export default function KpiCard({ title, value, subtitle, icon, variant = "auto" }) {
  const resolvedVariant = inferVariant(value, variant);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </div>
          <div
            className={[
              "mt-2 font-extrabold tracking-tight font-mono",
              variantToValue[resolvedVariant] || variantToValue.blue,
            ].join(" ")}
          >
            <span className="inline-flex items-baseline gap-2">
              {icon ? (
                <span
                  className={[
                    "inline-flex h-7 w-7 items-center justify-center rounded-lg",
                    variantToIcon[resolvedVariant] || variantToIcon.blue,
                  ].join(" ")}
                >
                  {icon}
                </span>
              ) : null}

              {typeof value === "string" && value.startsWith("₱") ? (
                <span className="inline-flex items-baseline gap-1">
                  <span className="text-lg">₱</span>
                  <span className="text-2xl">{value.slice(1).trim()}</span>
                </span>
              ) : (
                <span className="text-2xl">{value}</span>
              )}
            </span>
          </div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
        </div>


      </div>
    </div>
  );
}

