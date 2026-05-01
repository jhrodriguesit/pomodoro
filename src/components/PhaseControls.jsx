import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

const MAIN_BUTTON_CONFIG = {
  idle:          { label: 'Start Focus',     ariaLabel: 'Start Focus',     disabled: false },
  running:       { label: null,              ariaLabel: 'Pause',           disabled: false },
  paused:        { label: null,              ariaLabel: 'Resume',          disabled: false },
  waiting_break: { label: 'Start Break',     ariaLabel: 'Start Break',     disabled: false },
  waiting_focus: { label: 'Start Focus',     ariaLabel: 'Start Focus',     disabled: false },
  done:          { label: null,              ariaLabel: 'Session complete', disabled: true  },
}

function MainButtonContent({ status }) {
  if (status === 'running') return <Pause size={20} />
  if (status === 'paused')  return <Play size={20} />
  if (status === 'done')    return <span className="text-sm">—</span>
  if (status === 'idle') {
    return (
      <span className="flex items-center gap-2">
        <Play size={16} />
        {MAIN_BUTTON_CONFIG.idle.label}
      </span>
    )
  }
  return <span>{MAIN_BUTTON_CONFIG[status].label}</span>
}

export function PhaseControls({ status, soundOn, onMainAction, onSoundToggle, onReset }) {
  const config = MAIN_BUTTON_CONFIG[status]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onSoundToggle}
          aria-label={soundOn ? 'Mute music' : 'Unmute music'}
          className="p-2 rounded-full text-warm-muted dark:text-warm-dark-muted hover:text-warm-accent dark:hover:text-warm-accent transition-colors"
        >
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button
          onClick={onMainAction}
          disabled={config.disabled}
          aria-label={config.ariaLabel}
          className={[
            'min-w-[9rem] h-11 px-6 rounded-full font-sans font-medium text-sm transition-colors',
            config.disabled
              ? 'bg-warm-border dark:bg-warm-dark-border text-warm-muted dark:text-warm-dark-muted cursor-not-allowed'
              : 'bg-warm-accent text-white hover:bg-warm-text dark:hover:bg-warm-dark-text',
          ].join(' ')}
        >
          <MainButtonContent status={status} />
        </button>
      </div>

      {status !== 'idle' && (
        <button
          onClick={onReset}
          aria-label="Reset session"
          className="font-sans text-xs text-warm-muted dark:text-warm-dark-muted hover:text-warm-accent dark:hover:text-warm-accent transition-colors underline-offset-2 hover:underline"
        >
          Reset
        </button>
      )}
    </div>
  )
}
