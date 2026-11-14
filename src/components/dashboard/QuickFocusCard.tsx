import React from 'react'
import { Timer, Zap, Play, Pause, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatSecondsToMMSS } from '../../utils/formatters'

export const QuickFocusCard: React.FC = () => {
  const {
    activeFocus,
    subjects,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    setActiveTab
  } = useApp()

  const defaultSub = subjects.find((s) => s.priority === 'high') || subjects[0]

  const handleLaunch = (preset: '45-10' | '5-min-starter' | '25-5') => {
    const minutes = preset === '45-10' ? 45 : preset === '25-5' ? 25 : 5
    const breakM = preset === '45-10' ? 10 : preset === '25-5' ? 5 : 3

    startFocusSession({
      subjectId: defaultSub.id,
      subjectName: defaultSub.name,
      taskTitle: `${defaultSub.name}: Deep Focus Session`,
      focusMinutes: minutes,
      breakMinutes: breakM,
      preset
    })
    setActiveTab('focus')
  }

  return (
    <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg text-[#e3e3e3]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2e3135]">
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4 text-[#8ab4f8]" />
          <h3 className="text-sm font-semibold text-[#e3e3e3]">Focus Launcher</h3>
        </div>
        <button
          onClick={() => setActiveTab('focus')}
          className="text-xs text-[#9aa0a6] hover:text-[#8ab4f8] flex items-center space-x-1 transition"
        >
          <span>Open Full Mode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {activeFocus.isActive ? (
        <div className="p-4 rounded-xl bg-[#131314] border border-[#333538] text-center">
          <span
            className={`text-[10px] font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
              activeFocus.isBreak
                ? 'bg-[#81c995]/10 text-[#81c995] border border-[#81c995]/30'
                : 'bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/30'
            }`}
          >
            {activeFocus.isBreak ? 'Restorative Break in Progress' : 'Active Study Session'}
          </span>
          <div className="text-3xl font-mono font-bold text-[#e3e3e3] my-2 tracking-wider">
            {formatSecondsToMMSS(activeFocus.remainingSeconds)}
          </div>
          <div className="text-xs text-[#9aa0a6] font-mono mb-3 truncate">
            {activeFocus.taskTitle}
          </div>

          <div className="flex items-center justify-center space-x-2">
            {activeFocus.isPaused ? (
              <button
                onClick={resumeFocusSession}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#81c995] text-[#131314] hover:bg-[#a8dab5] transition flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                onClick={pauseFocusSession}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#282a2d] hover:bg-[#333538] text-[#e3e3e3] border border-[#3c4043] transition flex items-center space-x-1"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('focus')}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#8ab4f8] text-[#131314] hover:bg-[#aecbfa] transition"
            >
              Maximize
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Preset 1: 45-10 */}
          <button
            onClick={() => handleLaunch('45-10')}
            className="w-full text-left p-3 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#8ab4f8] transition group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-[#e3e3e3] group-hover:text-[#8ab4f8] transition">
                  45m Study + 10m Break
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/20">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] mt-0.5">
                Ideal scientific rhythm for high retention problem solving
              </p>
            </div>
            <Play className="w-4 h-4 text-[#9aa0a6] group-hover:text-[#8ab4f8] transition shrink-0 ml-2" />
          </button>

          {/* Preset 2: 5-Min Starter */}
          <button
            onClick={() => handleLaunch('5-min-starter')}
            className="w-full text-left p-3 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#fdd663] transition group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-[#e3e3e3] group-hover:text-[#fdd663] transition">
                  5-Min Starter Boost
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#fdd663]/10 text-[#fdd663] border border-[#fdd663]/20">
                  Quick Start
                </span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] mt-0.5">
                Commit to just 5 minutes to beat procrastination resistance
              </p>
            </div>
            <Zap className="w-4 h-4 text-[#9aa0a6] group-hover:text-[#fdd663] transition shrink-0 ml-2" />
          </button>

          {/* Preset 3: 25-5 Classic Pomodoro */}
          <button
            onClick={() => handleLaunch('25-5')}
            className="w-full text-left p-3 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#81c995] transition group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-[#e3e3e3] group-hover:text-[#81c995] transition">
                  25m Pomodoro Sprint
                </span>
              </div>
              <p className="text-[11px] text-[#9aa0a6] mt-0.5">
                Fast sprints for quick review, flashcards and light revision
              </p>
            </div>
            <Play className="w-4 h-4 text-[#9aa0a6] group-hover:text-[#81c995] transition shrink-0 ml-2" />
          </button>
        </div>
      )}
    </div>
  )
}
