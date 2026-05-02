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
