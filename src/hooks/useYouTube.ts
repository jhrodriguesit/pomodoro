interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars: {
    autoplay: number;
    controls: number;
    rel: number;
    playsinline: number;
  };
  events: {
    onReady: (event: YTPlayerEvent) => void;
  };
}

declare global {
  interface Window {
    YT: {
      Player: new (container: HTMLElement, options: YTPlayerOptions) => YTPlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

import { useRef, useState } from 'react'

export function useYouTube(containerRef: React.RefObject<HTMLElement | null>) {
  const playerRef = useRef<YTPlayer | null>(null)
  const [hasPlayer, setHasPlayer] = useState(false)
  const intentRef = useRef<boolean>(false)

  function ensureScriptLoaded() {
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }

  function initPlayer(videoId: string, autoPlay?: boolean): void {
    ensureScriptLoaded()
    intentRef.current = autoPlay ?? false

    function createPlayer() {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1 },
        events: {
          onReady(event) {
            setHasPlayer(true)
            if (intentRef.current) event.target.playVideo()
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = createPlayer
    }
  }

  function play() {
    intentRef.current = true
    playerRef.current?.playVideo()
  }

  function pause() {
    intentRef.current = false
    playerRef.current?.pauseVideo()
  }

  function stop() {
    intentRef.current = false
    playerRef.current?.pauseVideo()
    playerRef.current?.seekTo(0, true)
  }

  function switchVideo(videoId: string, autoPlay?: boolean): void {
    intentRef.current = autoPlay ?? false
    if (!playerRef.current) return
    if (autoPlay) {
      playerRef.current.loadVideoById(videoId)
    } else {
      playerRef.current.cueVideoById(videoId)
    }
  }

  return { hasPlayer, initPlayer, play, pause, stop, switchVideo }
}
