export type Phase = 'focus' | 'break' | 'long_break';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'waiting_break' | 'waiting_focus' | 'waiting_long_break' | 'done';
export type GenreKey = 'reggae' | 'pop' | 'classical' | 'jazz' | 'bossanova';

export interface Settings {
  focusSeconds: number;
  breakSeconds: number;
  longBreakSeconds: number;
  totalCycles: number;
  pauseMusicOnPhaseEnd: boolean;
  chimeOnPhaseEnd: boolean;
}
