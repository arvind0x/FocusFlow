import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  subtext: string
  icon: LucideIcon
  color: 'emerald' | 'rose' | 'white' | 'zinc'
  badge?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  color,
  badge
}) => {
  const colorMap = {
    emerald: {
      border: 'border-[#333538] hover:border-[#81c995]/60',
      iconBg: 'bg-[#81c995]/10 text-[#81c995] border border-[#81c995]/20',
      badgeBg: 'bg-[#81c995]/10 text-[#81c995] border border-[#81c995]/25',
      valColor: 'text-[#e3e3e3]'
    },
    rose: {
      border: 'border-[#333538] hover:border-[#f28b82]/60',
      iconBg: 'bg-[#f28b82]/10 text-[#f28b82] border border-[#f28b82]/20',
      badgeBg: 'bg-[#f28b82]/10 text-[#f28b82] border border-[#f28b82]/25',
      valColor: 'text-[#e3e3e3]'
    },
    white: {
      border: 'border-[#333538] hover:border-[#8ab4f8]/60',
      iconBg: 'bg-[#8ab4f8]/10 text-[#8ab4f8] border border-[#8ab4f8]/20',
      badgeBg: 'bg-[#282a2d] text-[#e3e3e3] border border-[#3c4043]',
      valColor: 'text-[#e3e3e3]'
    },
    zinc: {
      border: 'border-[#333538] hover:border-[#3c4043]',
      iconBg: 'bg-[#282a2d] text-[#9aa0a6] border border-[#333538]',
      badgeBg: 'bg-[#282a2d] text-[#9aa0a6] border border-[#333538]',
      valColor: 'text-[#e3e3e3]'
    }
  }[color]

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 bg-[#1e1f20] ${colorMap.border} shadow-sm transition-all duration-150 group`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono font-medium text-[#9aa0a6] uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-7 h-7 rounded-lg ${colorMap.iconBg} flex items-center justify-center transition group-hover:scale-105`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className={`text-2xl sm:text-3xl font-bold font-mono ${colorMap.valColor} tracking-tight`}>
          {value}
        </div>
        {badge && (
          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${colorMap.badgeBg}`}>
            {badge}
          </span>
        )}
      </div>

      <p className="text-[11px] text-[#9aa0a6] mt-1.5 truncate">
        {subtext}
      </p>
    </div>
  )
}
