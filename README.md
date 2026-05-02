# Pomodoro

A minimal, warm-themed Pomodoro timer for the browser. Focus in cycles, take breaks, optionally play lo-fi music in the background, and end your session with a long break.

Checkout it live: https://jhdev-pomodoro.vercel.app/

## Features

- **Configurable cycles** — set focus duration, break duration, long-break duration, and number of cycles via a settings modal (gear icon, top right).
- **End-of-session long break** — after the final focus cycle, a long break runs before the session is marked done.
- **Background music** — pick a genre (lo-fi, jazz, classical, etc.) and stream it from YouTube while you work. Music can auto-pause at phase boundaries.
- **Phase-end notifications** — optional chime when a phase finishes; tab title shows a live countdown.
- **Light/dark theme** — toggle in the header; preference persists.
- **Settings persist** — your configuration is saved to `localStorage` and restored on reload.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Vitest + React Testing Library
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest test suite |
| `npm run test:ui` | Vitest UI mode |
| `npm run coverage` | Test coverage report |
| `npm run typecheck` | TypeScript check (no emit) |

## Settings

Defaults:

- Focus: 25 min
- Break: 5 min
- Long break: 15 min
- Cycles: 4
- Pause music on phase end: on
- Chime on phase end: on

Bounds: focus 1–120 min, break/long break 1–60 min, cycles 1–12. Out-of-range values are silently clamped.

> Saving new settings resets the current session to the start so the new configuration takes effect immediately.

## Project layout

```
src/
  App.tsx                  # Top-level wiring
  constants.ts             # Defaults, clamp bounds, genre list
  types.ts                 # Phase, TimerStatus, Settings
  hooks/
    useTimer.ts            # Timer state machine (useReducer)
    useSettings.ts         # localStorage-backed settings
    useTheme.ts            # Light/dark theme
    useYouTube.ts          # Background music player
    useNotifications.ts    # Chime + status messages
  components/
    SettingsButton.tsx
    SettingsModal.tsx
    ThemeToggle.tsx
    GenrePills.tsx
    CycleDots.tsx
    TimerDisplay.tsx
    PhaseControls.tsx
  __tests__/               # Vitest test suite
```
