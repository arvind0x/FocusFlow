import React, { useState } from 'react'
import { X, ShieldAlert } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const LogDistractionModal: React.FC = () => {
  const { showLogDistractionModal, setShowLogDistractionModal, addDistractionLog } = useApp()

  const [app, setApp] = useState('Instagram Reels')
  const [minutes, setMinutes] = useState(15)
  const [category, setCategory] = useState<'social_media' | 'short_video' | 'gaming' | 'messaging' | 'daydreaming' | 'other'>('short_video')
  const [trigger, setTrigger] = useState('Notification ping during study')
  const [prevented, setPrevented] = useState(false)

  const quickApps = [
    { name: 'Instagram Reels', cat: 'short_video' as const },
    { name: 'YouTube Shorts/Videos', cat: 'short_video' as const },
    { name: 'Discord Gaming Server', cat: 'gaming' as const },
    { name: 'WhatsApp Web Chat', cat: 'messaging' as const },
    { name: 'Reddit / Feed Scrolling', cat: 'social_media' as const },
    { name: 'Daydreaming / Wandered', cat: 'daydreaming' as const }
  ]

  const quickMinuteOptions = [5, 10, 15, 25, 40, 60]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!app.trim()) return

    addDistractionLog({
      appOrWebsite: app.trim(),
      category,
      minutesLost: prevented ? 0 : minutes,
      trigger: trigger.trim() || 'Unplanned interruption',
      preventedByShield: prevented
    })

    setShowLogDistractionModal(false)
  }

  if (!showLogDistractionModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Log a Study Distraction</h3>
              <p className="text-[11px] text-zinc-400">Track wasted time to build self-awareness</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogDistractionModal(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              Source of Distraction
            </label>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {quickApps.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setApp(item.name)
                    setCategory(item.cat)
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg border text-xs truncate transition ${
                    app === item.name
                      ? 'bg-zinc-900 border-zinc-500 text-white font-medium'
                      : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={app}
              onChange={(e) => setApp(e.target.value)}
              placeholder="Or type custom app / site name"
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-zinc-300">
                Time Lost: <span className="text-rose-400 font-mono font-bold">{minutes} Minutes</span>
              </label>
              {prevented && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  (Prevented: 0m lost!)
                </span>
              )}
            </div>
            <div className="flex space-x-2 mb-2 font-mono">
              {quickMinuteOptions.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`flex-1 py-1 rounded-lg border text-xs font-semibold transition ${
                    minutes === m
                      ? 'bg-zinc-900 border-zinc-500 text-white'
                      : 'bg-black border-zinc-800 text-zinc-400'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="120"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              What Triggered This Distraction?
            </label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. Phone notification, Boredom, Difficult numerical"
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
            <div className="pr-2">
              <span className="text-xs font-semibold text-white block">
                Shield Intercepted This?
              </span>
              <p className="text-[11px] text-zinc-400">
                Check this if you stopped yourself or were alerted before losing study time.
              </p>
            </div>
            <input
              type="checkbox"
              checked={prevented}
              onChange={(e) => setPrevented(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowLogDistractionModal(false)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
            >
              Record Distraction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
