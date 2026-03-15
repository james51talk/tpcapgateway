export default function Badge({ variant = "blue", children, className = "" }) {
  const variants = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-zinc-100 text-zinc-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant] || variants.blue,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

