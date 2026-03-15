export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-0 border-b-2 border-slate-200">
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={[
              "px-5 py-3 text-sm font-semibold transition-colors -mb-[2px] border-b-2",
              isActive
                ? "border-b-[#1a3c8f] text-[#1a3c8f]"
                : "border-b-transparent text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

