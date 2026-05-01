# Claude Code Prompt — Tomo

---

Build a single-page web app called **Tomo**. The full product brief is in `product-brief.md` — read it before writing any code. Below is a summary of the most important points.

## What to build

A Pomodoro timer that plays music from YouTube. The user picks a music genre, presses play, and the app runs 4 cycles of 25 minutes focus followed by 5 minutes break. Music plays during focus phases and pauses during breaks, resuming from where it left off. The YouTube player is completely hidden — audio only.

## The most important behaviours

- Music plays during focus, pauses during breaks, resumes exactly where it left off
- The timer and music are always in sync — music controls follow the timer, not the other way around
- Switching genre resets the session
- The play button pauses and resumes both the timer and the music together
- Reset returns everything to the initial state: cycle 1, 25:00, no music playing
- After 4 complete cycles the session is marked done and nothing plays

## Genre to YouTube video ID mapping

| Genre      | Video ID     |
|------------|--------------|
| Reggae     | zODPkMZ2pvw  |
| Pop        | KJyskZhXJHA  |
| Classical  | RiG_fsPmNu4  |
| Jazz       | pyNiTUvNxxE  |
| Bossa Nova | LTyUGpq-1MY  |

Load the YouTube IFrame API. Keep the player element off-screen and invisible.

## Design

Warm, classical, refined. Like a quality print publication — not techy or gamified.


## What NOT to add

Do not add login, accounts, Spotify, volume control, custom timer durations, task lists, sounds/notifications, or any feature not described in the brief. Keep it simple.
