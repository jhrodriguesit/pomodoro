import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Settings } from '../types'
import {
  DEFAULT_SETTINGS,
  FOCUS_MIN_MIN, FOCUS_MIN_MAX,
  BREAK_MIN_MIN, BREAK_MIN_MAX,
  LONG_BREAK_MIN_MIN, LONG_BREAK_MIN_MAX,
  CYCLES_MIN, CYCLES_MAX,
} from '../constants'

interface SettingsModalProps {
  open: boolean
  settings: Settings
  onSave: (next: Settings) => void
  onClose: () => void
}

interface FormState {
  focusMin: number
  breakMin: number
  longBreakMin: number
  totalCycles: number
  pauseMusicOnPhaseEnd: boolean
  chimeOnPhaseEnd: boolean
}

function settingsToForm(s: Settings): FormState {
  return {
    focusMin: Math.round(s.focusSeconds / 60),
    breakMin: Math.round(s.breakSeconds / 60),
    longBreakMin: Math.round(s.longBreakSeconds / 60),
    totalCycles: s.totalCycles,
    pauseMusicOnPhaseEnd: s.pauseMusicOnPhaseEnd,
    chimeOnPhaseEnd: s.chimeOnPhaseEnd,
  }
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.round(n)))
}

interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  id: string
}

function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 py-2 cursor-pointer">
      <span className="font-sans text-sm text-warm-text dark:text-warm-dark-text">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-warm-accent' : 'bg-warm-border dark:bg-warm-dark-border',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </label>
  )
}

interface NumberFieldProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (next: number) => void
}

function NumberField({ id, label, value, min, max, unit, onChange }: NumberFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <label htmlFor={id} className="font-sans text-sm text-warm-text dark:text-warm-dark-text">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          onBlur={e => onChange(clamp(Number(e.target.value), min, max))}
          className="w-20 px-2 py-1 text-right rounded border border-warm-border dark:border-warm-dark-border bg-warm-bg dark:bg-warm-dark-bg text-warm-text dark:text-warm-dark-text font-sans text-sm tabular-nums focus:outline-none focus:border-warm-accent"
        />
        <span className="font-sans text-xs text-warm-muted dark:text-warm-dark-muted w-8">{unit}</span>
      </div>
    </div>
  )
}

export function SettingsModal({ open, settings, onSave, onClose }: SettingsModalProps) {
  const [form, setForm] = useState<FormState>(() => settingsToForm(settings))

  // Re-sync form whenever the modal opens with the latest saved settings.
  useEffect(() => {
    if (open) setForm(settingsToForm(settings))
  }, [open, settings])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function handleSave() {
    const next: Settings = {
      focusSeconds: clamp(form.focusMin, FOCUS_MIN_MIN, FOCUS_MIN_MAX) * 60,
      breakSeconds: clamp(form.breakMin, BREAK_MIN_MIN, BREAK_MIN_MAX) * 60,
      longBreakSeconds: clamp(form.longBreakMin, LONG_BREAK_MIN_MIN, LONG_BREAK_MIN_MAX) * 60,
      totalCycles: clamp(form.totalCycles, CYCLES_MIN, CYCLES_MAX),
      pauseMusicOnPhaseEnd: form.pauseMusicOnPhaseEnd,
      chimeOnPhaseEnd: form.chimeOnPhaseEnd,
    }
    onSave(next)
    onClose()
  }

  function handleRestoreDefaults() {
    setForm(settingsToForm(DEFAULT_SETTINGS))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-warm-bg dark:bg-warm-dark-bg border border-warm-border dark:border-warm-dark-border shadow-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="settings-title" className="font-serif text-xl font-medium text-warm-text dark:text-warm-dark-text">
            Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 rounded-full text-warm-muted dark:text-warm-dark-muted hover:text-warm-text dark:hover:text-warm-dark-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="divide-y divide-warm-border/50 dark:divide-warm-dark-border/50">
          <section className="pb-2">
            <NumberField
              id="focus-min" label="Focus duration"
              value={form.focusMin} min={FOCUS_MIN_MIN} max={FOCUS_MIN_MAX} unit="min"
              onChange={v => setForm(f => ({ ...f, focusMin: v }))}
            />
            <NumberField
              id="break-min" label="Break duration"
              value={form.breakMin} min={BREAK_MIN_MIN} max={BREAK_MIN_MAX} unit="min"
              onChange={v => setForm(f => ({ ...f, breakMin: v }))}
            />
            <NumberField
              id="long-break-min" label="Long break duration"
              value={form.longBreakMin} min={LONG_BREAK_MIN_MIN} max={LONG_BREAK_MIN_MAX} unit="min"
              onChange={v => setForm(f => ({ ...f, longBreakMin: v }))}
            />
            <NumberField
              id="total-cycles" label="Cycles"
              value={form.totalCycles} min={CYCLES_MIN} max={CYCLES_MAX} unit=""
              onChange={v => setForm(f => ({ ...f, totalCycles: v }))}
            />
          </section>

          <section className="pt-3 pb-2">
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-warm-muted dark:text-warm-dark-muted mb-1">
              Notifications
            </h3>
            <Toggle
              id="pause-music"
              checked={form.pauseMusicOnPhaseEnd}
              onChange={v => setForm(f => ({ ...f, pauseMusicOnPhaseEnd: v }))}
              label="Pause music when phase ends"
            />
            <Toggle
              id="chime"
              checked={form.chimeOnPhaseEnd}
              onChange={v => setForm(f => ({ ...f, chimeOnPhaseEnd: v }))}
              label="Play chime when phase ends"
            />
          </section>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleRestoreDefaults}
            className="font-sans text-xs text-warm-muted dark:text-warm-dark-muted hover:text-warm-accent transition-colors underline-offset-2 hover:underline"
          >
            Restore defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-full font-sans text-sm text-warm-muted dark:text-warm-dark-muted hover:text-warm-text dark:hover:text-warm-dark-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-9 px-4 rounded-full font-sans font-medium text-sm bg-warm-accent text-white hover:bg-warm-text dark:hover:bg-warm-dark-text transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
