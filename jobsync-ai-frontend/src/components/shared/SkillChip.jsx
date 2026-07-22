export default function SkillChip({ label, variant = "neutral" }) {
  const styles = {
    matched: "bg-green-50 text-green-700 border-green-200",
    missing: "bg-gray-50 text-gray-500 border-gray-200 border-dashed",
    neutral: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}
