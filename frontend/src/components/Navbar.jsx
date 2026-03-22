const githubIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 .5a12 12 0 0 0-3.79 23.39c.6.12.82-.26.82-.57v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.33-1.77-1.33-1.77-1.08-.75.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.05 1.81 2.77 1.29 3.45.98.11-.77.41-1.29.74-1.59-2.67-.3-5.47-1.34-5.47-5.97 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.53.12-3.2 0 0 1.01-.32 3.3 1.23a11.53 11.53 0 0 1 6 0c2.29-1.55 3.3-1.22 3.3-1.22.65 1.67.24 2.9.12 3.2.76.84 1.23 1.92 1.23 3.23 0 4.64-2.8 5.66-5.48 5.96.42.37.8 1.09.8 2.2v3.26c0 .31.22.7.83.58A12 12 0 0 0 12 .5Z"
    />
  </svg>
)

export default function Navbar({ admin = false, onToggleEditor, editorVisible = true }) {
  return (
    <header className="border-b border-neon-border/80 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-transparent bg-gradient-to-r from-neon-mint via-neon-purple to-neon-mint bg-clip-text animate-logo-shift">
            {admin ? 'AlgoLens Admin' : 'AlgoLens'}
          </h1>
          <p className="text-sm text-text-muted">
            {admin ? 'Usage insights and platform telemetry' : 'Visualize your DSA code instantly'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onToggleEditor ? (
            <button
              type="button"
              onClick={onToggleEditor}
              className="rounded-md border border-neon-border px-3 py-1.5 text-xs font-medium text-text-main transition hover:border-neon-mint sm:hidden"
            >
              {editorVisible ? 'Hide Editor' : 'Show Editor'}
            </button>
          ) : null}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-neon-border px-3 py-2 text-sm text-text-main transition hover:border-neon-mint hover:text-neon-mint"
          >
            {githubIcon}
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}
