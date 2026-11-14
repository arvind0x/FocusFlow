import React, { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Check
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PriorityLevel } from '../../types'

export const OnboardingModal: React.FC = () => {
  const {
    showOnboardingModal,
    setShowOnboardingModal,
    profile,
    updateProfile,
    subjects,
    generateSmartTimetable,
    setActiveTab
  } = useApp()

  const [step, setStep] = useState<number>(1)

  const [name, setName] = useState(profile.name)
  const [gradeOrExam, setGradeOrExam] = useState(profile.gradeOrExam)
  const [dailyHours, setDailyHours] = useState(profile.targetDailyStudyHours)
  const [focusDuration, setFocusDuration] = useState(profile.preferredFocusMinutes)
  const [breakDuration, setBreakDuration] = useState(profile.preferredBreakMinutes)
  const [companionName, setCompanionName] = useState(profile.companionName)
  const [companionTone, setCompanionTone] = useState(profile.companionTone)
  const [checkInInterval, setCheckInInterval] = useState(profile.checkInIntervalMinutes)

  const examOptions = [
    'Class 11 — JEE Main & Advanced',
    'Class 12 — Boards & Competitive Exam',
    'Class 11 & 12 — NEET Aspirant',
    'Class 10 — Board Exam Preparation',
    'Class 9 — Foundation & Olympiads',
    'College Entrance / General Competitive'
  ]

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    subjects.map((s) => s.name)
  )

  const defaultSubjectPool = [
    { name: 'Physics', color: '#3b82f6', priority: 'high' as PriorityLevel },
    { name: 'Chemistry', color: '#10b981', priority: 'high' as PriorityLevel },
    { name: 'Mathematics', color: '#8b5cf6', priority: 'high' as PriorityLevel },
    { name: 'Biology', color: '#14b8a6', priority: 'high' as PriorityLevel },
    { name: 'Computer Science', color: '#f59e0b', priority: 'medium' as PriorityLevel },
    { name: 'English', color: '#ec4899', priority: 'low' as PriorityLevel }
  ]

  const toggleSubject = (subName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subName) ? prev.filter((s) => s !== subName) : [...prev, subName]
    )
  }

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Aarav Sharma',
      gradeOrExam,
      targetDailyStudyHours: dailyHours,
      preferredFocusMinutes: focusDuration,
      preferredBreakMinutes: breakDuration,
      companionName: companionName.trim() || 'StudyBot',
      companionTone,
      checkInIntervalMinutes: checkInInterval,
      onboardingCompleted: true
    })

    generateSmartTimetable({
      startHour: 16,
      endHour: Math.min(22, 16 + Math.ceil(dailyHours)),
      focusDurationMinutes: focusDuration,
      breakDurationMinutes: breakDuration,
      selectedSubjectIds: []
    })

    setShowOnboardingModal(false)
    setActiveTab('dashboard')
  }

  if (!showOnboardingModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-black border border-zinc-700 flex items-center justify-center text-white font-mono text-xs">
              0{step}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Student Onboarding</h2>
              <p className="text-[11px] text-zinc-400">Step {step} of 4</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-white' : i < step ? 'w-3 bg-zinc-600' : 'w-3 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Profile & Exam Target */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Welcome to FocusFlow
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  Tell us about your study goals
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  We customize your daily schedule, focus presets, and accountability checks around your specific academic target.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1.5">
                    Your Preferred Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav, Priya, Rohan, Maya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-600"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                    Stored 100% locally in your browser.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1.5">
                    Target Class or Competitive Exam
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {examOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setGradeOrExam(opt)}
                        className={`text-left p-3 rounded-xl border text-xs transition ${
                          gradeOrExam === opt
                            ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                            : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subjects Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">
                  Select your active subjects
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Pick the subjects you need to balance. Our engine automatically alternates high-priority subjects into peak focus windows.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {defaultSubjectPool.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.name)
                  return (
                    <button
                      key={sub.name}
                      type="button"
                      onClick={() => toggleSubject(sub.name)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-500 text-white shadow-sm'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span>{sub.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  )
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-400">
                <strong className="text-white">Smart Rotation:</strong> High-priority subjects like Physics & Math are spaced between lighter review sessions to avoid mental fatigue.
              </div>
            </div>
          )}

          {/* STEP 3: Available Hours & Rhythm */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">
                  Daily study hours & focus rhythm
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Validated in student interviews: realistic timetables prevent the "relax for the whole day" burnout cycle.
                </p>
              </div>

              <div className="space-y-4 pt-1 text-xs">
                <div className="p-4 rounded-xl bg-black border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-zinc-300">
                      Available Self-Study Hours Per Day
                    </label>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {dailyHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                    <span>2 hrs (Light)</span>
                    <span>5.5 hrs (Recommended)</span>
                    <span>10 hrs (Sprint)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-2">
                    Preferred Focus & Break Rhythm
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 45-10 Rule */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDuration(45)
                        setBreakDuration(10)
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        focusDuration === 45 && breakDuration === 10
                          ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                        <span>45–10 Rule</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Interview Pick
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        45 min deep focus + 10 min restorative break. Optimal for high schoolers.
                      </p>
                    </button>

                    {/* 25-5 Pomodoro */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDuration(25)
                        setBreakDuration(5)
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        focusDuration === 25 && breakDuration === 5
                          ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">
                        25–5 Pomodoro
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        25 min sprint + 5 min quick pause. Great for high distraction days.
                      </p>
                    </button>

                    {/* 50-10 Extended */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDuration(50)
                        setBreakDuration(10)
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        focusDuration === 50 && breakDuration === 10
                          ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">
                        50–10 Extended
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        50 min uninterrupted work. Excellent for solving full mock papers.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Accountability Bot */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">
                  Accountability Companion & Shield
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Addresses the key interview finding: <em>"Asked sibling to check on me so I stay focused."</em> FocusFlow provides an AI companion to keep you accountable!
                </p>
              </div>

              <div className="space-y-4 pt-1 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-300 mb-1.5">
                      Companion Name
                    </label>
                    <input
                      type="text"
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      placeholder="e.g. StudyBot, Mentor Max"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-300 mb-1.5">
                      Check-In Frequency
                    </label>
                    <select
                      value={checkInInterval}
                      onChange={(e) => setCheckInInterval(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white"
                    >
                      <option value={15}>Every 15 minutes (Strict)</option>
                      <option value={20}>Every 20 minutes (Balanced)</option>
                      <option value={30}>Every 30 minutes (Gentle)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1.5">
                    Companion Personality Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['encouraging', 'friendly', 'strict'] as const).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setCompanionTone(tone)}
                        className={`p-2.5 rounded-xl border text-xs capitalize transition ${
                          companionTone === tone
                            ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                            : 'bg-black border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <strong className="text-white block">Ready to Launch!</strong>
                    Your personalized study schedule will be generated and your focus dashboard will open immediately.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowOnboardingModal(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Skip for now
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Complete Setup & Launch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
