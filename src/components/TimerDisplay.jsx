function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const PHASE_LABELS = { focus: 'Focus', break: 'Break' }

export function TimerDisplay({ timeLeft, phase, status }) {
  const showPhaseLabel = status !== 'idle' && status !== 'done'
  const isDone = status === 'done'

  return (
    <div className="flex flex-col items-center gap-2">
      {showPhaseLabel && (
        <p className="font-sans text-sm font-medium tracking-widest uppercase text-warm-muted dark:text-warm-dark-muted">
          {PHASE_LABELS[phase]}
        </p>
      )}
      <p className="font-serif text-8xl font-medium tabular-nums text-warm-text dark:text-warm-dark-text leading-none">
        {isDone ? 'Done' : formatTime(timeLeft)}
      </p>
    </div>
  )
}
