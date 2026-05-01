import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimer } from '../hooks/useTimer'
import { FOCUS_DURATION, BREAK_DURATION } from '../constants'

describe('useTimer', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('starts in idle state with focus phase and full focus duration', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.status).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
    expect(result.current.timeLeft).toBe(FOCUS_DURATION)
  })

  it('transitions idle → running on mainAction', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    expect(result.current.status).toBe('running')
  })

  it('transitions running → paused on mainAction', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => result.current.mainAction())
    expect(result.current.status).toBe('paused')
  })

  it('transitions paused → running on mainAction', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => result.current.mainAction())
    act(() => result.current.mainAction())
    expect(result.current.status).toBe('running')
  })

  it('decrements timeLeft every second while running', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.timeLeft).toBe(FOCUS_DURATION - 3)
  })

  it('does not decrement while paused', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(2000) })
    act(() => result.current.mainAction()) // pause
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.timeLeft).toBe(FOCUS_DURATION - 2)
  })

  it('transitions running focus (cycleIndex < 3) → waiting_break when timeLeft hits 0', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    expect(result.current.status).toBe('waiting_break')
    expect(result.current.timeLeft).toBe(0)
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
  })

  it('transitions waiting_break → running break on mainAction', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    act(() => result.current.mainAction()) // start break
    expect(result.current.status).toBe('running')
    expect(result.current.phase).toBe('break')
    expect(result.current.timeLeft).toBe(BREAK_DURATION)
    expect(result.current.cycleIndex).toBe(0)
  })

  it('transitions running break → waiting_focus when timeLeft hits 0', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    act(() => result.current.mainAction()) // start break
    act(() => { vi.advanceTimersByTime(BREAK_DURATION * 1000) })
    expect(result.current.status).toBe('waiting_focus')
    expect(result.current.phase).toBe('break')
  })

  it('transitions waiting_focus → running focus with incremented cycleIndex', () => {
    const { result } = renderHook(() => useTimer())
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

  it('transitions running focus (cycleIndex = 3) → done when timeLeft hits 0', () => {
    const { result } = renderHook(() => useTimer())
    for (let i = 0; i < 3; i++) {
      act(() => result.current.mainAction())
      act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
      act(() => result.current.mainAction())
      act(() => { vi.advanceTimersByTime(BREAK_DURATION * 1000) })
      act(() => result.current.mainAction())
    }
    act(() => { vi.advanceTimersByTime(FOCUS_DURATION * 1000) })
    expect(result.current.status).toBe('done')
    expect(result.current.cycleIndex).toBe(3)
  })

  it('reset returns to initial state from any status', () => {
    const { result } = renderHook(() => useTimer())
    act(() => result.current.mainAction())
    act(() => { vi.advanceTimersByTime(10000) })
    act(() => result.current.reset())
    expect(result.current.status).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.cycleIndex).toBe(0)
    expect(result.current.timeLeft).toBe(FOCUS_DURATION)
  })
})
