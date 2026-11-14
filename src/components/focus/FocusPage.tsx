import React, { useState, useEffect } from 'react'
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Volume2,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Coffee,
  ShieldCheck,
  CheckSquare,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useApp } from '../../context/AppContext'
import { formatSecondsToMMSS } from '../../utils/formatters'
import { soundManager } from '../../utils/sound'

export const FocusPage: React.FC = () => {
  const {
    activeFocus,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    endFocusSession,
    skipToBreak,
    endBreakEarly,
    subjects,
    settings,
    updateSettings
  } = useApp()

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    activeFocus.subjectId || subjects[0]?.id || ''
  )
  const [customTaskTitle, setCustomTaskTitle] = useState<string>(
    activeFocus.taskTitle || 'Target Problem Set & Formula Drills'
  )
  const [customFocusMins, setCustomFocusMins] = useState<number>(45)
  const [customBreakMins, setCustomBreakMins] = useState<number>(10)
  const [microGoals, setMicroGoals] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Review chapter formulas & key diagrams', done: true },
    { id: '2', text: 'Solve questions 1 through 10 without looking at solutions', done: false },
    { id: '3', text: 'Note down mistakes in error notebook', done: false }
  ])
  const [newGoalInput, setNewGoalInput] = useState<string>('')

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    if (activeFocus.isBreak && activeFocus.breakRemainingSeconds === activeFocus.totalBreakSeconds) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch {
        // ignore
      }
    }
  }, [activeFocus.isBreak, activeFocus.breakRemainingSeconds, activeFocus.totalBreakSeconds])

  const handleStartPreset = (preset: '45-10' | '25-5' | '5-min-starter' | 'custom') => {
    const focusM = preset === '45-10' ? 45 : preset === '25-5' ? 25 : preset === '5-min-starter' ? 5 : customFocusMins
    const breakM = preset === '45-10' ? 10 : preset === '25-5' ? 5 : preset === '5-min-starter' ? 3 : customBreakMins

    const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0]

    startFocusSession({
      subjectId: sub.id,
      subjectName: sub.name,
      taskTitle: customTaskTitle.trim() || `${sub.name}: Focused Study Session`,
      focusMinutes: focusM,
      breakMinutes: breakM,
      preset
    })
  }

  const handleAddMicroGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalInput.trim()) return
    setMicroGoals((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newGoalInput.trim(), done: false }
    ])
    setNewGoalInput('')
  }

  const toggleGoal = (id: string) => {
    setMicroGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    )
  }

  const removeGoal = (id: string) => {
    setMicroGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const currentTotal = activeFocus.isBreak
    ? activeFocus.totalBreakSeconds
    : activeFocus.totalDurationSeconds
  const currentRemaining = activeFocus.isBreak
    ? activeFocus.breakRemainingSeconds
    : activeFocus.remainingSeconds
  const progressRatio = currentTotal > 0 ? (currentTotal - currentRemaining) / currentTotal : 0

  const radius = 130
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progressRatio * circumference

  return (
    <div
      className={`space-y-6 animate-fade-rise transition-all pb-16 text-[#e3e3e3] ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#131314] p-6 overflow-y-auto' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-[#8ab4f8]" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#e3e3e3]">
              {activeFocus.isBreak ? 'Restorative Break Period' : 'Distraction-Free Focus Studio'}
            </h1>
          </div>
          <p className="text-xs text-[#9aa0a6] mt-1">
            {activeFocus.isBreak
              ? 'Step away from screen, stretch, and let your brain consolidate learned material'
              : 'Immersive focus environment with 45–10 rhythm, ambient audio & tab-away tracking'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Ambient Sound Selector */}
          <div className="flex items-center space-x-1.5 bg-[#131314] px-3 py-1.5 rounded-xl border border-[#2e3135] text-xs">
            <Volume2 className="w-4 h-4 text-[#8ab4f8]" />
            <select
              value={settings.ambientSound}
              onChange={(e) =>
                updateSettings({
                  ambientSound: e.target.value as 'none' | 'rain' | 'whitenoise' | 'lofi' | 'waves'
                })
              }
              className="bg-transparent text-[#e3e3e3] focus:outline-none text-xs cursor-pointer font-mono"
            >
              <option value="none" className="bg-[#1e1f20]">Mute</option>
              <option value="rain" className="bg-[#1e1f20]">🌧️ Deep Rain</option>
              <option value="whitenoise" className="bg-[#1e1f20]">📻 Pure White Noise</option>
              <option value="lofi" className="bg-[#1e1f20]">🎧 Lo-Fi Hum</option>
              <option value="waves" className="bg-[#1e1f20]">🌊 Ocean Waves</option>
            </select>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#131314] border border-[#2e3135] hover:bg-[#282a2d] text-[#e3e3e3] transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus / Break Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TIMER DISPLAY CARD */}
        <div className="lg:col-span-2 rounded-2xl border border-[#333538] bg-[#1e1f20] p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle status indicator */}
          <div className="mb-6 flex items-center space-x-2">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                activeFocus.isBreak
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : activeFocus.isActive
                  ? activeFocus.isPaused
                    ? 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                    : 'bg-zinc-900 text-white border border-zinc-700'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}
            >
              {activeFocus.isBreak ? (
                <>
                  <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Break Time (Recharge)</span>
                </>
              ) : activeFocus.isActive ? (
                activeFocus.isPaused ? (
                  <span>Session Paused</span>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Focusing: {activeFocus.subjectName}</span>
                  </>
                )
              ) : (
                <span>Ready to Focus</span>
              )}
            </span>
          </div>

          {/* Circular Countdown Progress */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-zinc-900"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className={`transition-all duration-1000 ${
                  activeFocus.isBreak
                    ? 'stroke-emerald-400'
                    : 'stroke-white'
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Time Display */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                {formatSecondsToMMSS(currentRemaining)}
              </span>
              <span className="text-xs font-mono font-semibold text-zinc-400 mt-2">
                {activeFocus.isBreak
                  ? activeFocus.breakRemainingSeconds === 0
                    ? '🚨 BREAK IS OVER! Return to study'
                    : 'Restorative break remaining'
                  : activeFocus.isActive
                  ? `${Math.round(progressRatio * 100)}% of focus block done`
                  : 'Select preset or click Start'}
              </span>
            </div>
          </div>

          {/* Break-Over Enforcer Alert Banner */}
          {activeFocus.isBreak && activeFocus.breakRemainingSeconds === 0 && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center max-w-md animate-bounce">
              <strong className="block text-sm font-bold text-rose-200">
                🚨 BREAK-ENDING ENFORCER TRIGGERED!
              </strong>
              Your break has concluded. Close distracting apps and resume your study block now!
            </div>
          )}

          {/* Current Task Description */}
          <div className="mt-4 text-center max-w-md px-4">
            <h3 className="text-base font-bold text-white truncate">
              {activeFocus.isActive ? activeFocus.taskTitle : customTaskTitle}
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Preset: {activeFocus.preset || '45–10 Rule'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!activeFocus.isActive ? (
              <button
                onClick={() => handleStartPreset('45-10')}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-zinc-200 shadow-xl transition"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Start 45–10 Session</span>
              </button>
            ) : activeFocus.isBreak ? (
              <>
                <button
                  onClick={endBreakEarly}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>End Break & Finish Session</span>
                </button>
                <button
                  onClick={() => endFocusSession(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                >
                  Save & Exit
                </button>
              </>
            ) : (
              <>
                {activeFocus.isPaused ? (
                  <button
                    onClick={resumeFocusSession}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
                  >
                    <Play className="w-4 h-4 fill-black text-black" />
                    <span>Resume Focus</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseFocusSession}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white transition"
                  >
                    <Pause className="w-4 h-4 fill-white text-white" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={skipToBreak}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Take Break Now</span>
                </button>

                <button
                  onClick={() => endFocusSession(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
                >
                  End Early
                </button>
              </>
            )}
          </div>
        </div>

        {/* SIDEBAR: PRESETS & MICRO-GOALS CHECKLIST */}
        <div className="space-y-6">
          {/* Quick Presets Picker */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg text-white">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Study Rhythm Presets
            </h4>
            <div className="space-y-2">
              {/* 45-10 */}
              <button
                onClick={() => handleStartPreset('45-10')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  activeFocus.preset === '45-10' && activeFocus.isActive
                    ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                    : 'bg-black border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold">45–10 Rule</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Core
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    45m deep problem solving + 10m break
                  </p>
                </div>
                <Play className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              {/* 5-Min Starter */}
              <button
                onClick={() => handleStartPreset('5-min-starter')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  activeFocus.preset === '5-min-starter' && activeFocus.isActive
                    ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                    : 'bg-black border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold">5-Minute Starter</span>
                    <Zap className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Commit to just 5 mins to break resistance.
                  </p>
                </div>
                <Play className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              {/* 25-5 Pomodoro */}
              <button
                onClick={() => handleStartPreset('25-5')}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  activeFocus.preset === '25-5' && activeFocus.isActive
                    ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                    : 'bg-black border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <span className="text-xs font-bold">25–5 Sprint</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    25m focus sprint + 5m pause
                  </p>
                </div>
                <Play className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Micro-Goals Checklist */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Micro-Goals for this Session
                </h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                {microGoals.filter((g) => g.done).length}/{microGoals.length}
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              {microGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start justify-between p-2 rounded-xl bg-black border border-zinc-800 text-xs"
                >
                  <label className="flex items-start space-x-2 cursor-pointer flex-1 mr-2">
                    <input
                      type="checkbox"
                      checked={goal.done}
                      onChange={() => toggleGoal(goal.id)}
                      className="mt-0.5 rounded accent-white cursor-pointer"
                    />
                    <span className={goal.done ? 'line-through text-zinc-600' : 'text-zinc-200'}>
                      {goal.text}
                    </span>
                  </label>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="text-zinc-600 hover:text-rose-400 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMicroGoal} className="flex space-x-1.5">
              <input
                type="text"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                placeholder="Add micro-task (e.g. Q1-5)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Tab Away Shield Status */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white">Distraction Shield Armed:</strong>
              If you leave this tab during your focus session, FocusFlow detects the tab-switch and prompts you to log any time wasted upon return.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
