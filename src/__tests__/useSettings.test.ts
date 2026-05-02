import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSettings } from '../hooks/useSettings'
import { DEFAULT_SETTINGS, LS_SETTINGS_KEY } from '../constants'

describe('useSettings', () => {
  beforeEach(() => { localStorage.clear() })

  it('returns defaults when nothing stored', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.updateSettings({ ...DEFAULT_SETTINGS, focusSeconds: 50 * 60 }))
    const raw = localStorage.getItem(LS_SETTINGS_KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!).focusSeconds).toBe(50 * 60)
  })

  it('loads previously stored settings', () => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, totalCycles: 6 }))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.totalCycles).toBe(6)
  })

  it('clamps out-of-range stored values', () => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, focusSeconds: 999 * 60, totalCycles: 999 }))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.focusSeconds).toBe(120 * 60)
    expect(result.current.settings.totalCycles).toBe(12)
  })

  it('falls back to defaults on corrupt JSON', () => {
    localStorage.setItem(LS_SETTINGS_KEY, '{not json')
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  it('resetDefaults restores DEFAULT_SETTINGS', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.updateSettings({ ...DEFAULT_SETTINGS, focusSeconds: 50 * 60 }))
    act(() => result.current.resetDefaults())
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })
})
