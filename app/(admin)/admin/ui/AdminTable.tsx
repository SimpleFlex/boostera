export default function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
      <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-white/50">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children ?? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-10 text-center text-sm text-white/50"
              >
                No data yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
