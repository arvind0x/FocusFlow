import React, { useState } from 'react'
import { BarChart3, ShieldCheck, ArrowRight, LineChart, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatMinutesToHours } from '../../utils/formatters'

export const ProductivityMiniChart: React.FC = () => {
  const { summary, setActiveTab } = useApp()
  const [chartMode, setChartMode] = useState<'bars' | 'trend'>('bars')
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  const maxVal = Math.max(...summary.weeklyTrend.map((d) => Math.max(d.productiveMinutes, d.goalMinutes)), 360)

  // Points for animated SVG trend line
  const trendPoints = summary.weeklyTrend.map((d, i) => {
    const x = 30 + i * ((460 - 60) / (summary.weeklyTrend.length - 1))
    const y = 140 - (d.productiveMinutes / maxVal) * 110
    return { x, y, day: d.day, minutes: d.productiveMinutes }
  })

  const pathD = trendPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  )

  const areaD = `${pathD} L ${trendPoints[trendPoints.length - 1].x} 150 L ${trendPoints[0].x} 150 Z`

  return (
    <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg text-[#e3e3e3] transition hover:border-[#3c4043]">
      {/* Top Header with AI Studio Segmented Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#2e3135] gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#8ab4f8]" />
            <h3 className="text-sm font-semibold text-[#e3e3e3]">Productivity Rhythm</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131314] text-[#81c995] border border-[#2e3135]">
              Live
            </span>
          </div>
          <p className="text-xs text-[#9aa0a6] mt-0.5">
            Weekly focus hours vs estimated wasted time avoided
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Segmented Chart View Toggle */}
          <div className="flex items-center bg-[#131314] p-0.5 rounded-lg border border-[#2e3135] text-[11px]">
            <button
              onClick={() => setChartMode('bars')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                chartMode === 'bars'
                  ? 'bg-[#282a2d] text-[#e3e3e3] shadow-sm'
                  : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
              }`}
            >
              Columns
            </button>
            <button
              onClick={() => setChartMode('trend')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                chartMode === 'trend'
                  ? 'bg-[#282a2d] text-[#e3e3e3] shadow-sm'
                  : 'text-[#9aa0a6] hover:text-[#e3e3e3]'
              }`}
            >
              Flow Curve
            </button>
          </div>

          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs text-[#9aa0a6] hover:text-[#8ab4f8] flex items-center space-x-1 pl-1 transition"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-2 pb-2">
        {chartMode === 'bars' ? (
          /* Animated Bar Chart View */
          <div className="flex items-end justify-between h-40 gap-2 sm:gap-3 px-2">
            {summary.weeklyTrend.map((item, index) => {
              const prodHeight = Math.min(100, Math.round((item.productiveMinutes / maxVal) * 100))
              const wasteHeight = Math.min(100, Math.round((item.wastedMinutes / maxVal) * 100))
              const isHovered = hoveredDay === item.day

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredDay(item.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-[#131314] text-[#e3e3e3] text-[10px] p-2 rounded-lg border border-[#3c4043] shadow-2xl whitespace-nowrap font-mono animate-fade-rise">
                      <div className="font-bold text-white border-b border-[#2e3135] pb-0.5 mb-1">{item.day}</div>
                      <div className="text-[#81c995]">Study: {formatMinutesToHours(item.productiveMinutes)}</div>
                      <div className="text-[#f28b82]">Distracted: {formatMinutesToHours(item.wastedMinutes)}</div>
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center space-x-1.5 h-32">
                    {/* Animated Productive Bar */}
                    <div
                      style={{
                        height: `${prodHeight}%`,
                        animationDelay: `${index * 80}ms`
                      }}
                      className="w-1/2 max-w-[14px] bg-[#81c995] rounded-t-sm animate-bar-grow hover:brightness-110 transition-all shadow-[0_0_8px_rgba(129,201,149,0.2)]"
                    />
                    {/* Animated Distraction Bar */}
                    <div
                      style={{
                        height: `${wasteHeight}%`,
                        animationDelay: `${index * 80 + 40}ms`
                      }}
                      className="w-1/2 max-w-[14px] bg-[#f28b82]/85 rounded-t-sm animate-bar-grow hover:brightness-110 transition-all"
                    />
                  </div>

                  <span
                    className={`text-[11px] font-mono mt-2 transition ${
                      isHovered ? 'text-[#8ab4f8] font-semibold' : 'text-[#9aa0a6]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          /* Animated SVG Curve Flow View */
          <div className="h-40 w-full relative flex items-center justify-center">
            <svg viewBox="0 0 480 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#81c995" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#81c995" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              <line x1="20" y1="35" x2="460" y2="35" stroke="#2e3135" strokeDasharray="3 3" />
              <line x1="20" y1="85" x2="460" y2="85" stroke="#2e3135" strokeDasharray="3 3" />
              <line x1="20" y1="135" x2="460" y2="135" stroke="#2e3135" />

              {/* Animated Filled Area */}
              <path d={areaD} fill="url(#areaGradient)" className="animate-fade-rise" />

              {/* Animated Trend Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#81c995"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-path-draw"
              />

              {/* Data Point Circles */}
              {trendPoints.map((p, idx) => (
                <g key={p.day} className="cursor-pointer group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#131314"
                    stroke="#81c995"
                    strokeWidth="2"
                    className="transition-transform group-hover:r-6"
                  />
                  <text
                    x={p.x}
                    y="152"
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
          </div>
        )}

        {/* Legend & Summary - Studio Minimal Style */}
        <div className="mt-3 pt-3 border-t border-[#2e3135] flex items-center justify-between text-[11px] text-[#9aa0a6]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#81c995]" />
              <span className="text-[#e3e3e3]">Productive Study</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#f28b82]" />
              <span className="text-[#e3e3e3]">Interruption Lost</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[#81c995] font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>+{formatMinutesToHours(summary.totalSavedMinutes)} Reclaimed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
