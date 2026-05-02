import { useReducer, useEffect } from 'react'
import { FOCUS_DURATION, BREAK_DURATION, TOTAL_CYCLES } from '../constants'
import type { Phase, TimerStatus } from '../types'
import { formatTime } from '../components/TimerDisplay'

interface TimerState {
  phase: Phase;
  cycleIndex: number;
  timeLeft: number;
  status: TimerStatus;
}

type TimerAction =
  | { type: 'MAIN_ACTION' }
  | { type: 'TICK' }
  | { type: 'RESET' };

export type UseTimerReturn = {
  phase: Phase;
  cycleIndex: number;
  timeLeft: number;
  status: TimerStatus;
  mainAction: () => void;
  reset: () => void;
};

const initialState: TimerState = {
  phase: 'focus',
  cycleIndex: 0,
  timeLeft: FOCUS_DURATION,
  status: 'idle',
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'MAIN_ACTION':
      return handleMainAction(state)
    case 'TICK':
      return handleTick(state)
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function handleMainAction(state: TimerState): TimerState {
  switch (state.status) {
    case 'idle':
      return { ...state, status: 'running' }
    case 'running':
      return { ...state, status: 'paused' }
    case 'paused':
      return { ...state, status: 'running' }
    case 'waiting_break':
      return { ...state, status: 'running', phase: 'break', timeLeft: BREAK_DURATION }
    case 'waiting_focus':
      return { ...state, status: 'running', phase: 'focus', cycleIndex: state.cycleIndex + 1, timeLeft: FOCUS_DURATION }
    default:
      return state
  }
}

function handleTick(state: TimerState): TimerState {
  if (state.status !== 'running') return state
  if (state.timeLeft > 1) return { ...state, timeLeft: state.timeLeft - 1 }
  if (state.phase === 'focus') {
    if (state.cycleIndex >= TOTAL_CYCLES - 1) return { ...state, timeLeft: 0, status: 'done' }
    return { ...state, timeLeft: 0, status: 'waiting_break' }
  }
  return { ...state, timeLeft: 0, status: 'waiting_focus' }
}

export function useTimer(): UseTimerReturn {
  const [state, dispatch] = useReducer(timerReducer, initialState)

  useEffect(() => {
    if (state.status !== 'running') return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.status])

  useEffect(() => {
    const { status, phase, timeLeft } = state
    let title: string
    if (status === 'running') {
      const label = phase === 'focus' ? 'Focus' : 'Break'
      title = `${formatTime(timeLeft)} · ${label} — Tomo`
    } else if (status === 'waiting_break') {
      title = '⏸ Break ready — Tomo'
    } else if (status === 'waiting_focus') {
      title = '⏸ Focus ready — Tomo'
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
    mainAction: () => dispatch({ type: 'MAIN_ACTION' }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
