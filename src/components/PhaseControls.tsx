import { Volume2, VolumeX } from "lucide-react";
import type { TimerStatus } from "../types";

interface PhaseControlsProps {
  status: TimerStatus;
  musicPlaying: boolean;
  showGenrePrompt: boolean;
  onMainAction: () => void;
  onSoundToggle: () => void;
  onReset: () => void;
}

const MAIN_BUTTON_CONFIG = {
  idle: { label: "Start Focus", ariaLabel: "Start Focus", disabled: false },
  running: { label: "Pause", ariaLabel: "Pause", disabled: false },
  paused: { label: "Resume", ariaLabel: "Resume", disabled: false },
  waiting_break: {
    label: "Start Break",
    ariaLabel: "Start Break",
    disabled: false,
  },
  waiting_focus: {
    label: "Start Focus",
    ariaLabel: "Start Focus",
    disabled: false,
  },
  done: {
    label: "Session complete",
    ariaLabel: "Session complete",
    disabled: true,
  },
} as const satisfies Record<
  TimerStatus,
  { label: string | null; ariaLabel: string; disabled: boolean }
>;

export function PhaseControls({
  status,
  musicPlaying,
  showGenrePrompt,
  onMainAction,
  onSoundToggle,
  onReset,
}: PhaseControlsProps) {
  const config = MAIN_BUTTON_CONFIG[status];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={onSoundToggle}
            aria-label={musicPlaying ? "Pause music" : "Play music"}
            className={[
              "p-2 rounded-full transition-colors",
              musicPlaying
                ? "bg-warm-accent text-white"
                : "border border-warm-accent text-warm-accent dark:border-warm-accent dark:text-warm-accent",
            ].join(" ")}
          >
            {musicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {showGenrePrompt && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-warm-text dark:bg-warm-dark-text text-warm-bg dark:text-warm-dark-bg text-xs whitespace-nowrap pointer-events-none">
              Pick a genre to play music
            </div>
          )}
        </div>

        <button
          onClick={onMainAction}
          disabled={config.disabled}
          aria-label={config.ariaLabel}
          className={[
            "h-11 px-6 rounded-full font-sans font-medium text-sm transition-colors",
            config.disabled
              ? "bg-warm-border dark:bg-warm-dark-border text-warm-muted dark:text-warm-dark-muted cursor-not-allowed"
              : "bg-warm-accent text-white hover:bg-warm-text dark:hover:bg-warm-dark-text",
          ].join(" ")}
        >
          <span>{MAIN_BUTTON_CONFIG[status].label}</span>
        </button>
      </div>

      {status !== "idle" && (
        <button
          onClick={onReset}
          aria-label="Reset session"
          className="font-sans text-xs text-warm-muted dark:text-warm-dark-muted hover:text-warm-accent dark:hover:text-warm-accent transition-colors underline-offset-2 hover:underline"
        >
          Reset
        </button>
      )}
    </div>
  );
}
