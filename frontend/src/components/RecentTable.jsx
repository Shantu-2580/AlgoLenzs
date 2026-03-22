function timeAgo(timestamp) {
  const then = new Date(timestamp).getTime()
  const now = Date.now()
  const diff = Math.max(Math.floor((now - then) / 1000), 0)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function RecentTable({ items, page, setPage, pageSize = 10 }) {
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1)
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return (
    <section className="glass-card overflow-hidden">
      <div className="border-b border-neon-border/70 px-4 py-3">
        <h3 className="font-display text-lg text-text-main">Recent Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface/80 text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3">Algorithm</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((entry, idx) => (
              <tr key={`${entry.createdAt}-${idx}`} className="border-t border-neon-border/50 text-text-main">
                <td className="px-4 py-3 font-code text-xs">{entry.algorithm}</td>
                <td className="px-4 py-3">{entry.language}</td>
                <td className="px-4 py-3 text-text-muted">{timeAgo(entry.createdAt)}</td>
              </tr>
            ))}

            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                  No activity yet
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-neon-border/70 px-4 py-3 text-xs">
        <button
          type="button"
          className="control-btn"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="text-text-muted">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="control-btn"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </section>
  )
}
