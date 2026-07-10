export function BreakdownList({
  title,
  data,
  labelMap,
  limit,
}: {
  title: string;
  data: [string, number][];
  labelMap?: Record<string, string>;
  limit?: number;
}) {
  const rows = limit ? data.slice(0, limit) : data;
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-forest-dark">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal-soft">データがありません。</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map(([key, count]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="text-charcoal-soft">{labelMap?.[key] ?? key}</span>
              <span className="font-semibold text-forest-dark">{count}件</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
