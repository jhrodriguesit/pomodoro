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
