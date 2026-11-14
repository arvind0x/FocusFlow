import React from 'react'
import { Wrench, ArrowLeft, ShieldAlert, Sparkles, Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const DistractionPage: React.FC = () => {
  const { setActiveTab } = useApp()

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 animate-fade-rise text-center">
      {/* Studio Card Container */}
      <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient gradient backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Wrench / Maintenance Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#282a2d] border border-[#3c4043] flex items-center justify-center mx-auto mb-6 text-amber-400">
          <Wrench className="w-8 h-8 text-amber-400" />
        </div>

        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-medium mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>Status: Under Maintenance</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#e3e3e3] mb-3">
          Distraction Shield
        </h1>

        {/* Description */}
        <p className="text-sm text-[#9aa0a6] max-w-lg mx-auto leading-relaxed mb-8">
          This feature is currently undergoing maintenance. System integrity checks and browser isolation protocols are being upgraded.
        </p>

        {/* Informational Details */}
        <div className="text-left bg-[#131314] rounded-xl p-4 border border-[#2e3135] mb-8 space-y-2.5 text-xs text-[#9aa0a6]">
          <div className="flex items-center space-x-2 text-[#e3e3e3] font-medium">
            <Sparkles className="w-4 h-4 text-[#8ab4f8]" />
            <span>Active Modules Status</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#2e3135]">
            <span>Pomodoro 45–10 Focus Engine</span>
            <span className="text-[#81c995] font-mono font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Adaptive Timetable Generator</span>
            <span className="text-[#81c995] font-mono font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Performance & Retention Analytics</span>
            <span className="text-[#81c995] font-mono font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Distraction Shield & App Blocker</span>
            <span className="text-amber-400 font-mono font-medium">Under Maintenance</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#282a2d] hover:bg-[#333538] text-[#e3e3e3] border border-[#3c4043] hover:border-[#8ab4f8] transition font-medium text-xs shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  )
}
