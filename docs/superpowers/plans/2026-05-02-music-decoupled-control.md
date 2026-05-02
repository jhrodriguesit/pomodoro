# Music Decoupled Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decouple music playback from the timer state so users can play/pause music freely via the volume button, regardless of what the timer is doing.

**Architecture:** Replace the derived `shouldPlayMusic` condition (which tied playback to timer phase + status) with a standalone `musicPlaying` boolean state owned by `App.tsx`. The volume button becomes the sole music control. A `showGenrePrompt` state handles the no-genre-selected edge case.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest + Testing Library

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/GenrePills.tsx` | Add optional `highlight` prop → pulse animation on container |
| `src/components/PhaseControls.tsx` | Replace `soundOn` with `musicPlaying`, add `showGenrePrompt`, update button visuals + tooltip |
| `src/__tests__/GenrePills.test.tsx` | Add tests for `highlight` prop |
| `src/__tests__/PhaseControls.test.tsx` | Update props + aria-labels, add tooltip tests |
| `src/App.tsx` | Replace `soundOn`/`shouldPlayMusic` with `musicPlaying`, add `showGenrePrompt`, update effects and callbacks |

---

### Task 1: Add `highlight` prop to `GenrePills`

**Files:**
- Modify: `src/components/GenrePills.tsx`
- Test: `src/__tests__/GenrePills.test.tsx`

- [ ] **Step 1: Write failing tests**

Add to `src/__tests__/GenrePills.test.tsx` (after the last existing test):

```tsx
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/__tests__/GenrePills.test.tsx
```

Expected: last 2 tests FAIL — `highlight` prop does not exist yet.

- [ ] **Step 3: Implement the `highlight` prop**

Replace the full content of `src/components/GenrePills.tsx`:

```tsx
import { GENRES, GENRE_ORDER } from '../constants'
import type { GenreKey } from '../types'

interface GenrePillsProps {
  selectedGenre: GenreKey | null
  onSelect: (genre: GenreKey | null) => void
  highlight?: boolean
}

