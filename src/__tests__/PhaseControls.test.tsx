import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { PhaseControls } from '../components/PhaseControls'

const defaultProps: ComponentProps<typeof PhaseControls> = {
  status: 'idle',
  soundOn: true,
  onMainAction: () => {},
  onSoundToggle: () => {},
  onReset: () => {},
}

describe('PhaseControls', () => {
  it('shows Start Focus when status is idle', () => {
    render(<PhaseControls {...defaultProps} status="idle" />)
    expect(screen.getByRole('button', { name: /start focus/i })).toBeInTheDocument()
  })

  it('shows Pause when status is running', () => {
    render(<PhaseControls {...defaultProps} status="running" />)
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('shows Resume when status is paused', () => {
    render(<PhaseControls {...defaultProps} status="paused" />)
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
  })

  it('shows Start Break when status is waiting_break', () => {
    render(<PhaseControls {...defaultProps} status="waiting_break" />)
    expect(screen.getByRole('button', { name: /start break/i })).toBeInTheDocument()
  })

  it('shows Start Focus when status is waiting_focus', () => {
    render(<PhaseControls {...defaultProps} status="waiting_focus" />)
    expect(screen.getByRole('button', { name: /start focus/i })).toBeInTheDocument()
  })

  it('main button is disabled when status is done', () => {
    render(<PhaseControls {...defaultProps} status="done" />)
    expect(screen.getByRole('button', { name: /session complete/i })).toBeDisabled()
  })

  it('reset button is hidden when status is idle', () => {
    render(<PhaseControls {...defaultProps} status="idle" />)
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  it('reset button is visible when status is not idle', () => {
    render(<PhaseControls {...defaultProps} status="running" />)
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('sound toggle shows mute label when soundOn is true', () => {
    render(<PhaseControls {...defaultProps} soundOn={true} />)
    expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument()
  })

  it('sound toggle shows unmute label when soundOn is false', () => {
    render(<PhaseControls {...defaultProps} soundOn={false} />)
    expect(screen.getByRole('button', { name: /unmute/i })).toBeInTheDocument()
  })

  it('calls onMainAction when main button is clicked', async () => {
    const onMainAction = vi.fn()
    render(<PhaseControls {...defaultProps} status="idle" onMainAction={onMainAction} />)
    await userEvent.click(screen.getByRole('button', { name: /start focus/i }))
    expect(onMainAction).toHaveBeenCalledOnce()
  })

  it('calls onSoundToggle when sound button is clicked', async () => {
    const onSoundToggle = vi.fn()
    render(<PhaseControls {...defaultProps} onSoundToggle={onSoundToggle} />)
    await userEvent.click(screen.getByRole('button', { name: /mute/i }))
    expect(onSoundToggle).toHaveBeenCalledOnce()
  })

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn()
    render(<PhaseControls {...defaultProps} status="running" onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
