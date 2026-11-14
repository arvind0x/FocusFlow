import React from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const TabAwayAlertModal: React.FC = () => {
  const { tabAwayNotice, dismissTabAwayNotice } = useApp()

  if (!tabAwayNotice || !tabAwayNotice.show) return null

  const minutes = Math.round(tabAwayNotice.seconds / 60)
  const displayTime =
    tabAwayNotice.seconds < 60
      ? `${tabAwayNotice.seconds} seconds`
      : `${minutes} minute${minutes > 1 ? 's' : ''}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Study Session Interrupted</h3>
            <p className="text-xs text-zinc-400">
              You navigated away from this study tab for <span className="text-white font-mono font-semibold">{displayTime}</span>.
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-6 leading-relaxed bg-black p-3 rounded-xl border border-zinc-800">
          To keep your productivity analytics accurate and build discipline, tell us what happened:
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => dismissTabAwayNotice(false)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
          >
            <span>It was study-related (PDF, Reference, Calculator)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => dismissTabAwayNotice(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            <span>It was a distraction (Social media, chat, browsing)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              + Log {displayTime}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
