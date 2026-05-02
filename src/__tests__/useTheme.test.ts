import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '../hooks/useTheme'
import { LS_SETTINGS_KEY } from '../constants'

function getStoredTheme(): string | undefined {
  const raw = localStorage.getItem(LS_SETTINGS_KEY)
  return raw ? JSON.parse(raw)?.theme : undefined
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to light mode when no localStorage entry exists', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('reads dark preference from tomo-settings on init', () => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify({ theme: 'dark' }))
    const { result } = renderHook(() => useTheme())
    expect(result.current.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme switches to dark and adds class to html element', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(getStoredTheme()).toBe('dark')
  })

  it('toggleTheme switches back to light and removes dark class', () => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify({ theme: 'dark' }))
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(getStoredTheme()).toBe('light')
  })
})
