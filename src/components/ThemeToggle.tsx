import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-full text-warm-muted dark:text-warm-dark-muted hover:text-warm-text dark:hover:text-warm-dark-text transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
