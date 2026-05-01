import { useRef, useState } from 'react'

export function useYouTube(containerRef) {
  const playerRef = useRef(null)
  const [hasPlayer, setHasPlayer] = useState(false)
  const intentRef = useRef(false)

  function ensureScriptLoaded() {
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }

  function initPlayer(videoId, autoPlay = false) {
    ensureScriptLoaded()
    intentRef.current = autoPlay

    function createPlayer() {
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

  function switchVideo(videoId, autoPlay = false) {
    intentRef.current = autoPlay
    if (!playerRef.current) return
    if (autoPlay) {
      playerRef.current.loadVideoById(videoId)
    } else {
      playerRef.current.cueVideoById(videoId)
    }
  }

  return { hasPlayer, initPlayer, play, pause, stop, switchVideo }
}
