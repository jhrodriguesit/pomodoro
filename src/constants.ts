import type { GenreKey, Settings } from './types'

export const GENRES = {
  reggae:    { label: 'Reggae',     videoId: 'zODPkMZ2pvw' },
  pop:       { label: 'Pop',        videoId: 'KJyskZhXJHA' },
  classical: { label: 'Classical',  videoId: 'RiG_fsPmNu4' },
  jazz:      { label: 'Jazz',       videoId: 'pyNiTUvNxxE' },
  bossanova: { label: 'Bossa Nova', videoId: 'LTyUGpq-1MY' },
} as const

export const GENRE_ORDER = ['reggae', 'pop', 'classical', 'jazz', 'bossanova'] as const satisfies GenreKey[]

export const DEFAULT_SETTINGS: Settings = {
  focusSeconds: 25 * 60,
  breakSeconds: 5 * 60,
  longBreakSeconds: 15 * 60,
  totalCycles: 4,
  pauseMusicOnPhaseEnd: true,
  chimeOnPhaseEnd: true,
}

export const LS_SETTINGS_KEY = 'pomodoro-settings'

export const FOCUS_MIN_MIN = 1
export const FOCUS_MIN_MAX = 120
export const BREAK_MIN_MIN = 1
export const BREAK_MIN_MAX = 60
export const LONG_BREAK_MIN_MIN = 1
export const LONG_BREAK_MIN_MAX = 60
export const CYCLES_MIN = 1
export const CYCLES_MAX = 12
