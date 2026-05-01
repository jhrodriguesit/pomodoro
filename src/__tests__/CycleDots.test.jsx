import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CycleDots } from '../components/CycleDots'

function getDots() {
  return screen.getAllByRole('presentation')
}

describe('CycleDots', () => {
  it('renders 4 dots', () => {
    render(<CycleDots cycleIndex={0} phase="focus" status="idle" />)
    expect(getDots()).toHaveLength(4)
  })

  it('all dots are upcoming when status is idle', () => {
    render(<CycleDots cycleIndex={0} phase="focus" status="idle" />)
    getDots().forEach(dot => expect(dot).toHaveAttribute('data-state', 'upcoming'))
  })

  it('dot 0 is current, dots 1-3 upcoming during first focus running', () => {
    render(<CycleDots cycleIndex={0} phase="focus" status="running" />)
    const dots = getDots()
    expect(dots[0]).toHaveAttribute('data-state', 'current')
    expect(dots[1]).toHaveAttribute('data-state', 'upcoming')
    expect(dots[2]).toHaveAttribute('data-state', 'upcoming')
    expect(dots[3]).toHaveAttribute('data-state', 'upcoming')
  })

  it('dot 0 completed, dots 1-3 upcoming during break after cycle 0', () => {
    render(<CycleDots cycleIndex={0} phase="break" status="running" />)
    const dots = getDots()
    expect(dots[0]).toHaveAttribute('data-state', 'completed')
    expect(dots[1]).toHaveAttribute('data-state', 'upcoming')
  })

  it('dots 0-1 completed, dot 2 current during third focus', () => {
    render(<CycleDots cycleIndex={2} phase="focus" status="running" />)
    const dots = getDots()
    expect(dots[0]).toHaveAttribute('data-state', 'completed')
    expect(dots[1]).toHaveAttribute('data-state', 'completed')
    expect(dots[2]).toHaveAttribute('data-state', 'current')
    expect(dots[3]).toHaveAttribute('data-state', 'upcoming')
  })

  it('all dots completed when status is done', () => {
    render(<CycleDots cycleIndex={3} phase="focus" status="done" />)
    getDots().forEach(dot => expect(dot).toHaveAttribute('data-state', 'completed'))
  })
})