export function GenrePills({ selectedGenre, onSelect, highlight = false }: GenrePillsProps) {
  return (
    <div
      className={[
        'flex flex-wrap justify-center gap-2 rounded-full transition-all',
        highlight ? 'animate-pulse ring-2 ring-warm-accent ring-offset-2 ring-offset-warm-bg dark:ring-offset-warm-dark-bg' : '',
      ].join(' ')}
      role="group"
      aria-label="Music genre"
    >
      {GENRE_ORDER.map(id => {
        const isSelected = selectedGenre === id
        return (
          <button
            key={id}
            onClick={() => onSelect(isSelected ? null : id)}
            aria-pressed={isSelected}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-sans font-medium border transition-colors',
              isSelected
                ? 'bg-warm-accent text-white border-warm-accent dark:bg-warm-accent dark:border-warm-accent'
                : 'bg-transparent text-warm-muted dark:text-warm-dark-muted border-warm-border dark:border-warm-dark-border hover:border-warm-accent dark:hover:border-warm-accent hover:text-warm-accent dark:hover:text-warm-accent',
            ].join(' ')}
          >
            {GENRES[id].label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run all GenrePills tests**

```bash
npx vitest run src/__tests__/GenrePills.test.tsx
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/GenrePills.tsx src/__tests__/GenrePills.test.tsx
git commit -m "feat: add highlight prop to GenrePills for genre prompt"
```

---

### Task 2: Update `PhaseControls` — props, button visuals, tooltip

**Files:**
- Modify: `src/components/PhaseControls.tsx`
- Test: `src/__tests__/PhaseControls.test.tsx`

- [ ] **Step 1: Write failing tests**

Replace the full content of `src/__tests__/PhaseControls.test.tsx`:

```tsx
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

  it('main button is disabled when status is done', () => {
    render(<PhaseControls {...defaultProps} status="done" />)
    expect(screen.getByRole('button', { name: '—' })).toBeDisabled()
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/__tests__/PhaseControls.test.tsx
```

Expected: tests referencing `musicPlaying`, `showGenrePrompt`, and "play/pause music" labels FAIL — the component still uses the old props.

- [ ] **Step 3: Implement the updated component**

Replace the full content of `src/components/PhaseControls.tsx`:

```tsx
import { Volume2, VolumeX } from 'lucide-react'
import type { TimerStatus } from '../types'

interface PhaseControlsProps {
  status: TimerStatus
  musicPlaying: boolean
  showGenrePrompt: boolean
  onMainAction: () => void
  onSoundToggle: () => void
  onReset: () => void
}

const MAIN_BUTTON_CONFIG = {
  idle:          { label: 'Start Focus', disabled: false },
  running:       { label: 'Pause',       disabled: false },
  paused:        { label: 'Resume',      disabled: false },
  waiting_break: { label: 'Start Break', disabled: false },
  waiting_focus: { label: 'Start Focus', disabled: false },
  done:          { label: '—',           disabled: true  },
} as const satisfies Record<TimerStatus, { label: string; disabled: boolean }>

export function PhaseControls({ status, musicPlaying, showGenrePrompt, onMainAction, onSoundToggle, onReset }: PhaseControlsProps) {
  const config = MAIN_BUTTON_CONFIG[status]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={onSoundToggle}
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
            className={[
              'p-2 rounded-full transition-colors',
              musicPlaying
                ? 'bg-warm-accent text-white'
                : 'border border-warm-accent text-warm-accent dark:border-warm-accent dark:text-warm-accent',
            ].join(' ')}
          >
            {musicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {showGenrePrompt && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-warm-text dark:bg-warm-dark-text text-warm-bg dark:text-warm-dark-bg text-xs whitespace-nowrap pointer-events-none">
              Pick a genre to play music
            </div>
          )}
        </div>

        <button
          onClick={onMainAction}
          disabled={config.disabled}
          aria-label={config.label}
          className={[
            'h-11 px-6 rounded-full font-sans font-medium text-sm transition-colors',
            config.disabled
              ? 'bg-warm-border dark:bg-warm-dark-border text-warm-muted dark:text-warm-dark-muted cursor-not-allowed'
              : 'bg-warm-accent text-white hover:bg-warm-text dark:hover:bg-warm-dark-text',
          ].join(' ')}
        >
          {config.label}
        </button>
      </div>

      {status !== 'idle' && (
        <button
          onClick={onReset}
          aria-label="Reset session"
          className="font-sans text-xs text-warm-muted dark:text-warm-dark-muted hover:text-warm-accent dark:hover:text-warm-accent transition-colors underline-offset-2 hover:underline"
        >
          Reset
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run all PhaseControls tests**

```bash
npx vitest run src/__tests__/PhaseControls.test.tsx
```

Expected: all 15 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/PhaseControls.tsx src/__tests__/PhaseControls.test.tsx
git commit -m "feat: update PhaseControls with independent music play/pause control"
```

---

### Task 3: Update `App.tsx` — decouple music from timer

**Files:**
- Modify: `src/App.tsx`

No unit tests — this is orchestration wiring. Verification is manual (see spec).

- [ ] **Step 1: Replace `App.tsx` with the decoupled implementation**

Replace the full content of `src/App.tsx`:

```tsx
import { useRef, useState, useEffect } from 'react'
import type { GenreKey } from './types'
import { useTimer } from './hooks/useTimer'
import { useTheme } from './hooks/useTheme'
import { useYouTube } from './hooks/useYouTube'
import { GENRES } from './constants'
import { ThemeToggle } from './components/ThemeToggle'
import { GenrePills } from './components/GenrePills'
import { CycleDots } from './components/CycleDots'
import { TimerDisplay } from './components/TimerDisplay'
import { PhaseControls } from './components/PhaseControls'

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const timer = useTimer()
  const ytContainerRef = useRef<HTMLDivElement | null>(null)
  const yt = useYouTube(ytContainerRef)
  const [selectedGenre, setSelectedGenre] = useState<GenreKey | null>(null)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [showGenrePrompt, setShowGenrePrompt] = useState(false)

  // Sync YouTube playback when musicPlaying or selectedGenre changes
  useEffect(() => {
    if (musicPlaying && selectedGenre !== null) {
      if (!yt.hasPlayer) {
        yt.initPlayer(GENRES[selectedGenre].videoId, true)
      } else {
        yt.play()
      }
    } else {
      yt.pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPlaying, selectedGenre])

  // Switch video when genre changes mid-session (without resetting position)
  const prevGenreRef = useRef<GenreKey | null>(selectedGenre)
  useEffect(() => {
    const prev = prevGenreRef.current
    prevGenreRef.current = selectedGenre

    if (selectedGenre === prev || !yt.hasPlayer) return
    if (selectedGenre === null) {
      yt.pause()
      return
    }
    yt.switchVideo(GENRES[selectedGenre].videoId, musicPlaying)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre])

  // Auto-dismiss the genre prompt after 2.5s
  useEffect(() => {
    if (!showGenrePrompt) return
    const id = setTimeout(() => setShowGenrePrompt(false), 2500)
    return () => clearTimeout(id)
  }, [showGenrePrompt])

  function handleGenreSelect(genre: GenreKey | null) {
    setSelectedGenre(genre)
    if (genre !== null) setShowGenrePrompt(false)
  }

  function handleSoundToggle() {
    if (selectedGenre === null) {
      setShowGenrePrompt(true)
    } else {
      setMusicPlaying(p => !p)
    }
  }

  function handleReset() {
    timer.reset()
  }

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-warm-dark-bg font-sans transition-colors duration-200">
      {/* Off-screen YouTube player container */}
      <div
        ref={ytContainerRef}
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
      />

      <header className="flex justify-end p-4 sm:p-6">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </header>

      <main className="flex flex-col items-center gap-10 px-4 pb-16 pt-4 sm:pt-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-warm-text dark:text-warm-dark-text tracking-wide">
          Tomo
        </h1>

        <GenrePills
          selectedGenre={selectedGenre}
          onSelect={handleGenreSelect}
          highlight={showGenrePrompt}
        />

        <TimerDisplay
          timeLeft={timer.timeLeft}
          phase={timer.phase}
          status={timer.status}
        />

        <CycleDots
          cycleIndex={timer.cycleIndex}
          phase={timer.phase}
          status={timer.status}
        />

        <PhaseControls
          status={timer.status}
          musicPlaying={musicPlaying}
          showGenrePrompt={showGenrePrompt}
          onMainAction={timer.mainAction}
          onSoundToggle={handleSoundToggle}
          onReset={handleReset}
        />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests PASS with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: decouple music playback from timer — independent play/pause control"
```

---

## Verification Checklist

1. Select a genre → click the volume button → music starts, button shows filled accent background
2. Click the volume button again → music pauses, button shows outlined accent style
3. Start the timer and let it transition to break → music keeps playing uninterrupted
4. Reset the timer while music is playing → music keeps playing
5. Click the volume button with no genre selected → tooltip "Pick a genre to play music" appears near the button AND genre pills pulse for ~2.5s
6. Select a genre while music is playing → video switches immediately without interruption
7. Deselect all genres while music is playing → music pauses; select a new genre → music resumes automatically
