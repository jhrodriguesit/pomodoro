import type { GenreKey } from './types'

export const GENRES = {
  reggae:    { label: 'Reggae',     videoId: 'zODPkMZ2pvw' },
  pop:       { label: 'Pop',        videoId: 'KJyskZhXJHA' },
  classical: { label: 'Classical',  videoId: 'RiG_fsPmNu4' },
  jazz:      { label: 'Jazz',       videoId: 'pyNiTUvNxxE' },
  bossanova: { label: 'Bossa Nova', videoId: 'LTyUGpq-1MY' },
} as const

export const GENRE_ORDER = ['reggae', 'pop', 'classical', 'jazz', 'bossanova'] as const satisfies GenreKey[]

export const FOCUS_DURATION = 25 * 60   // 1500 seconds
export const BREAK_DURATION = 5 * 60    // 300 seconds
export const TOTAL_CYCLES = 4
