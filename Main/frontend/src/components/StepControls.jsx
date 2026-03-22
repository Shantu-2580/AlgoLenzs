const SPEED_OPTIONS = [1, 2, 4]

export default function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onReset,
  onPrev,
  onTogglePlay,
  onNext,
  onSpeedChange,
}) {
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0

  return (
    <div className="glass-card mt-3 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button onClick={onReset} className="control-btn" type="button">
          |&lt; Reset
        </button>
        <button onClick={onPrev} className="control-btn" type="button">
          &lt; Prev
        </button>
        <button onClick={onTogglePlay} className="control-btn border-neon-mint text-neon-mint" type="button">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={onNext} className="control-btn" type="button">
          Next &gt;
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Speed</label>
          <input
            type="range"
            min={0}
            max={SPEED_OPTIONS.length - 1}
            step={1}
            value={SPEED_OPTIONS.indexOf(speed)}
            onChange={(event) => onSpeedChange(SPEED_OPTIONS[Number(event.target.value)])}
            className="accent-neon-mint"
          />
          <span className="font-code text-xs text-text-main">{speed}x</span>
        </div>

        <span className="font-code text-xs text-text-main">
          Step {Math.min(currentStep + 1, Math.max(totalSteps, 1))} of {Math.max(totalSteps, 1)}
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neon-border">
        <div className="h-full rounded-full bg-gradient-to-r from-neon-mint to-neon-purple" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
