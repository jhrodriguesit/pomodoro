import { Settings } from 'lucide-react'

interface SettingsButtonProps {
  onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open settings"
      className="p-2 rounded-full text-warm-muted dark:text-warm-dark-muted hover:text-warm-text dark:hover:text-warm-dark-text transition-colors"
    >
      <Settings size={18} />
    </button>
  )
}
