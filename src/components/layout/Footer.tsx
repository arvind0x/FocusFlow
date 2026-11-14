import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp()

  return (
    <footer className="w-full border-t border-zinc-800 bg-black py-10 mt-20 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-mono text-[10px] font-bold">
                FF
              </div>
              <span className="font-bold text-sm text-white">FocusFlow</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-zinc-400">
                YIIC Week 1 Validated
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs max-w-md">
              Designed for Classes 9–12 and competitive-exam aspirants to eliminate study distractions, enforce the 45–10 focus rhythm, generate feasible timetables, and quantify wasted time saved.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Privacy: Your study logs never leave your device.</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-mono font-semibold mb-3 text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition">
                  Command Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('timetable')} className="hover:text-white transition">
                  Smart Timetable Generator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('focus')} className="hover:text-white transition">
                  45–10 Focus Mode & Soundscapes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('distraction')} className="hover:text-white transition">
                  Distraction Shield & GitHub Sync
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-white transition">
                  Productive vs Wasted Time Analytics
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-semibold mb-3 text-xs uppercase tracking-wider">Interview Insights</h4>
            <div className="space-y-2 text-[11px] text-zinc-400">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="font-semibold text-zinc-200">45–10 Focus Preset:</span>
                <p>45 minutes dedicated deep work followed by 10 minutes restorative break.</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="font-semibold text-zinc-200">5-Minute Starter Rule:</span>
                <p>Overcomes initial study inertia by committing to just 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div>
            Built with modern web standards (React 19, TypeScript, Tailwind CSS, Web Audio API).
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('landing')} className="hover:text-white transition">
              Landing Page
            </button>
            <button onClick={() => setActiveTab('login')} className="hover:text-white transition">
              Login & GitHub Sync
            </button>
            <button onClick={() => setActiveTab('settings')} className="hover:text-white transition">
              Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
