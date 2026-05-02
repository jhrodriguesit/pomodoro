import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { PhaseControls } from '../components/PhaseControls'

const defaultProps: ComponentProps<typeof PhaseControls> = {
  status: 'idle',
  musicPlaying: false,
  showGenrePrompt: false,
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

  it('shows Start Long Break when status is waiting_long_break', () => {
    render(<PhaseControls {...defaultProps} status="waiting_long_break" />)
    expect(screen.getByRole('button', { name: /start long break/i })).toBeInTheDocument()
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

  it('shows "Pause music" label when musicPlaying is true', () => {
    render(<PhaseControls {...defaultProps} musicPlaying={true} />)
    expect(screen.getByRole('button', { name: /pause music/i })).toBeInTheDocument()
  })

  it('shows "Play music" label when musicPlaying is false', () => {
    render(<PhaseControls {...defaultProps} musicPlaying={false} />)
    expect(screen.getByRole('button', { name: /play music/i })).toBeInTheDocument()
  })

  it('calls onMainAction when main button is clicked', async () => {
    const onMainAction = vi.fn()
    render(<PhaseControls {...defaultProps} status="idle" onMainAction={onMainAction} />)
    await userEvent.click(screen.getByRole('button', { name: /start focus/i }))
    expect(onMainAction).toHaveBeenCalledOnce()
  })

  it('calls onSoundToggle when music button is clicked', async () => {
    const onSoundToggle = vi.fn()
    render(<PhaseControls {...defaultProps} onSoundToggle={onSoundToggle} />)
    await userEvent.click(screen.getByRole('button', { name: /play music/i }))
    expect(onSoundToggle).toHaveBeenCalledOnce()
  })

  it('calls onReset when reset button is clicked', async () => {
    const onReset = vi.fn()
    render(<PhaseControls {...defaultProps} status="running" onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('shows genre prompt tooltip when showGenrePrompt is true', () => {
    render(<PhaseControls {...defaultProps} showGenrePrompt={true} />)
    expect(screen.getByText(/pick a genre to play music/i)).toBeInTheDocument()
  })

  it('hides genre prompt tooltip when showGenrePrompt is false', () => {
    render(<PhaseControls {...defaultProps} showGenrePrompt={false} />)
    expect(screen.queryByText(/pick a genre to play music/i)).not.toBeInTheDocument()
  })
})
