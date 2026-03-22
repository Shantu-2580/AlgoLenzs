export default function AlgorithmBadge({ algorithm, category, confidence }) {
  if (!algorithm) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-neon-mint/60 bg-neon-mint/10 px-3 py-1 font-code text-xs tracking-wide text-neon-mint shadow-neon">
        {algorithm.replaceAll('_', ' ').toUpperCase()}
      </span>
      <span className="rounded-full border border-neon-purple/70 bg-neon-purple/10 px-3 py-1 text-xs text-neon-purple">
        {category}
      </span>
      <span className="rounded-full border border-neon-border bg-surface/80 px-3 py-1 text-xs text-text-main">
        {Math.round((confidence ?? 0) * 100)}% confidence
      </span>
    </div>
  )
}
