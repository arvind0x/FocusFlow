import React from 'react'
import {
  Timer,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bot,
  Zap,
  BarChart3,
  LogIn
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

export const LandingPage: React.FC = () => {
  const { setActiveTab, setShowOnboardingModal } = useApp()

  const handleGetStarted = () => {
    setShowOnboardingModal(true)
    setActiveTab('dashboard')
  }

  const handleSignIn = () => {
    setActiveTab('login')
  }

  return (
    <div className="min-h-screen text-white bg-black selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-black/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Timer className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-black text-sm tracking-tight text-white">FocusFlow</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              Student OS
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleSignIn}
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 transition"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Classes 9–12 & Competitive Exam Aspirant Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Study Smarter. Defeat Distractions.{' '}
          <span className="text-zinc-400">
            Reclaim Your Focus Hours.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Break out of the "relax for the whole day" burnout loop. FocusFlow pairs an intelligent feasible timetable generator with 45–10 focus sessions, an accountability companion, and an active distraction shield that synchronizes with your GitHub repository.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
          >
            <span>Start Free (No Signup Required)</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
          <button
            onClick={handleSignIn}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 transition"
          >
            <GitHubIcon className="w-3.5 h-3.5" />
            <span>Sign In with GitHub</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side Privacy</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>45–10 Study & Break Rhythm</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>GitHub Shield Sync</span>
          </div>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="mt-14 relative max-w-4xl mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-6 text-left shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-mono text-zinc-400 ml-2">focusflow --command-center</span>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-zinc-300 hover:text-white font-semibold flex items-center space-x-1"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Productive Time</span>
              <div className="text-lg font-bold text-white mt-0.5 font-mono">3h 45m</div>
              <span className="text-[10px] text-emerald-400">Measured</span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Time Wasted</span>
              <div className="text-lg font-bold text-rose-400 mt-0.5 font-mono">42m</div>
              <span className="text-[10px] text-rose-400">Distractions</span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Time Saved</span>
              <div className="text-lg font-bold text-emerald-400 mt-0.5 font-mono">+1h 18m</div>
              <span className="text-[10px] text-emerald-400">Reclaimed</span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Active Streak</span>
              <div className="text-lg font-bold text-white mt-0.5 font-mono">6 Days 🔥</div>
              <span className="text-[10px] text-zinc-400">Consistent</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <Bot className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-zinc-300">
                <strong className="text-white">Accountability Companion Active:</strong> "You have scheduled Physics: Rotational Motion (45m). Click below to launch distraction-free study!"
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-1.5 rounded-lg bg-white text-black font-bold whitespace-nowrap hover:bg-zinc-200 transition"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 3 Must-Have Features Section */}
      <section className="py-20 bg-zinc-950 border-t border-b border-zinc-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              Validation Before Building
            </span>
            <h2 className="text-3xl font-black text-white mt-3">
              Designed Around Real Student Interview Findings
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              High schoolers and competitive exam aspirants don't need rigid 14-hour static timetables. They need flexible, distraction-shielded systems that respect their true stamina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Feature 1
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Intelligent Feasible Timetable
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Generated around the student's actual free hours after school. Rotates high-difficulty numerical subjects with lighter revision and automatically reschedules incomplete tasks.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800">
                <em>"I make a timetable with goals so I know what to finish after school."</em> — Interview 1
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Feature 2
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  45–10 Rhythm & 5-Min Starter
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  45 minutes of dedicated focus followed by 10 minutes of genuine recharge. Plus the 5-Minute Procrastination Buster to get started when feeling overwhelmed or lazy.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800">
                <em>"When I don't feel like studying, I tell myself to study for just 5 minutes."</em> — Interview 5
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Feature 3
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Distraction Shield & GitHub Sync
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Tracks exact minutes lost to social media and short videos. Synchronizes shield rules with your GitHub repository and triggers a clear audio enforcer when break time expires.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800">
                <em>"The app shows time wasted that could be saved and stops distraction after break."</em> — Solution Spec
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-black border-t border-zinc-800 px-4 text-center">
        <h2 className="text-2xl font-black text-white">
          Ready to Reclaim 2+ Hours of Study Time Everyday?
        </h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
          Start your personalized study journey now. 100% free, private, and runs entirely in your browser.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-6 inline-flex items-center space-x-2 px-8 py-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
        >
          <span>Launch FocusFlow</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </section>
    </div>
  )
}
