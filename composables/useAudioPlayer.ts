import { ref, watch, onUnmounted } from 'vue'
import { Howl } from 'howler'

export type AudioSource = {
  id: string
  url: string
  title?: string
}

const currentSource = ref<AudioSource | null>(null)
const isPlaying = ref(false)
const isLoading = ref(false)
const isBuffering = ref(false)
const progress = ref(0)
const duration = ref(0)
const currentTime = ref(0)
const volume = ref(1.0)

let activeHowl: Howl | null = null
let progressInterval: any = null

export function useAudioPlayer() {
  const config = useRuntimeConfig()

  const stop = () => {
    if (activeHowl) {
      activeHowl.stop()
      activeHowl.unload()
      activeHowl = null
    }
    isPlaying.value = false
    isLoading.value = false
    isBuffering.value = false
    currentSource.value = null
    progress.value = 0
    currentTime.value = 0
    if (progressInterval) clearInterval(progressInterval)
  }

  const play = (source: AudioSource) => {
    if (currentSource.value?.id === source.id && activeHowl) {
      if (!isPlaying.value) {
        activeHowl.play()
      }
      return
    }

    stop()
    currentSource.value = source
    isLoading.value = true

    const fullUrl = source.url.startsWith('http') 
      ? source.url 
      : `${config.public.MEDIA_URL}${source.url}`

    activeHowl = new Howl({
      src: [fullUrl],
      html5: true, // Use HTML5 Audio for better streaming of large files
      format: ['mp3', 'wav', 'aac'],
      onload: () => {
        isLoading.value = false
        duration.value = activeHowl?.duration() || 0
      },
      onplay: () => {
        isPlaying.value = true
        startProgressTimer()
      },
      onpause: () => {
        isPlaying.value = false
      },
      onstop: () => {
        isPlaying.value = false
      },
      onend: () => {
        isPlaying.value = false
        if (progressInterval) clearInterval(progressInterval)
        // Hook for sequential autoplay could be here or handled via event
      },
      onloaderror: (id, err) => {
        console.error('Audio load error:', err)
        isLoading.value = false
      },
      onplayerror: (id, err) => {
        console.error('Audio play error:', err)
        activeHowl?.once('unlock', () => activeHowl?.play())
      }
    })

    activeHowl.play()
  }

  const pause = () => {
    if (activeHowl && isPlaying.value) {
      activeHowl.pause()
    }
  }

  const togglePlay = () => {
    if (isPlaying.value) pause()
    else if (activeHowl) activeHowl.play()
  }

  const seek = (time: number) => {
    if (activeHowl) {
      activeHowl.seek(time)
    }
  }

  const startProgressTimer = () => {
    if (progressInterval) clearInterval(progressInterval)
    progressInterval = setInterval(() => {
      if (activeHowl && isPlaying.value) {
        const current = activeHowl.seek() as number
        currentTime.value = current
        progress.value = (current / duration.value) * 100
        
        // Simple buffering detection: if playing but time isn't moving
        // (This is basic, Howler doesn't expose buffering state directly easily with HTML5 mode)
      }
    }, 100)
  }

  return {
    currentSource,
    isPlaying,
    isLoading,
    isBuffering,
    progress,
    duration,
    currentTime,
    volume,
    play,
    pause,
    stop,
    togglePlay,
    seek
  }
}
