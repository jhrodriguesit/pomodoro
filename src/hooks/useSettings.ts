import { useCallback, useEffect, useState } from 'react'
import type { Settings } from '../types'
import {
  DEFAULT_SETTINGS,
  LS_SETTINGS_KEY,
  FOCUS_MIN_MIN, FOCUS_MIN_MAX,
  BREAK_MIN_MIN, BREAK_MIN_MAX,
  LONG_BREAK_MIN_MIN, LONG_BREAK_MIN_MAX,
  CYCLES_MIN, CYCLES_MAX,
} from '../constants'

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

function sanitize(raw: unknown): Settings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS
  const r = raw as Partial<Settings>
  const focusMin = clamp((r.focusSeconds ?? DEFAULT_SETTINGS.focusSeconds) / 60, FOCUS_MIN_MIN, FOCUS_MIN_MAX)
  const breakMin = clamp((r.breakSeconds ?? DEFAULT_SETTINGS.breakSeconds) / 60, BREAK_MIN_MIN, BREAK_MIN_MAX)
  const longMin  = clamp((r.longBreakSeconds ?? DEFAULT_SETTINGS.longBreakSeconds) / 60, LONG_BREAK_MIN_MIN, LONG_BREAK_MIN_MAX)
  const cycles   = clamp(r.totalCycles ?? DEFAULT_SETTINGS.totalCycles, CYCLES_MIN, CYCLES_MAX)
  return {
    focusSeconds: focusMin * 60,
    breakSeconds: breakMin * 60,
    longBreakSeconds: longMin * 60,
    totalCycles: cycles,
    pauseMusicOnPhaseEnd: typeof r.pauseMusicOnPhaseEnd === 'boolean' ? r.pauseMusicOnPhaseEnd : DEFAULT_SETTINGS.pauseMusicOnPhaseEnd,
    chimeOnPhaseEnd: typeof r.chimeOnPhaseEnd === 'boolean' ? r.chimeOnPhaseEnd : DEFAULT_SETTINGS.chimeOnPhaseEnd,
  }
}

function loadInitial(): Settings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(LS_SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return sanitize(JSON.parse(raw))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export interface UseSettingsReturn {
  settings: Settings;
  updateSettings: (next: Settings) => void;
  resetDefaults: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings>(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      // Storage unavailable — silent fallback
    }
  }, [settings])

  const updateSettings = useCallback((next: Settings) => {
    setSettings(sanitize(next))
  }, [])

  const resetDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  return { settings, updateSettings, resetDefaults }
}
