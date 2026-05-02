import { useReducer, useEffect } from 'react'
import type { Phase, TimerStatus, Settings } from '../types'
import { formatTime } from '../components/TimerDisplay'

interface TimerState {
  phase: Phase;
  cycleIndex: number;
  timeLeft: number;
  status: TimerStatus;
}

type TimerAction =
  | { type: 'MAIN_ACTION'; settings: Settings }
  | { type: 'TICK'; settings: Settings }
  | { type: 'RESET'; settings: Settings };

export type UseTimerReturn = {
  phase: Phase;
  cycleIndex: number;
  timeLeft: number;
  status: TimerStatus;
  mainAction: () => void;
  reset: () => void;
};

function makeInitialState(settings: Settings): TimerState {
  return {
    phase: 'focus',
    cycleIndex: 0,
    timeLeft: settings.focusSeconds,
    status: 'idle',
  }
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'MAIN_ACTION':
      return handleMainAction(state, action.settings)
    case 'TICK':
      return handleTick(state, action.settings)
    case 'RESET':
      return makeInitialState(action.settings)
    default:
      return state
  }
}

function handleMainAction(state: TimerState, settings: Settings): TimerState {
  switch (state.status) {
    case 'idle':
      return { ...state, status: 'running' }
    case 'running':
      return { ...state, status: 'paused' }
    case 'paused':
      return { ...state, status: 'running' }
    case 'waiting_break':
      return { ...state, status: 'running', phase: 'break', timeLeft: settings.breakSeconds }
    case 'waiting_focus':
      return { ...state, status: 'running', phase: 'focus', cycleIndex: state.cycleIndex + 1, timeLeft: settings.focusSeconds }
    case 'waiting_long_break':
      return { ...state, status: 'running', phase: 'long_break', timeLeft: settings.longBreakSeconds }
    default:
      return state
  }
}

function handleTick(state: TimerState, settings: Settings): TimerState {
  if (state.status !== 'running') return state
  if (state.timeLeft > 1) return { ...state, timeLeft: state.timeLeft - 1 }
  if (state.phase === 'focus') {
    if (state.cycleIndex >= settings.totalCycles - 1) {
      return { ...state, timeLeft: 0, status: 'waiting_long_break' }
    }
    return { ...state, timeLeft: 0, status: 'waiting_break' }
  }
  if (state.phase === 'long_break') {
    return { ...state, timeLeft: 0, status: 'done' }
  }
  return { ...state, timeLeft: 0, status: 'waiting_focus' }
}

export function useTimer(settings: Settings): UseTimerReturn {
  const [state, dispatch] = useReducer(timerReducer, settings, makeInitialState)

  useEffect(() => {
    dispatch({ type: 'RESET', settings })
  }, [settings])

  useEffect(() => {
    if (state.status !== 'running') return
    const id = setInterval(() => dispatch({ type: 'TICK', settings }), 1000)
    return () => clearInterval(id)
  }, [state.status, settings])

  useEffect(() => {
    const { status, phase, timeLeft } = state
    let title: string
    if (status === 'running') {
      const label = phase === 'focus' ? 'Focus' : phase === 'long_break' ? 'Long break' : 'Break'
      title = `${formatTime(timeLeft)} · ${label} — Tomo`
    } else if (status === 'waiting_break') {
      title = '⏸ Break ready — Tomo'
    } else if (status === 'waiting_focus') {
      title = '⏸ Focus ready — Tomo'
    } else if (status === 'waiting_long_break') {
      title = '⏸ Long break ready — Tomo'
    } else if (status === 'done') {
      title = '✓ Done — Tomo'
    } else {
      title = 'Tomo'
    }
    document.title = title
    return () => { document.title = 'Tomo' }
  }, [state.status, state.phase, state.timeLeft])

  return {
    ...state,
    mainAction: () => dispatch({ type: 'MAIN_ACTION', settings }),
    reset: () => dispatch({ type: 'RESET', settings }),
  }
}
