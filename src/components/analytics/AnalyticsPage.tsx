import React, { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Target,
  Clock,
  Flame,
  Award
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatMinutesToHours } from '../../utils/formatters'

export const AnalyticsPage: React.FC = () => {
  const { summary, focusSessions, subjects, distractionLogs, profile } = useApp()
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all')
  const [chartMode, setChartMode] = useState<'bars' | 'area'>('area')
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; prod: number; waste: number } | null>(null)

  const subjectStats = subjects.map((sub) => {
    const subSessions = focusSessions.filter((s) => s.subjectId === sub.id)
    const minutes = Math.round(
      subSessions.reduce((acc, s) => acc + s.actualDurationSeconds, 0) / 60
    )
    return {
      ...sub,
      totalMinutes: minutes
    }
  })

  const totalTrackedMinutes = subjectStats.reduce((acc, s) => acc + s.totalMinutes, 0)
  const totalSubjectMinutes = totalTrackedMinutes || 1
  const highPriorityMinutes = subjectStats
    .filter((s) => s.priority === 'high')
    .reduce((acc, s) => acc + s.totalMinutes, 0)

  const filteredSessions = focusSessions.filter((s) =>
    selectedSubjectFilter === 'all' ? true : s.subjectId === selectedSubjectFilter
  )

  const exportCSV = () => {
    const headers = 'ID,Subject,Task,ActualMinutes,TargetMinutes,BreakMinutes,StartedAt,Interruptions,Rating\n'
    const rows = focusSessions
      .map(
        (s) =>
          `"${s.id}","${s.subjectName}","${s.taskTitle.replace(/"/g, '""')}",${Math.round(
            s.actualDurationSeconds / 60
          )},${s.targetDurationMinutes},${s.breakDurationMinutes},"${s.startedAt}",${
            s.interruptedCount
          },${s.rating || 5}`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focusflow-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  // Points calculation for SVG Area Chart
  const maxVal = Math.max(...summary.weeklyTrend.map((d) => Math.max(d.productiveMinutes, d.goalMinutes)), 360)
  const chartWidth = 540
  const chartHeight = 180
  const paddingX = 40
  const paddingY = 30

  const trendPoints = summary.weeklyTrend.map((d, i) => {
    const x = paddingX + i * ((chartWidth - paddingX * 2) / (summary.weeklyTrend.length - 1))
    const y = chartHeight - paddingY - (d.productiveMinutes / maxVal) * (chartHeight - paddingY * 2)
    return { x, y, day: d.day, prod: d.productiveMinutes, waste: d.wastedMinutes }
  })

  const pathD = trendPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  )
  const areaD = `${pathD} L ${trendPoints[trendPoints.length - 1].x} ${chartHeight - paddingY} L ${trendPoints[0].x} ${chartHeight - paddingY} Z`

  // Radial Progress parameters
  const scorePercent = summary.focusScorePercent
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference

  return (
    <div className="space-y-6 animate-fade-rise text-[#e3e3e3]">
      {/* Google AI Studio Inspired Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#282a2d] border border-[#3c4043] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#8ab4f8]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#e3e3e3]">
                Performance & Analytics Studio
              </h1>
              <p className="text-xs text-[#9aa0a6] mt-0.5">
                Quantified metrics comparing verified study sessions against distraction loss and reclaimed hours
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#282a2d] hover:bg-[#333538] text-[#e3e3e3] border border-[#3c4043] hover:border-[#8ab4f8] transition self-start sm:self-auto shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#81c995]" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Methodology Notice Banner */}
      <div className="p-4 rounded-xl bg-[#1e1f20] border border-[#2e3135] flex items-start space-x-3 text-xs text-[#9aa0a6]">
        <Sparkles className="w-4 h-4 text-[#8ab4f8] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[#e3e3e3]">Measurement Methodology:</span>{' '}
          <strong className="text-[#81c995]">Productive Focus</strong> is tracked by real timer execution and active study tasks.{' '}
          <strong className="text-[#f28b82]">Logged Distraction</strong> tracks recorded interruptions and tab leaves.{' '}
          <strong className="text-[#8ab4f8]">Time Saved</strong> estimates doomscroll avoidance based on the student's 45–10 interval rhythm.
        </div>
      </div>

      {/* 4 TOP STUDIO METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] hover:border-[#81c995]/50 transition shadow-sm group">
          <div className="flex items-center justify-between text-xs font-mono font-medium text-[#81c995] uppercase tracking-wider mb-2">
            <span>Productive Hours</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#81c995]/10 text-[#81c995] border border-[#81c995]/20">
              Verified
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#e3e3e3] tracking-tight">
            {formatMinutesToHours(summary.totalProductiveMinutes)}
          </div>
          <p className="text-[11px] text-[#9aa0a6] mt-1.5 flex items-center space-x-1">
            <span className="text-[#81c995] font-semibold">●</span>
            <span>{summary.dailyGoalAdherencePercent}% of daily target achieved</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] hover:border-[#f28b82]/50 transition shadow-sm group">
          <div className="flex items-center justify-between text-xs font-mono font-medium text-[#f28b82] uppercase tracking-wider mb-2">
            <span>Time Wasted</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f28b82]/10 text-[#f28b82] border border-[#f28b82]/20">
              Logged
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#e3e3e3] tracking-tight">
            {formatMinutesToHours(summary.totalWastedMinutes)}
          </div>
          <p className="text-[11px] text-[#9aa0a6] mt-1.5 flex items-center space-x-1">
            <span className="text-[#f28b82] font-semibold">●</span>
            <span>{distractionLogs.length} logged interruption occurrences</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] hover:border-[#8ab4f8]/50 transition shadow-sm group">
          <div className="flex items-center justify-between text-xs font-mono font-medium text-[#8ab4f8] uppercase tracking-wider mb-2">
            <span>Net Time Saved</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/20">
              Estimated
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#e3e3e3] tracking-tight">
            +{formatMinutesToHours(summary.totalSavedMinutes)}
          </div>
          <p className="text-[11px] text-[#9aa0a6] mt-1.5 flex items-center space-x-1">
            <span className="text-[#8ab4f8] font-semibold">●</span>
            <span>Reclaimed through structured 45–10 intervals</span>
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] hover:border-[#fdd663]/50 transition shadow-sm group">
          <div className="flex items-center justify-between text-xs font-mono font-medium text-[#fdd663] uppercase tracking-wider mb-2">
            <span>Focus Score</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#fdd663]/10 text-[#fdd663] border border-[#fdd663]/20">
              Discipline
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#e3e3e3] tracking-tight">
            {summary.hasActivity ? `${summary.focusScorePercent}%` : '—'}
          </div>
          <p className="text-[11px] text-[#9aa0a6] mt-1.5 flex items-center space-x-1">
            <span className="text-[#fdd663] font-semibold">●</span>
            <span>Current streak: {profile.streakDays} consecutive days</span>
          </p>
        </div>
      </div>

      {/* TWO PRIMARY VISUALIZATIONS: ANIMATED TREND GRAPH & RADIAL ADHERENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ANIMATED TREND GRAPH (2 COLUMNS) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#2e3135] gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#8ab4f8]" />
                <h3 className="text-sm font-semibold text-[#e3e3e3]">Weekly Study Progression</h3>
              </div>
              <p className="text-xs text-[#9aa0a6] mt-0.5">
                Daily productive focus minutes vs daily target ({profile.targetDailyStudyHours}h)
              </p>
            </div>

            {/* Toggle Mode */}
            <div className="flex items-center bg-[#131314] p-0.5 rounded-lg border border-[#2e3135] text-[11px]">
              <button
                onClick={() => setChartMode('area')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  chartMode === 'area'
                    ? 'bg-[#282a2d] text-[#e3e3e3] shadow-sm'
                    : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                Smooth Curve
              </button>
              <button
                onClick={() => setChartMode('bars')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  chartMode === 'bars'
                    ? 'bg-[#282a2d] text-[#e3e3e3] shadow-sm'
                    : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                Columns
              </button>
            </div>
          </div>

          {/* Hover Status Box */}
          <div className="h-6 flex items-center justify-between text-xs px-2 text-[#9aa0a6] font-mono">
            {hoveredPoint ? (
              <span className="text-[#8ab4f8] animate-fade-rise">
                Hovering <strong>{hoveredPoint.day}</strong>: {formatMinutesToHours(hoveredPoint.prod)} study • {formatMinutesToHours(hoveredPoint.waste)} distracted
              </span>
            ) : (
              <span className="text-[#5f6368]">Hover over any point to inspect day metrics</span>
            )}
            <span className="text-[#81c995]">Goal: {profile.targetDailyStudyHours}h / day</span>
          </div>

          {/* SVG Animated Chart View */}
          <div className="h-52 w-full pt-2">
            {chartMode === 'area' ? (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="analyticsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8ab4f8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8ab4f8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#2e3135" strokeDasharray="3 3" />
                <line x1={paddingX} y1={(chartHeight - paddingY + paddingY) / 2} x2={chartWidth - paddingX} y2={(chartHeight - paddingY + paddingY) / 2} stroke="#2e3135" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#333538" />

                {/* Filled Area */}
                <path d={areaD} fill="url(#analyticsAreaGradient)" className="animate-fade-rise" />

                {/* Animated Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#8ab4f8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-path-draw"
                />

                {/* Interactive Points */}
                {trendPoints.map((p) => (
                  <g
                    key={p.day}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ day: p.day, prod: p.prod, waste: p.waste })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#131314"
                      stroke="#8ab4f8"
                      strokeWidth="2"
                      className="hover:r-7 transition-all"
                    />
                    <text
                      x={p.x}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      fill="#9aa0a6"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {p.day}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              /* Bar Chart View */
              <div className="flex items-end justify-between h-44 gap-3 px-4">
                {summary.weeklyTrend.map((item, index) => {
                  const pHeight = Math.min(100, Math.round((item.productiveMinutes / maxVal) * 100))
                  const wHeight = Math.min(100, Math.round((item.wastedMinutes / maxVal) * 100))

                  return (
                    <div
                      key={item.day}
                      onMouseEnter={() => setHoveredPoint({ day: item.day, prod: item.productiveMinutes, waste: item.wastedMinutes })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                    >
                      <div className="w-full flex items-end justify-center space-x-1 h-36">
                        <div
                          style={{
                            height: `${pHeight}%`,
                            animationDelay: `${index * 80}ms`
                          }}
                          className="w-1/2 max-w-[16px] bg-[#81c995] rounded-t-sm animate-bar-grow hover:brightness-110 transition-all"
                        />
                        <div
                          style={{
                            height: `${wHeight}%`,
                            animationDelay: `${index * 80 + 40}ms`
                          }}
                          className="w-1/2 max-w-[16px] bg-[#f28b82]/85 rounded-t-sm animate-bar-grow hover:brightness-110 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-mono font-medium text-[#9aa0a6] mt-2 group-hover:text-[#8ab4f8]">
                        {item.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Graph Legend */}
          <div className="mt-4 pt-3 border-t border-[#2e3135] flex items-center justify-center space-x-6 text-[11px] text-[#9aa0a6]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#81c995]" />
              <span className="text-[#e3e3e3]">Productive Study Time</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#f28b82]" />
              <span className="text-[#e3e3e3]">Wasted Distraction</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8ab4f8]" />
              <span className="text-[#e3e3e3]">Target Trend Line</span>
            </div>
          </div>
        </div>

        {/* RADIAL PROGRESS GAUGE (1 COLUMN) */}
        <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-2 border-b border-[#2e3135]">
              <Target className="w-4 h-4 text-[#8ab4f8]" />
              <h3 className="text-sm font-semibold text-[#e3e3e3]">Consistency Index</h3>
            </div>
            <p className="text-xs text-[#9aa0a6]">
              Daily habit rhythm, schedule adherence and recovery from interruptions
            </p>
          </div>

          {/* Animated Radial SVG Circle */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#282a2d"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#81c995"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold font-mono text-[#e3e3e3]">{scorePercent}%</span>
              <span className="block text-[10px] text-[#9aa0a6] uppercase tracking-wider font-mono">
                {!summary.hasActivity ? 'No data yet' : scorePercent >= 80 ? 'Strong' : scorePercent >= 60 ? 'Steady' : 'Needs focus'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135] text-xs space-y-1.5 text-[#9aa0a6]">
            <div className="flex items-center justify-between text-[#e3e3e3]">
              <span>Streak Health</span>
              <span className="text-[#81c995] font-mono font-medium">
                {summary.streakDays === 0
                  ? 'No streak yet'
                  : `${summary.streakDays} day${summary.streakDays === 1 ? '' : 's'}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#e3e3e3]">
              <span>Average Session Duration</span>
              <span className="font-mono text-[#8ab4f8]">
                {summary.totalSessionsAllTime > 0 ? `${summary.averageSessionMinutes} min` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#e3e3e3]">
              <span>Daily Adherence</span>
              <span className="font-mono text-[#81c995]">
                {summary.dailyGoalAdherencePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN: SUBJECT-WISE DISTRIBUTION & FOCUS HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUBJECT-WISE STUDY DISTRIBUTION (1 COLUMN) */}
        <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2e3135]">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#8ab4f8]" />
              <h3 className="text-sm font-semibold text-[#e3e3e3]">Subject Distribution</h3>
            </div>
            <span className="text-xs font-mono text-[#9aa0a6]">
              {subjects.length} Subjects
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {subjectStats.map((sub, index) => {
              const pct = Math.round((sub.totalMinutes / totalSubjectMinutes) * 100) || 0
              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#e3e3e3]">{sub.name}</span>
                    <span className="text-[#9aa0a6] font-mono">
                      {formatMinutesToHours(sub.totalMinutes)} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#131314] overflow-hidden border border-[#2e3135]">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#8ab4f8] to-[#81c995]"
                      style={{
                        width: `${pct}%`,
                        transitionDelay: `${index * 120}ms`
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-[11px] text-[#9aa0a6] mt-6 pt-3 border-t border-[#2e3135] leading-relaxed">
            <strong>Balance Metric:</strong>{' '}
            {highPriorityMinutes > 0 || totalTrackedMinutes > 0
              ? `High-priority subjects account for ${Math.round((highPriorityMinutes / totalSubjectMinutes) * 100)}% of your tracked focus time.`
              : 'Complete a focus session to see how your time splits across subjects.'}
          </p>
        </div>

        {/* FOCUS SESSION HISTORY LOG TABLE (2 COLUMNS) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#2e3135]">
            <div>
              <h3 className="text-sm font-semibold text-[#e3e3e3]">Focus Session History Log</h3>
              <p className="text-xs text-[#9aa0a6]">Verified study sessions with ratings & reflection notes</p>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-[#9aa0a6]" />
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#131314] border border-[#333538] text-xs text-[#e3e3e3] focus:border-[#8ab4f8] outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2e3135] text-[#9aa0a6] font-mono font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Subject & Task</th>
                  <th className="py-2.5 px-3">Preset</th>
                  <th className="py-2.5 px-3">Actual Time</th>
                  <th className="py-2.5 px-3">Interruptions</th>
                  <th className="py-2.5 px-3">Rating</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e3135]/60 font-mono">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[#282a2d]/50 transition">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#e3e3e3] block">{session.subjectName}</span>
                      <span className="text-[11px] text-[#9aa0a6] font-sans">{session.taskTitle}</span>
                      {session.reflection && (
                        <span className="text-[10px] text-[#9aa0a6] italic font-sans block mt-0.5">
                          "{session.reflection}"
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#131314] text-[#9aa0a6] text-[10px] border border-[#2e3135]">
                        {session.preset}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#81c995]">
                      {Math.round(session.actualDurationSeconds / 60)}m
                    </td>
                    <td className="py-3 px-3 text-[#9aa0a6]">
                      {session.interruptedCount}
                    </td>
                    <td className="py-3 px-3 text-[#fdd663]">
                      {'★'.repeat(session.rating || 5)}
                    </td>
                    <td className="py-3 px-3 text-[#5f6368] text-[11px]">
                      {session.startedAt.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
