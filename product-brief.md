# Tomo — Product Brief

## What is it?

Tomo is a single-page web app that combines the Pomodoro productivity technique with music. The core idea is simple: instead of staring at a countdown timer, the user picks a music genre and lets the music guide their focus session. The app manages the timer, the music playback, and the breaks — the user just works.

It is designed to be completely frictionless. No login, no account, no setup. Open the page, pick a vibe, press play.

---

## The Pomodoro Structure

A session consists of 4 cycles. Each cycle has two phases:

- **Focus phase** — 25 minutes. Music plays. The user works.
- **Break phase** — 5 minutes. Music pauses. The user rests.

After 4 complete cycles the session is over. The user can reset and start again at any time.

---

## Music

Music is sourced from YouTube via the IFrame API. The video player is completely hidden — the user only hears audio, they never see a video. Each genre maps to a single long-form YouTube video (2+ hours) from the Clips & Beats channel. These videos were chosen because the channel is small and non-monetised, meaning no ads will interrupt the session.

The music plays during focus phases and automatically pauses during breaks. When a break ends, music resumes exactly where it left off — the playback position is never reset mid-session.

### Genres and YouTube Video IDs

| Genre      | YouTube Video ID |
|------------|-----------------|
| Reggae     | zODPkMZ2pvw     |
| Pop        | KJyskZhXJHA     |
| Classical  | RiG_fsPmNu4     |
| Jazz       | pyNiTUvNxxE     |
| Bossa Nova | LTyUGpq-1MY     |

---

## User Flow

1. User opens the app. They see the genre selector and a timer showing 25:00, waiting.
2. User selects a genre. The YouTube video loads silently in the background.
3. User presses play. The focus phase begins — music starts, timer counts down from 25:00.
4. At 0:00, the focus phase ends. Music pauses automatically. The break phase begins — timer counts down from 5:00. A clear visual change communicates the shift.
5. At 0:00, the break ends. Music resumes automatically. The next focus phase begins.
6. This repeats for 4 cycles. After the 4th break, the session is marked complete.
7. At any point the user can pause/resume, or reset the entire session.

If the user switches genre mid-session, the session resets and the new genre loads from the beginning.

---

## Interface

The interface should feel calm, classical, and refined — like a well-designed notebook or a quality print publication. The overall impression is quiet and focused, not techy or gamified. It should have a paper-like warmth to it.

It supports light and dark mode, auto-detecting the user's system preference with a manual toggle. Both modes should feel warm — dark mode in particular should not feel cold or harsh.

Beyond that, the UI design and layout decisions are left to the implementation.

---

## What this version does NOT include

- User accounts or login
- Spotify integration
- Dynamic or trending playlists
- Volume control
- Sounds or notifications at phase end
- Task list or to-do functionality
- Custom timer durations
- Mobile app (web only for now)

These are all potential future additions, but are explicitly out of scope for this version.
