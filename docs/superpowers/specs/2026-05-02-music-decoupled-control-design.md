# Music Decoupled Control Design

**Date:** 2026-05-02

## Context

Currently, music playback is automatically tied to the timer state: music plays only during the focus phase while the timer is running, and stops during breaks or when the timer is paused. Users have no way to keep music playing during breaks or start it before a session begins. The goal is to give users full, independent control over music playback via the existing volume button.

## What Changes

### State & Playback Logic (`src/App.tsx`)

Replace `soundOn: boolean` and the derived `shouldPlayMusic` condition with a single `musicPlaying: boolean` state (default `false`).

The `useEffect` that drives the YouTube player watches only `musicPlaying` and `selectedGenre` — no timer state involved:
- `musicPlaying === true` AND genre selected → play
- Otherwise → pause

The timer's `useTimer` hook is untouched. When the user switches genres while `musicPlaying` is true, the video switches immediately (existing `switchVideo` logic handles this).

### Volume Button Behavior (`src/components/PhaseControls.tsx`)

The `onSoundToggle` callback logic:
- **Genre selected:** toggle `musicPlaying` directly
- **No genre selected:** set `showGenrePrompt = true` (triggers prompt), do not toggle

### Volume Button Visual (`src/components/PhaseControls.tsx`)

The button becomes more prominent to signal it is the primary music control:
- **Active (playing):** filled accent-color background, white icon
- **Inactive (paused):** outlined/bordered style, accent-colored icon (more visible than current muted gray)
- **No genre selected:** same inactive style; click triggers prompt instead of toggling

### No-Genre Prompt

A `showGenrePrompt: boolean` state in `App.tsx` (default `false`) drives two simultaneous effects when the user clicks the volume button with no genre selected:

1. **Tooltip near the button:** message "Pick a genre to play music", auto-dismisses after 2.5s or when a genre is selected
2. **Genre pills highlight:** brief pulse animation or colored outline on the pills row to draw attention

`showGenrePrompt` resets to `false` after 2.5s or immediately when a genre is selected.

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Replace `soundOn` + `shouldPlayMusic` with `musicPlaying`; add `showGenrePrompt`; update `onSoundToggle` callback; update playback `useEffect` |
| `src/components/PhaseControls.tsx` | Update button visual states; pass `showGenrePrompt` for tooltip rendering |
| `src/components/GenrePills.tsx` | Accept `highlight: boolean` prop; apply pulse/outline when true |

## What Stays the Same

- `useTimer` hook — no changes
- `useYouTube` hook — no changes
- Genre selection logic — no changes
- The YouTube player container — no changes

## Verification

1. Select a genre → click volume button → music starts, button shows active state
2. Click volume button again → music pauses, button shows inactive state
3. Start timer, let it transition to break → music keeps playing uninterrupted
4. Reset timer → music keeps playing (timer reset no longer affects music)
5. Click volume button with no genre selected → tooltip appears near button, genre pills highlight for ~2.5s
6. Select a genre while music is playing → video switches immediately
7. Deselect all genres while music is playing → music pauses, but `musicPlaying` stays `true`; selecting a new genre auto-resumes playback
