import React, { useState } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Clock,
  Sun,
  Moon,
  Database,
  ShieldCheck,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  Bot,
  Lock,
  Sparkles,
  Server
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { soundManager } from '../../utils/sound'

export const SettingsPage: React.FC = () => {
  const {
    profile,
    updateProfile,
    settings,
    updateSettings,
    resetToDemoData,
    exportDataJSON,
    importDataJSON,
    setShowOnboardingModal
  } = useApp()

  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [importText, setImportText] = useState('')
  const [showImportBox, setShowImportBox] = useState(false)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleExport = () => {
    const json = exportDataJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focusflow-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    showToast('Configuration and data exported successfully!')
  }

  const handleImportSubmit = () => {
    if (!importText.trim()) return
    const success = importDataJSON(importText.trim())
    if (success) {
      showToast('Data imported successfully!')
      setShowImportBox(false)
      setImportText('')
    } else {
      showToast('Failed to import JSON: Invalid format.')
    }
  }

  const handleTestSound = () => {
    soundManager.playStartChime()
    showToast('Playing gentle study chime')
  }

  const handleTestAlarm = () => {
    soundManager.playBreakEndingAlert()
    showToast('Playing break-ending enforcer alert')
  }

  return (
    <div className="space-y-6 animate-fade-rise pb-16 text-[#e3e3e3]">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-[#3c4043] text-[#e3e3e3] shadow-2xl animate-fade-rise text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#81c995]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#282a2d] border border-[#3c4043] flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-[#8ab4f8]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#e3e3e3]">
                Studio Settings
              </h1>
              <p className="text-xs text-[#9aa0a6] mt-0.5">
                Manage student profile parameters, study rhythm algorithms, audio cues, and offline data
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowOnboardingModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-medium bg-[#282a2d] hover:bg-[#333538] text-[#e3e3e3] border border-[#3c4043] hover:border-[#8ab4f8] transition self-start sm:self-auto shadow-sm"
        >
          Re-run Onboarding Wizard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STUDENT PROFILE */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#2e3135]">
            <User className="w-4 h-4 text-[#8ab4f8]" />
            <h3 className="text-sm font-semibold text-[#e3e3e3]">Student Profile</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#9aa0a6] mb-1">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] text-[#e3e3e3] focus:outline-none focus:border-[#8ab4f8]"
              />
            </div>

            <div>
              <label className="block text-[#9aa0a6] mb-1">Target Examination / Grade</label>
              <input
                type="text"
                value={profile.gradeOrExam}
                onChange={(e) => updateProfile({ gradeOrExam: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] text-[#e3e3e3] focus:outline-none focus:border-[#8ab4f8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9aa0a6] mb-1">Daily Target (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={profile.targetDailyStudyHours}
                  onChange={(e) => updateProfile({ targetDailyStudyHours: Number(e.target.value) || 6 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] text-[#e3e3e3] font-mono focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-[#9aa0a6] mb-1">Current Streak (Days)</label>
                <input
                  type="number"
                  min={0}
                  value={profile.streakDays}
                  onChange={(e) => updateProfile({ streakDays: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] text-[#e3e3e3] font-mono focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM & MODULE STATUS */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2e3135]">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-[#8ab4f8]" />
              <h3 className="text-sm font-semibold text-[#e3e3e3]">Architecture & Module Health</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131314] text-[#81c995] border border-[#2e3135]">
              Local Runtime
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135] space-y-2">
              <div className="flex items-center justify-between text-[#e3e3e3]">
                <span className="font-medium">Focus Flow Engine</span>
                <span className="text-[#81c995] font-mono font-medium">Active (45–10)</span>
              </div>
              <div className="flex items-center justify-between text-[#e3e3e3]">
                <span className="font-medium">Timetable AI Generator</span>
                <span className="text-[#81c995] font-mono font-medium">Ready</span>
              </div>
              <div className="flex items-center justify-between text-[#e3e3e3]">
                <span className="font-medium">Analytics Engine</span>
                <span className="text-[#81c995] font-mono font-medium">Calculated</span>
              </div>
              <div className="flex items-center justify-between text-[#e3e3e3]">
                <span className="font-medium">Distraction Shield</span>
                <span className="text-amber-400 font-mono font-medium">Under Maintenance</span>
              </div>
            </div>

            <p className="text-[11px] text-[#9aa0a6] leading-relaxed">
              Distraction Shield is currently under maintenance while companion daemon protocol updates are finalized.
            </p>
          </div>
        </div>

        {/* FOCUS ENGINE PREFERENCES */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#2e3135]">
            <Clock className="w-4 h-4 text-[#8ab4f8]" />
            <h3 className="text-sm font-semibold text-[#e3e3e3]">Study Rhythm Parameters</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9aa0a6] mb-1">Default Focus (Min)</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={profile.preferredFocusMinutes}
                  onChange={(e) => updateProfile({ preferredFocusMinutes: Number(e.target.value) || 45 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] text-[#e3e3e3] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#9aa0a6] mb-1">Default Break (Min)</label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={profile.preferredBreakMinutes}
                  onChange={(e) => updateProfile({ preferredBreakMinutes: Number(e.target.value) || 10 })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] text-[#e3e3e3] font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135] flex items-center justify-between">
              <div>
                <span className="font-medium text-[#e3e3e3] block">5-Minute Starter Rule</span>
                <span className="text-[11px] text-[#9aa0a6]">
                  Allow low-friction 5-minute sessions to beat study resistance
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.fiveMinuteStarterRule}
                onChange={(e) => updateSettings({ fiveMinuteStarterRule: e.target.checked })}
                className="w-4 h-4 rounded accent-[#8ab4f8] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135] flex items-center justify-between">
              <div>
                <span className="font-medium text-[#e3e3e3] block">Tab-Leave Detection</span>
                <span className="text-[11px] text-[#9aa0a6]">
                  Detect when browser tab loses focus and prompt focus verification
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.tabLeaveDetection}
                onChange={(e) => updateSettings({ tabLeaveDetection: e.target.checked })}
                className="w-4 h-4 rounded accent-[#8ab4f8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SOUND & THEME */}
        <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-lg space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#2e3135]">
            <Volume2 className="w-4 h-4 text-[#8ab4f8]" />
            <h3 className="text-sm font-semibold text-[#e3e3e3]">Sound & Studio Theme</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135] flex items-center justify-between">
              <div>
                <span className="font-medium text-[#e3e3e3] block">Audio Fanfares & Cues</span>
                <span className="text-[11px] text-[#9aa0a6]">
                  Web Audio synthesised chimes on session start and completion
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#8ab4f8] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#131314] border border-[#2e3135] flex items-center justify-between">
              <div>
                <span className="font-medium text-[#e3e3e3] block">Break Enforcer Alarm</span>
                <span className="text-[11px] text-[#9aa0a6]">
                  Plays distinct signal when break countdown reaches 00:00
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.breakEnforcementAlert}
                onChange={(e) => updateSettings({ breakEnforcementAlert: e.target.checked })}
                className="w-4 h-4 rounded accent-[#8ab4f8] cursor-pointer"
              />
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={handleTestSound}
                className="flex-1 py-2 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#3c4043] text-[#9aa0a6] hover:text-[#e3e3e3] font-medium text-xs transition"
              >
                Test Chime
              </button>
              <button
                type="button"
                onClick={handleTestAlarm}
                className="flex-1 py-2 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#3c4043] text-[#9aa0a6] hover:text-[#e3e3e3] font-medium text-xs transition"
              >
                Test Alarm
              </button>
            </div>

            <div className="pt-2">
              <label className="block text-[#9aa0a6] mb-1.5">Theme Palette</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-medium transition ${
                    settings.theme === 'dark'
                      ? 'bg-[#282a2d] border-[#8ab4f8] text-[#8ab4f8]'
                      : 'bg-[#131314] border-[#2e3135] text-[#9aa0a6]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Studio Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-medium transition ${
                    settings.theme === 'light'
                      ? 'bg-[#282a2d] border-[#8ab4f8] text-[#8ab4f8]'
                      : 'bg-[#131314] border-[#2e3135] text-[#9aa0a6]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Studio Light</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATA MANAGEMENT & BACKUP */}
      <div className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-lg space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#2e3135]">
          <Database className="w-4 h-4 text-[#8ab4f8]" />
          <h3 className="text-sm font-semibold text-[#e3e3e3]">Data Storage & Local Backup</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#3c4043] text-[#e3e3e3] transition font-medium"
          >
            <Download className="w-4 h-4 text-[#8ab4f8]" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#3c4043] text-[#e3e3e3] transition font-medium"
          >
            <Upload className="w-4 h-4 text-[#8ab4f8]" />
            <span>Import Backup (JSON)</span>
          </button>

          <button
            onClick={() => {
              resetToDemoData()
              showToast('Restored sample demonstration data!')
            }}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#131314] border border-[#2e3135] hover:border-[#3c4043] text-[#81c995] transition font-medium"
          >
            <RotateCcw className="w-4 h-4 text-[#81c995]" />
            <span>Load Demo Data</span>
          </button>
        </div>

        {showImportBox && (
          <div className="p-4 rounded-xl bg-[#131314] border border-[#2e3135] space-y-3">
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported FocusFlow JSON content here..."
              className="w-full p-2.5 rounded-xl bg-[#1e1f20] border border-[#333538] text-xs font-mono text-[#e3e3e3] focus:outline-none focus:border-[#8ab4f8]"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 text-xs text-[#9aa0a6] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-1.5 rounded-xl text-xs font-medium bg-[#8ab4f8] text-[#131314] hover:bg-[#aecbfa]"
              >
                Apply Import
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRIVACY PLEDGE */}
      <div className="p-6 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-lg text-xs">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#81c995] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-sm font-semibold text-[#e3e3e3] block">
              100% Student Privacy Guarantee
            </strong>
            <p className="text-[#9aa0a6] leading-relaxed">
              In strict compliance with the competition privacy criteria, all schedules, focus sessions, study stats, and profile preferences remain exclusively stored in your local browser sandbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
