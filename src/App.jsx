import { useRef, useState, useEffect } from 'react'
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
  const ytContainerRef = useRef(null)
  const yt = useYouTube(ytContainerRef)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [soundOn, setSoundOn] = useState(true)

  const shouldPlayMusic =
    timer.status === 'running' &&
    timer.phase === 'focus' &&
    soundOn &&
    selectedGenre !== null

  // Sync YouTube playback whenever the music-should-play condition changes
  useEffect(() => {
    if (shouldPlayMusic) {
      if (!yt.hasPlayer) {
        yt.initPlayer(GENRES[selectedGenre].videoId, true)
      } else {
        yt.play()
      }
    } else {
      yt.pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlayMusic])

  // Switch video when genre changes mid-session (without resetting the timer)
  const prevGenreRef = useRef(selectedGenre)
  useEffect(() => {
    const prev = prevGenreRef.current
    prevGenreRef.current = selectedGenre

    if (selectedGenre === prev || !yt.hasPlayer) return
    if (selectedGenre === null) {
      yt.pause()
      return
    }
    yt.switchVideo(GENRES[selectedGenre].videoId, shouldPlayMusic)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre])

  function handleReset() {
    timer.reset()
    yt.stop()
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

        <GenrePills selectedGenre={selectedGenre} onSelect={setSelectedGenre} />

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
          soundOn={soundOn}
          onMainAction={timer.mainAction}
          onSoundToggle={() => setSoundOn(s => !s)}
          onReset={handleReset}
        />
      </main>
    </div>
  )
}
