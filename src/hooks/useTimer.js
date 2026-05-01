import { useReducer, useEffect } from 'react'
import { FOCUS_DURATION, BREAK_DURATION } from '../constants'

const initialState = {
  phase: 'focus',
  cycleIndex: 0,
  timeLeft: FOCUS_DURATION,
  status: 'idle',
}

function timerReducer(state, action) {
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

function handleMainAction(state) {
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

function handleTick(state) {
  if (state.status !== 'running') return state
  if (state.timeLeft > 1) return { ...state, timeLeft: state.timeLeft - 1 }
  if (state.phase === 'focus') {
    if (state.cycleIndex >= 2) return { ...state, timeLeft: 0, status: 'done', cycleIndex: state.cycleIndex + 1 }
    return { ...state, timeLeft: 0, status: 'waiting_break' }
  }
  return { ...state, timeLeft: 0, status: 'waiting_focus' }
}

export function useTimer() {
  const [state, dispatch] = useReducer(timerReducer, initialState)

  useEffect(() => {
    if (state.status !== 'running') return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.status])

  return {
    ...state,
    mainAction: () => dispatch({ type: 'MAIN_ACTION' }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
