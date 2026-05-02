import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GenrePills } from '../components/GenrePills'
import { GENRES, GENRE_ORDER } from '../constants'

describe('GenrePills', () => {
  it('renders a pill for every genre', () => {
    render(<GenrePills selectedGenre={null} onSelect={() => {}} />)
    GENRE_ORDER.forEach(id => {
      expect(screen.getByRole('button', { name: GENRES[id].label })).toBeInTheDocument()
    })
  })

  it('no pill is highlighted when selectedGenre is null', () => {
    render(<GenrePills selectedGenre={null} onSelect={() => {}} />)
    GENRE_ORDER.forEach(id => {
      const btn = screen.getByRole('button', { name: GENRES[id].label })
      expect(btn).not.toHaveAttribute('aria-pressed', 'true')
    })
  })

  it('highlights the selected genre pill', () => {
    render(<GenrePills selectedGenre="jazz" onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'Jazz' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Reggae' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelect with the genre id when a pill is clicked', async () => {
    const onSelect = vi.fn()
    render(<GenrePills selectedGenre={null} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Classical' }))
    expect(onSelect).toHaveBeenCalledWith('classical')
  })

  it('calls onSelect with null when the selected genre pill is clicked again', async () => {
    const onSelect = vi.fn()
    render(<GenrePills selectedGenre="classical" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Classical' }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('applies highlight animation when highlight is true', () => {
    const { container } = render(
      <GenrePills selectedGenre={null} onSelect={() => {}} highlight={true} />
    )
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('does not apply highlight animation by default', () => {
    const { container } = render(
      <GenrePills selectedGenre={null} onSelect={() => {}} />
    )
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })
})
