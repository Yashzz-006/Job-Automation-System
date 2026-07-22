export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-blue flex items-center justify-center text-lg">
          <Icon />
        </div>
      )}
      <div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
