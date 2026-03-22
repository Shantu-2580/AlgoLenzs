const LANGUAGES = ['auto', 'python', 'java', 'cpp', 'javascript']

export default function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  activeLine,
  onVisualize,
  isLoading,
  error,
}) {
  const lines = Math.max(code.split('\n').length, 8)
  const charCount = code.length

  return (
    <section className="glass-card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg text-text-main">Code Editor</h2>
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="rounded-md border border-neon-border bg-panel px-3 py-1.5 font-code text-xs text-text-main outline-none transition focus:border-neon-mint"
        >
          {LANGUAGES.map((item) => (
            <option key={item} value={item}>
              {item === 'auto' ? 'Auto Detect' : item.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="group relative min-h-[300px] flex-1 overflow-hidden rounded-lg border border-neon-border bg-editor transition focus-within:border-neon-mint focus-within:shadow-neon">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 border-r border-neon-border/80 bg-surface/80" />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 overflow-hidden py-3">
          {Array.from({ length: lines }).map((_, idx) => {
            const lineNo = idx + 1
            const isActive = lineNo === activeLine
            return (
              <div
                key={lineNo}
                className={`h-6 text-center font-code text-xs leading-6 ${isActive ? 'text-neon-mint' : 'text-text-muted'}`}
              >
                {lineNo}
              </div>
            )
          })}
        </div>

        {activeLine ? (
          <div
            className="pointer-events-none absolute left-12 right-0 bg-neon-mint/10"
            style={{ top: `${(activeLine - 1) * 24 + 12}px`, height: '24px' }}
          />
        ) : null}

        <textarea
          value={code}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste your DSA code here..."
          spellCheck={false}
          className="h-full w-full resize-none bg-transparent py-3 pl-14 pr-3 font-code text-sm leading-6 text-text-main outline-none"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onVisualize}
          disabled={isLoading}
          className="w-full rounded-md bg-neon-mint px-4 py-2 font-display text-base font-semibold text-[#03120f] transition hover:animate-pulse disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03120f]/25 border-t-[#03120f]" />
              Analyzing...
            </span>
          ) : (
            '-> Visualize'
          )}
        </button>

        <span className="min-w-max text-xs text-text-muted">{charCount} chars</span>
      </div>

      {error ? <p className="mt-2 text-sm text-danger">Algorithm not recognized</p> : null}
    </section>
  )
}
