export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs font-medium text-charcoal-soft">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold text-forest-dark">{value}</p>
      {sub && <p className="mt-1 text-xs text-charcoal-soft">{sub}</p>}
    </div>
  );
}
