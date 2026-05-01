import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TimerDisplay } from '../components/TimerDisplay'

describe('TimerDisplay', () => {
  it('formats seconds as MM:SS', () => {
    render(<TimerDisplay timeLeft={1500} phase="focus" status="idle" />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('formats partial minutes correctly', () => {
    render(<TimerDisplay timeLeft={90} phase="break" status="running" />)
    expect(screen.getByText('01:30')).toBeInTheDocument()
  })

  it('shows "Done" instead of timer when status is done', () => {
    render(<TimerDisplay timeLeft={0} phase="focus" status="done" />)
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.queryByText('00:00')).not.toBeInTheDocument()
  })

  it('shows "Focus" phase label during focus phase', () => {
    render(<TimerDisplay timeLeft={1500} phase="focus" status="running" />)
    expect(screen.getByText('Focus')).toBeInTheDocument()
  })

  it('shows "Break" phase label during break phase', () => {
    render(<TimerDisplay timeLeft={300} phase="break" status="running" />)
    expect(screen.getByText('Break')).toBeInTheDocument()
  })

  it('hides phase label when status is idle', () => {
    render(<TimerDisplay timeLeft={1500} phase="focus" status="idle" />)
    expect(screen.queryByText('Focus')).not.toBeInTheDocument()
  })

  it('hides phase label when status is done', () => {
    render(<TimerDisplay timeLeft={0} phase="focus" status="done" />)
    expect(screen.queryByText('Focus')).not.toBeInTheDocument()
  })
})
