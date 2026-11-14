import React from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  ShieldAlert,
  BarChart3,
  Settings,
  Flame,
  Sun,
  Moon,
  PlusCircle,
  Volume2,
  VolumeX,
  LogIn,
  Wrench,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { useApp, TabType } from '../../context/AppContext'

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    settings,
    updateSettings,
    activeFocus,
    setShowLogDistractionModal,
    setShowOnboardingModal,
    handleDistractionTabClick,
    maintenanceToast,
    setMaintenanceToast
  } = useApp()

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string; isDistraction?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'timetable', label: 'Timetable', icon: <CalendarDays className="w-3.5 h-3.5" /> },
    {
      id: 'focus',
      label: 'Focus Mode',
      icon: <Timer className="w-3.5 h-3.5" />,
      badge: activeFocus.isActive ? (activeFocus.isBreak ? 'Break' : 'Active') : undefined
    },
    {
      id: 'distraction',
      label: 'Distraction Shield',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      isDistraction: true,
      badge: 'Under Maintenance'
    },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
  ]

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
  }

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled })
  }

  return (
    <>
      {/* Google AI Studio Inspired Top Toast for Maintenance Notification */}
      {maintenanceToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-amber-500/40 text-amber-300 shadow-2xl animate-fade-rise text-xs font-mono">
          <Wrench className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
          <span>
            <strong>Distraction Shield:</strong> Under Maintenance. Tab cannot be opened at this time.
          </span>
          <button
            onClick={() => setMaintenanceToast(false)}
            className="ml-2 text-zinc-400 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b transition-colors border-[#2e3135] bg-[#131314]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13">
            {/* Logo - Google Studio Minimal Style */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-7 h-7 rounded-lg bg-[#1e1f20] border border-[#3c4043] flex items-center justify-center group-hover:border-[#8ab4f8] transition">
                <Sparkles className="w-4 h-4 text-[#8ab4f8]" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-tight text-[#e3e3e3]">
                  FocusFlow
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1f20] border border-[#333538] text-[#9aa0a6]">
                  Studio v2.4
                </span>
              </div>
            </div>

            {/* Navigation Tabs - Clean Segmented Pill Layout */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#1a1b1e] p-1 rounded-xl border border-[#2e3135]">
              {navItems.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isDistraction) {
                        handleDistractionTabClick()
                      } else {
                        setActiveTab(item.id)
                      }
                    }}
                    className={`relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      isActive
                        ? 'bg-[#282a2d] text-white border border-[#3c4043] shadow-sm'
                        : item.isDistraction
                        ? 'text-[#9aa0a6] hover:text-amber-300 hover:bg-[#1e1f20]'
                        : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#1e1f20]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-1 text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                          item.badge === 'Under Maintenance'
                            ? 'bg-amber-400/10 text-amber-300 border border-amber-400/25'
                            : item.badge === 'Break'
                            ? 'bg-[#81c995]/20 text-[#81c995]'
                            : 'bg-[#8ab4f8]/20 text-[#8ab4f8]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Quick Distraction Logger */}
              <button
                onClick={() => setShowLogDistractionModal(true)}
                className="hidden xl:flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[#282a2d] text-[#f28b82] border border-[#f28b82]/30 hover:bg-[#f28b82]/10 transition"
                title="Log an interruption"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log Distraction</span>
              </button>

              {/* Streak Pill */}
              <div
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#1e1f20] text-[#81c995] border border-[#2e3135]"
                title={`${profile.streakDays} days study streak!`}
              >
                <Flame className="w-3.5 h-3.5 text-[#81c995]" />
                <span>{profile.streakDays}d streak</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#1e1f20] transition border border-transparent hover:border-[#333538]"
                title={settings.soundEnabled ? 'Mute audio' : 'Enable audio'}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#8ab4f8]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#5f6368]" />
                )}
              </button>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#1e1f20] transition border border-transparent hover:border-[#333538]"
                title="Toggle theme"
              >
                {settings.theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-[#e3e3e3]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#e3e3e3]" />
                )}
              </button>

              {/* Sign In Button */}
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#1e1f20] border border-[#333538] hover:border-[#8ab4f8] text-[#e3e3e3] hover:text-[#8ab4f8] transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              {/* Profile Avatar / Setup */}
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="flex items-center space-x-1 p-0.5 rounded-lg bg-[#1e1f20] border border-[#333538] hover:border-[#8ab4f8] transition"
                title="Edit Profile"
              >
                <div className="w-6 h-6 rounded-md bg-[#282a2d] text-[#8ab4f8] text-xs font-semibold flex items-center justify-center">
                  {profile.name.charAt(0)}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="flex md:hidden overflow-x-auto py-1.5 space-x-1 border-t border-[#2e3135] scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isDistraction) {
                      handleDistractionTabClick()
                    } else {
                      setActiveTab(item.id)
                    }
                  }}
                  className={`flex items-center space-x-1 whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 transition ${
                    isActive
                      ? 'bg-[#282a2d] text-white border border-[#3c4043]'
                      : 'text-[#9aa0a6] hover:text-white bg-[#1e1f20]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>
    </>
  )
}
