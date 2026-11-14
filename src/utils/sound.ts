// Web Audio API generator for sound effects and distraction-free ambient noise

class SoundManager {
  private ctx: AudioContext | null = null
  private ambientSource: AudioNode | null = null
  private ambientGain: GainNode | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  playStartChime() {
    const audio = new Audio('/focus-start.mp3')
    void audio.play().catch(() => {
      // Audio may be blocked by the browser.
    })
  }

  // Play celebratory chime for completed study session
  playCompletionFanfare() {
    try {
      const ctx = this.getContext()
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      const now = ctx.currentTime

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.12)

        gain.gain.setValueAtTime(0.01, now + idx * 0.12)
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.12 + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.12)
        osc.stop(now + idx * 0.12 + 1.5)
      })
    } catch {
      // Ignore audio error
    }
  }

  // Play break-ending chime (Distinct, attention-grabbing chime to prompt student back to study)
  playBreakEndingAlert() {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      // Double pulse alert chime
      ;[0, 0.28, 0.56].forEach((offset) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'square'
        osc.frequency.setValueAtTime(880, now + offset) // A5
        osc.frequency.exponentialRampToValueAtTime(440, now + offset + 0.2)

        gain.gain.setValueAtTime(0.01, now + offset)
        gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + offset)
        osc.stop(now + offset + 0.26)
      })
    } catch {
      // Ignore
    }
  }

  // Start continuous ambient noise (Brownian noise / Rain simulation)
  startAmbient(type: 'rain' | 'whitenoise' | 'lofi' | 'waves', volume = 0.3) {
    this.stopAmbient()
    try {
      const ctx = this.getContext()
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        if (type === 'rain' || type === 'waves') {
          // Brown noise filter approximation (warm low-frequency hum like heavy rain)
          lastOut = (lastOut + 0.02 * white) / 1.02
          data[i] = lastOut * 3.5
        } else if (type === 'lofi') {
          // Low-pass filtered noise with slight pulsation
          lastOut = (lastOut + 0.04 * white) / 1.04
          data[i] = lastOut * 2.5
        } else {
          // White noise
          data[i] = white * 0.25
        }
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime)

      // Add slight low-pass filter for soothing tone
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = type === 'whitenoise' ? 2400 : 800

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start()
      this.ambientSource = noise
      this.ambientGain = gain
    } catch {
      // Audio failed
    }
  }

  setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime)
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop()
        this.ambientSource.disconnect()
      } catch {
        // already stopped
      }
      this.ambientSource = null
    }
  }
}

export const soundManager = new SoundManager()
