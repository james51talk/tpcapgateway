export default function Badge({ variant = "blue", children, className = "" }) {
  const variants = {
    blue: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200/50",
    yellow: "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200/50",
    green: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200/50",
    red: "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200/50",
    gray: "bg-gradient-to-r from-zinc-100 to-zinc-50 text-zinc-800 border border-zinc-200/50",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide",
        variants[variant] || variants.blue,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
