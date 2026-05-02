import type { Phase, TimerStatus } from '../types'

function getDotState(index: number, cycleIndex: number, phase: Phase, status: TimerStatus): 'upcoming' | 'current' | 'completed' {
  if (status === 'idle') return 'upcoming'
  if (status === 'done') return 'completed'
  if (index < cycleIndex) return 'completed'
  if (index === cycleIndex) return phase === 'focus' ? 'current' : 'completed'
  return 'upcoming'
}

const dotStyles: Record<'upcoming' | 'current' | 'completed', string> = {
  upcoming:  'w-2 h-2 rounded-full bg-warm-border dark:bg-warm-dark-border',
  current:   'w-2 h-2 rounded-full bg-warm-accent',
  completed: 'w-2 h-2 rounded-full bg-warm-muted dark:bg-warm-dark-muted',
}

interface CycleDotsProps {
  cycleIndex: number
  phase: Phase
  status: TimerStatus
}

export function CycleDots({ cycleIndex, phase, status }: CycleDotsProps) {
  return (
    <div className="flex items-center gap-3">
      {[0, 1, 2, 3].map(i => {
        const state = getDotState(i, cycleIndex, phase, status)
        return (
          <span
            key={i}
            role="presentation"
            data-state={state}
            className={dotStyles[state]}
          />
        )
      })}
    </div>
  )
}
