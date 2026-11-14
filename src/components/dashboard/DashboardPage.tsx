import React from 'react'
import {
  Clock,
  Flame,
  Target,
  Timer,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getFormattedToday, formatMinutesToHours } from '../../utils/formatters'
import { StatsCard } from './StatsCard'
import { StudyBotCard } from './StudyBotCard'
import { TodayScheduleCard } from './TodayScheduleCard'
import { QuickFocusCard } from './QuickFocusCard'
import { ProductivityMiniChart } from './ProductivityMiniChart'

export const DashboardPage: React.FC = () => {
  const { profile, summary } = useApp()

  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
      ? 'Good afternoon'
      : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-rise pb-12 text-[#e3e3e3]">
      {/* Top Banner: Greeting, Date, and Goal Progress */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#9aa0a6]">
            <span>{profile.gradeOrExam}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#e3e3e3] tracking-tight mt-1">
            {greeting}, {profile.name}
          </h1>
          <p className="text-xs text-[#9aa0a6] mt-1.5 flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span>{getFormattedToday()}</span>
            <span>•</span>
            <span className="text-[#81c995] font-mono font-medium">{profile.streakDays} Day Study Streak</span>
          </p>
        </div>

        {/* Goal Progress Bar */}
        <div className="flex items-center space-x-4 bg-[#131314] p-4 rounded-xl border border-[#2e3135]">
          <div className="w-10 h-10 rounded-xl bg-[#282a2d] border border-[#3c4043] flex items-center justify-center text-white">
            <Target className="w-5 h-5 text-[#8ab4f8]" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-[#9aa0a6]">Daily Study Target</span>
              <span className="text-[#e3e3e3] font-bold ml-3">
                {formatMinutesToHours(summary.totalProductiveMinutes)} / {profile.targetDailyStudyHours}h
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-48 sm:w-56 h-1.5 bg-[#282a2d] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#81c995] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, summary.dailyGoalAdherencePercent)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#9aa0a6] mt-1">
              <span>{summary.dailyGoalAdherencePercent}% Completed</span>
              <span className="text-[#81c995] font-medium">
                {summary.dailyGoalAdherencePercent >= 100 ? 'Goal Crushed! ✓' : 'On Track'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Productive Focus"
          value={formatMinutesToHours(summary.totalProductiveMinutes)}
          subtext="Verified study sessions"
          icon={Timer}
          color="emerald"
          badge="Measured"
        />

        <StatsCard
          title="Time Wasted"
          value={formatMinutesToHours(summary.totalWastedMinutes)}
          subtext="Logged interruptions"
          icon={ShieldAlert}
          color="rose"
          badge="Distractions"
        />

        <StatsCard
          title="Time Saved"
          value={formatMinutesToHours(summary.totalSavedMinutes)}
          subtext="Distractions you blocked today"
          icon={ShieldCheck}
          color="emerald"
          badge="Blocked"
        />

        <StatsCard
          title="Completed Blocks"
          value={`${summary.sessionsCompletedToday}`}
          subtext="45m / 25m focused blocks"
          icon={CheckCircle2}
          color="white"
          badge="Sessions"
        />
      </div>

      {/* Accountability Companion Card */}
      <StudyBotCard />

      {/* Main Grid: Today's Timetable & Focus Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayScheduleCard />
          <ProductivityMiniChart />
        </div>

        <div className="space-y-6">
          <QuickFocusCard />

          {/* Key Principles Card */}
          <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg text-[#e3e3e3]">
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-[#2e3135]">
              <Zap className="w-4 h-4 text-[#8ab4f8]" />
              <h4 className="text-xs font-mono font-medium uppercase tracking-wider text-[#9aa0a6]">
                Core Study Principles
              </h4>
            </div>
            <div className="space-y-2.5 text-xs text-[#9aa0a6]">
              <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135]">
                <span className="font-medium text-[#e3e3e3] block mb-0.5">The 45–10 Formula:</span>
                Human attention drops sharply after 50 minutes. Taking a genuine 10-minute break resets cognitive fatigue.
              </div>
              <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135]">
                <span className="font-medium text-[#e3e3e3] block mb-0.5">The 5-Minute Starter Principle:</span>
                Overcome initial resistance by committing to study for just 5 minutes. 85% of students keep going once started!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
