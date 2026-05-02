import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimer } from '../hooks/useTimer'
import { DEFAULT_SETTINGS } from '../constants'

const FOCUS_DURATION = DEFAULT_SETTINGS.focusSeconds
const BREAK_DURATION = DEFAULT_SETTINGS.breakSeconds
const LONG_BREAK_DURATION = DEFAULT_SETTINGS.longBreakSeconds
const TOTAL_CYCLES = DEFAULT_SETTINGS.totalCycles

describe('useTimer', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('starts in idle state with focus phase and full focus duration', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    expect(result.current.status).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
    expect(result.current.timeLeft).toBe(FOCUS_DURATION)
  })

  it('transitions idle → running on mainAction', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    expect(result.current.status).toBe('running')
  })

  it('transitions running → paused on mainAction', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => result.current.mainAction())
    expect(result.current.status).toBe('paused')
  })

  it('transitions paused → running on mainAction', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => result.current.mainAction())
    act(() => result.current.mainAction())
    expect(result.current.status).toBe('running')
  })

  it('decrements timeLeft every second while running', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.timeLeft).toBe(FOCUS_DURATION - 3)
  })

  it('does not decrement while paused', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(2000) })
    act(() => result.current.mainAction()) // pause
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.timeLeft).toBe(FOCUS_DURATION - 2)
  })

  it('transitions running focus (cycleIndex < last) → waiting_break when timeLeft hits 0', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    expect(result.current.status).toBe('waiting_break')
    expect(result.current.timeLeft).toBe(0)
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
  })

  it('transitions waiting_break → running break on mainAction', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    act(() => result.current.mainAction()) // start break
    expect(result.current.status).toBe('running')
    expect(result.current.phase).toBe('break')
    expect(result.current.timeLeft).toBe(BREAK_DURATION)
    expect(result.current.cycleIndex).toBe(0)
  })

  it('transitions running break → waiting_focus when timeLeft hits 0', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    act(() => result.current.mainAction()) // start break
    act(() => { vi.advanceTimersByTime(BREAK_DURATION * 1000) })
    expect(result.current.status).toBe('waiting_focus')
    expect(result.current.phase).toBe('break')
  })

  it('transitions waiting_focus → running focus with incremented cycleIndex', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    act(() => result.current.mainAction()) // start break
    act(() => { vi.advanceTimersByTime(BREAK_DURATION * 1000) })
    act(() => result.current.mainAction()) // start next focus
    expect(result.current.status).toBe('running')
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(1)
    expect(result.current.timeLeft).toBe(FOCUS_DURATION)
  })

  it('final focus end → waiting_long_break, then long_break runs, then done', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction()) // start first focus
    for (let i = 0; i < TOTAL_CYCLES - 1; i++) {
      act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) }) // focus ends → waiting_break
      act(() => result.current.mainAction())                        // start break
      act(() => { vi.advanceTimersByTime(BREAK_DURATION * 1000) }) // break ends → waiting_focus
      act(() => result.current.mainAction())                        // start next focus
    }
    // Now on final focus
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    expect(result.current.status).toBe('waiting_long_break')

    act(() => result.current.mainAction())
    expect(result.current.status).toBe('running')
    expect(result.current.phase).toBe('long_break')
    expect(result.current.timeLeft).toBe(LONG_BREAK_DURATION)

    act(() => { vi.advanceTimersByTime(LONG_BREAK_DURATION * 1000) })
    expect(result.current.status).toBe('done')
    expect(result.current.cycleIndex).toBe(TOTAL_CYCLES - 1)
  })

  it('settings change mid-run resets the timer to idle/focus/cycle 0 with new durations', () => {
    const settings = { ...DEFAULT_SETTINGS }
    const { result, rerender } = renderHook(({ s }) => useTimer(s), { initialProps: { s: settings } })

    act(() => result.current.mainAction()) // running focus
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    act(() => result.current.mainAction()) // start break
    expect(result.current.phase).toBe('break')

    // user changes settings
    const newSettings = { ...settings, focusSeconds: 50 * 60, breakSeconds: 600 }
    rerender({ s: newSettings })

    expect(result.current.status).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
    expect(result.current.timeLeft).toBe(50 * 60)
  })

  it('reset returns to initial state from any status', () => {
    const { result } = renderHook(() => useTimer(DEFAULT_SETTINGS))
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(10000) })
    act(() => result.current.reset())
    expect(result.current.status).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
    expect(result.current.timeLeft).toBe(FOCUS_DURATION)
  })
})
