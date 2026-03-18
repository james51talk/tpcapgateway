const variantToIcon = {
  blue: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border border-blue-200",
  yellow: "bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200",
  green: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200",
  red: "bg-gradient-to-br from-red-100 to-red-50 text-red-700 border border-red-200",
  purple: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 border border-purple-200",
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

export default function KpiCard({ title, value, subtitle, icon, variant = "auto", status = null, previous = null }) {
  const statusToVariant = {
    success: "green",
    danger: "red",
    warning: "yellow",
    info: "blue",
  };
  
  const resolvedVariant = status ? statusToVariant[status] : inferVariant(value, variant);

  return (
    <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-yellow-50/30 p-6 shadow-md backdrop-blur-sm hover:shadow-lg hover:border-blue-300/80 transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
            {title}
          </div>
          
          {previous ? (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-slate-500 font-medium">
                Previous: <span className="text-slate-700 font-semibold">{previous}</span>
              </div>
              <div
                className={[
                  "font-extrabold tracking-tight font-mono",
                  variantToValue[resolvedVariant] || variantToValue.blue,
                ].join(" ")}
              >
                <span className="inline-flex items-baseline gap-2">
                  {icon ? (
                    <span
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg",
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
            </div>
          ) : (
            <div
              className={[
                "mt-3 font-extrabold tracking-tight font-mono",
                variantToValue[resolvedVariant] || variantToValue.blue,
              ].join(" ")}
            >
              <span className="inline-flex items-baseline gap-2">
                {icon ? (
                  <span
                    className={[
                      "inline-flex h-8 w-8 items-center justify-center rounded-lg",
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
          )}
          {subtitle ? <div className="mt-2 text-xs font-medium text-slate-500">{subtitle}</div> : null}
        </div>


      </div>
    </div>
  );
}

