import React, { useState } from 'react'
import {
  Bot,
  Sparkles,
  CheckCircle,
  Clock,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const StudyBotCard: React.FC = () => {
  const { profile, summary, startFocusSession, subjects, setActiveTab } = useApp()
  const [botMessage, setBotMessage] = useState<string | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false)

  const tips = [
    '5-Minute Rule: If you don\'t feel like studying, just commit to 5 minutes. The momentum will carry you forward!',
    '45–10 Rhythm: After 45 minutes of heavy problem-solving, take 10 minutes off. Stand up, stretch, and drink water.',
    'Focus Environment: Put your smartphone in another room or out of arm\'s reach during focus blocks.',
    'Active Recall: Don\'t just re-read notes. Close the book and write the core formulas from memory.'
  ]

  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setBotMessage(`Accountability check verified for ${profile.name}! Your streak is safe. Keep pushing!`)
    setTimeout(() => setIsCheckedIn(false), 5000)
  }

  const handleLazy = () => {
    const mathOrPhy = subjects.find((s) => s.priority === 'high') || subjects[0]
    setBotMessage(
      `Feeling unmotivated? That's completely normal! Let's trigger the 5-Minute Rule. Commit to just 5 minutes on ${mathOrPhy.name}. Click Start below!`
    )
  }

  const handleTip = () => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setBotMessage(randomTip)
  }

  const handleStart5Min = () => {
    const targetSub = subjects[0]
    startFocusSession({
      subjectId: targetSub.id,
      subjectName: targetSub.name,
      taskTitle: `${targetSub.name}: 5-Minute Kickstart Warm-up`,
      focusMinutes: 5,
      breakMinutes: 3,
      preset: '5-min-starter'
    })
    setActiveTab('focus')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1e1f20] border border-[#333538] p-5 shadow-lg text-[#e3e3e3]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Bot Avatar */}
        <div className="flex items-center space-x-3.5">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl bg-[#282a2d] border border-[#3c4043] flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#8ab4f8] animate-float" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#81c995] rounded-full border-2 border-[#1e1f20]" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-[#e3e3e3]">FocusBot Companion</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#131314] text-[#81c995] border border-[#2e3135]">
                Accountability Active
              </span>
            </div>
            <p className="text-xs text-[#9aa0a6] mt-0.5">
              Trained on student consistency habits & anti-procrastination behavioral psychology
            </p>
          </div>
        </div>

        {/* Companion Micro Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCheckIn}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center space-x-1.5 ${
              isCheckedIn
                ? 'bg-[#81c995]/20 text-[#81c995] border-[#81c995]/40'
                : 'bg-[#131314] hover:bg-[#282a2d] text-[#e3e3e3] border-[#333538]'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#81c995]" />
            <span>Check In Streak</span>
          </button>

          <button
            onClick={handleLazy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131314] hover:bg-[#282a2d] text-[#e3e3e3] border border-[#333538] transition flex items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#fdd663]" />
            <span>"I Feel Lazy"</span>
          </button>

          <button
            onClick={handleTip}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131314] hover:bg-[#282a2d] text-[#e3e3e3] border border-[#333538] transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>Study Tip</span>
          </button>
        </div>
      </div>

      {/* Bot Message Box */}
      {botMessage && (
        <div className="mt-4 pt-3 border-t border-[#2e3135] flex items-start justify-between gap-4 animate-fade-rise">
          <p className="text-xs text-[#e3e3e3] leading-relaxed bg-[#131314] p-3 rounded-xl border border-[#2e3135] flex-1">
            💬 {botMessage}
          </p>
          {botMessage.includes('5-Minute') && (
            <button
              onClick={handleStart5Min}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#8ab4f8] text-[#131314] hover:bg-[#aecbfa] transition flex items-center space-x-1 shrink-0 self-center font-mono"
            >
              <span>Start 5m</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
