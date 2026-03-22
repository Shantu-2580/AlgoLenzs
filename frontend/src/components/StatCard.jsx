export default function StatCard({ label, value, loading = false }) {
  return (
    <article className="glass-card p-4">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      {loading ? (
        <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-neon-border" />
      ) : (
        <p className="mt-3 font-display text-2xl text-text-main">{value}</p>
      )}
    </article>
  )
}
