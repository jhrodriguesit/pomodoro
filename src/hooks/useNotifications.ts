import { useEffect, useRef } from 'react'
import type { TimerStatus } from '../types'

const MESSAGES: Partial<Record<TimerStatus, { title: string; body: string }>> = {
  waiting_break:      { title: 'Focus complete!',       body: 'Time for a break.' },
  waiting_focus:      { title: 'Break over!',           body: 'Ready to focus?' },
  waiting_long_break: { title: 'Final focus done!',     body: 'Time for a long break.' },
  done:               { title: 'Session complete!',     body: 'Great work — all cycles done.' },
}

function playChime() {
  try {
    const ctx = new AudioContext()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4)

    // Two-note ascending chime
    const frequencies = [880, 1108]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.connect(gain)
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.start(ctx.currentTime + i * 0.18)
      osc.stop(ctx.currentTime + 1.4)
    })

    setTimeout(() => ctx.close(), 1600)
  } catch {
    // AudioContext unavailable — silent fallback
  }
}

export function useNotifications(status: TimerStatus, chimeEnabled: boolean) {
  const lastNotifiedStatus = useRef<TimerStatus | null>(null)

  useEffect(() => {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission()
  }, [])

  useEffect(() => {
    const message = MESSAGES[status]
    if (!message || status === lastNotifiedStatus.current) return

    lastNotifiedStatus.current = status

    if (chimeEnabled) playChime()

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      const n = new Notification(message.title, { body: message.body, silent: true })
      const timer = setTimeout(() => n.close(), 6000)
      return () => clearTimeout(timer)
    }
  }, [status, chimeEnabled])
}
