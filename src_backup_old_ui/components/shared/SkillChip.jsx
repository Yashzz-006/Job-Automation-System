import { FiCheck, FiMinus } from "react-icons/fi";

export default function SkillChip({ label, variant = "neutral" }) {
  const styles = {
    matched: "bg-brand-blue/10 text-brand-blue border-brand-blue/25",
    missing: "bg-brand-bg text-muted border-brand-border border-dashed",
    neutral: "bg-brand-purple/10 text-brand-purple border-brand-purple/25",
  };

  const icons = {
    matched: FiCheck,
    missing: FiMinus,
    neutral: null,
  };

  const Icon = icons[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium font-mono border ${styles[variant]}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {label}
    </span>
  );
}