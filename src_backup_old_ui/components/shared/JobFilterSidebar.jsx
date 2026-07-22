const SECTIONS = [
  { key: "time", label: "Time", options: ["Today", "This week", "This month"] },
  { key: "level", label: "Experience Level", options: ["Trainee level", "Junior level", "Middle level", "Senior level"] },
  { key: "jobType", label: "Job Type", options: ["Full time", "Part time", "Freelance", "Internship"] },
  { key: "workMode", label: "Job Location", options: ["On site", "Remote"] },
];

export default function JobFilterSidebar({ jobs, filters, onChange, onClearAll }) {
  const countFor = (sectionKey, option) =>
    jobs.filter((j) => {
      if (sectionKey === "time") return true; // wire up real date logic when available
      return j[sectionKey] === option;
    }).length;

  const toggle = (sectionKey, option) => {
    const current = filters[sectionKey] || [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onChange({ ...filters, [sectionKey]: next });
  };

  return (
    <aside className="w-64 shrink-0 bg-brand-surface rounded-xl border border-brand-border p-5 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-ink">Job Filter</h3>
        <button onClick={onClearAll} className="font-mono text-xs text-brand-blue hover:underline">
          Clear all
        </button>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.key} className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm text-ink">{section.label}</h4>
            <button
              onClick={() => onChange({ ...filters, [section.key]: [] })}
              className="font-mono text-[10px] text-muted hover:text-brand-blue"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {section.options.map((opt) => (
              <label key={opt} className="flex items-center justify-between text-sm cursor-pointer">
                <span className="flex items-center gap-2 text-ink">
                  <input
                    type="checkbox"
                    checked={(filters[section.key] || []).includes(opt)}
                    onChange={() => toggle(section.key, opt)}
                    className="accent-brand-blue w-4 h-4 rounded"
                  />
                  {opt}
                </span>
                <span className="font-mono text-xs text-muted">{countFor(section.key, opt)} jobs</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}