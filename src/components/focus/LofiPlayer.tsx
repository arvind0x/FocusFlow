import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'

type YouTubePlayer = {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (volume: number) => void
  destroy: () => void
}

type YouTubeApi = {
  Player: new (element: HTMLElement, options: {
    videoId: string
    width: string
    height: string
    playerVars: Record<string, string | number>
    events: { onReady: (event: { target: YouTubePlayer }) => void; onError: () => void }
  }) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YouTubeApi> | undefined

function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previousReady = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.()
        if (window.YT?.Player) resolve(window.YT)
        else reject(new Error('YouTube player unavailable'))
      }
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.onerror = () => {
        apiPromise = undefined
        reject(new Error('YouTube player failed to load'))
      }
      document.head.appendChild(script)
    })
  }
  return apiPromise
}

export function LofiPlayer() {
  const { activeFocus, settings } = useApp()
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const playbackRef = useRef({ paused: activeFocus.isPaused, volume: settings.ambientVolume })
  const [error, setError] = useState(false)
  playbackRef.current = { paused: activeFocus.isPaused, volume: settings.ambientVolume }

  useEffect(() => {
    let cancelled = false
    let player: YouTubePlayer | null = null
    void loadYouTubeApi().then((api) => {
      if (cancelled || !hostRef.current) return
      const playerElement = document.createElement('div')
      hostRef.current.appendChild(playerElement)
      player = new api.Player(playerElement, {
        videoId: 'lTRiuFIWV54',
        width: '320',
        height: '200',
        playerVars: { playsinline: 1, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return
            playerRef.current = target
            target.setVolume(Math.round(playbackRef.current.volume * 100))
            if (!playbackRef.current.paused) target.playVideo()
          },
          onError: () => { if (!cancelled) setError(true) }
        }
      })
    }).catch(() => { if (!cancelled) setError(true) })

    return () => {
      cancelled = true
      playerRef.current = null
      player?.destroy()
    }
  }, [])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    player.setVolume(Math.round(settings.ambientVolume * 100))
    if (activeFocus.isPaused) player.pauseVideo()
    else player.playVideo()
  }, [activeFocus.isPaused, settings.ambientVolume])

  return (
    <section aria-label="Lo-fi music player" className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#333538] bg-[#1e1f20] p-4 sm:flex-row sm:items-center">
      <div className="w-full max-w-[320px] shrink-0 overflow-hidden rounded-xl bg-black [&_iframe]:h-[200px] [&_iframe]:w-full">
        <div ref={hostRef} />
      </div>
      <div className="space-y-2 text-sm text-[#e3e3e3]">
        <p className="font-semibold">Lo-fi & deep rain</p>
        <p className="text-xs leading-relaxed text-[#bdc1c6]">1 A.M Study Session by Lofi Girl, with rain layered underneath. If playback does not start automatically, press play on the video.</p>
        {error && <p role="alert" className="text-xs text-[#f28b82]">YouTube could not play this video here. It may require sign-in or be unavailable in this environment.</p>}
        <a className="inline-block text-xs text-[#8ab4f8] underline underline-offset-4" href="https://www.youtube.com/watch?v=lTRiuFIWV54" target="_blank" rel="noreferrer">Open on YouTube</a>
      </div>
    </section>
  )
}
