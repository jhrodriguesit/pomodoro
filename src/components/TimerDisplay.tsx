import type { Phase, TimerStatus } from '../types'

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const PHASE_LABELS: Record<Phase, string> = { focus: 'Focus', break: 'Break', long_break: 'Long break' }

interface TimerDisplayProps {
  timeLeft: number
  phase: Phase
  status: TimerStatus
}

export function TimerDisplay({ timeLeft, phase, status }: TimerDisplayProps) {
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
