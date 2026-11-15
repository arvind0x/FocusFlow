import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { LandingPage } from './components/landing/LandingPage'
import { LoginPage } from './components/auth/LoginPage'
import { DashboardPage } from './components/dashboard/DashboardPage'
import { TimetablePage } from './components/timetable/TimetablePage'
import { FocusPage } from './components/focus/FocusPage'
import { DistractionPage } from './components/distraction/DistractionPage'
import { AnalyticsPage } from './components/analytics/AnalyticsPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { OnboardingModal } from './components/onboarding/OnboardingModal'
import { LogDistractionModal } from './components/distraction/LogDistractionModal'
import { TabAwayAlertModal } from './components/focus/TabAwayAlertModal'
import { LofiPlayer } from './components/focus/LofiPlayer'

const MainContent: React.FC = () => {
  const { activeTab, activeFocus, settings, authUser, authReady } = useApp()

  if (!authReady) {
    return <main className="min-h-screen bg-[#131314] text-[#e3e3e3] flex items-center justify-center" role="status">Loading account...</main>
  }

  if (!authUser.isAuthenticated && activeTab !== 'landing') {
    return <main className="min-h-screen bg-[#131314] text-[#e3e3e3]"><LoginPage /></main>
  }

  // Full-page views
  if (activeTab === 'landing') {
    return (
      <main className="min-h-screen bg-[#131314] text-[#e3e3e3]">
        <LandingPage />
        <Footer />
        <OnboardingModal />
      </main>
    )
  }

  if (activeTab === 'login') {
    return (
      <main className="min-h-screen bg-[#131314] text-[#e3e3e3]">
        <LoginPage />
      </main>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#131314] text-[#e3e3e3] transition-colors selection:bg-[#8ab4f8]/20 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeFocus.isActive && !activeFocus.isBreak && settings.ambientSound === 'lofi' && <LofiPlayer />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'timetable' && <TimetablePage />}
        {activeTab === 'focus' && <FocusPage />}
        {activeTab === 'distraction' && <DistractionPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <Footer />

      {/* Global Modals */}
      <OnboardingModal />
      <LogDistractionModal />
      <TabAwayAlertModal />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}

export default App
