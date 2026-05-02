import { useState, useEffect } from 'react'
import { LS_SETTINGS_KEY } from '../constants'

function readTheme(): boolean {
  try {
    const raw = localStorage.getItem(LS_SETTINGS_KEY)
    if (!raw) return false
    return JSON.parse(raw)?.theme === 'dark'
  } catch {
    return false
  }
}

function writeTheme(isDark: boolean): void {
  try {
    const raw = localStorage.getItem(LS_SETTINGS_KEY)
    const existing = raw ? JSON.parse(raw) : {}
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify({ ...existing, theme: isDark ? 'dark' : 'light' }))
  } catch {
    // Storage unavailable — silent fallback
  }
}

export function useTheme(): { isDark: boolean; toggleTheme: () => void } {
  const [isDark, setIsDark] = useState(() => readTheme())

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    writeTheme(isDark)
  }, [isDark])

  return { isDark, toggleTheme: () => setIsDark(d => !d) }
}
