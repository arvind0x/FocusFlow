import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import {
  StudentProfile,
  Subject,
  TimetableTask,
  FocusSession,
  DistractionLog,
  DistractionItem,
  AppSettings,
  ProductivitySummary,
  TaskStatus,
  PriorityLevel,
  GitHubSyncState,
  AuthUser
} from '../types'
import {
  initialProfile,
  initialSubjects,
  initialTasks,
  initialFocusSessions,
  initialDistractionLogs,
  initialDistractionItems,
  initialSettings
} from '../data/mockData'
import { getTodayDateString } from '../utils/formatters'
import { soundManager } from '../utils/sound'

export type TabType = 'landing' | 'login' | 'dashboard' | 'timetable' | 'focus' | 'distraction' | 'analytics' | 'settings'

interface ActiveFocusState {
  isActive: boolean
  isPaused: boolean
  isBreak: boolean
  subjectId: string
  subjectName: string
  taskTitle: string
  preset: '45-10' | '25-5' | '5-min-starter' | 'custom'
  totalDurationSeconds: number
  remainingSeconds: number
  breakRemainingSeconds: number
  totalBreakSeconds: number
  interruptedCount: number
  interruptionSeconds: number
}

interface AppContextType {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  profile: StudentProfile
  updateProfile: (profile: Partial<StudentProfile>) => void
  subjects: Subject[]
  addSubject: (subject: Omit<Subject, 'id'>) => void
  deleteSubject: (id: string) => void
  updateSubject: (id: string, updates: Partial<Subject>) => void
  tasks: TimetableTask[]
  addTask: (task: Omit<TimetableTask, 'id'>) => void
  updateTask: (id: string, updates: Partial<TimetableTask>) => void
  deleteTask: (id: string) => void
  toggleTaskStatus: (id: string, status?: TaskStatus) => void
  rescheduleIncompleteTasks: (targetDate?: string) => void
  generateSmartTimetable: (options: {
    startHour: number
    endHour: number
    focusDurationMinutes: number
    breakDurationMinutes: number
    selectedSubjectIds: string[]
  }) => void
  focusSessions: FocusSession[]
  activeFocus: ActiveFocusState
  startFocusSession: (config: {
    subjectId: string
    subjectName: string
    taskTitle: string
    focusMinutes: number
    breakMinutes: number
    preset: '45-10' | '25-5' | '5-min-starter' | 'custom'
  }) => void
  pauseFocusSession: () => void
  resumeFocusSession: () => void
  endFocusSession: (completed?: boolean) => void
  skipToBreak: () => void
  endBreakEarly: () => void
  distractionLogs: DistractionLog[]
  addDistractionLog: (log: Omit<DistractionLog, 'id' | 'timestamp'>) => void
  deleteDistractionLog: (id: string) => void
  distractionItems: DistractionItem[]
  addDistractionItem: (item: Omit<DistractionItem, 'id'>) => void
  deleteDistractionItem: (id: string) => void
  toggleDistractionItemBlock: (id: string) => void
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  summary: ProductivitySummary
  resetToDemoData: () => void
  clearAllData: () => void
  exportDataJSON: () => string
  importDataJSON: (jsonStr: string) => boolean
  showOnboardingModal: boolean
  setShowOnboardingModal: (show: boolean) => void
  showLogDistractionModal: boolean
  setShowLogDistractionModal: (show: boolean) => void
  tabAwayNotice: { show: boolean; seconds: number } | null
  dismissTabAwayNotice: (asDistraction?: boolean) => void

  // Auth & GitHub Integration
  authUser: AuthUser
  login: (email: string, name?: string, provider?: 'email' | 'github' | 'demo') => void
  logout: () => void
  githubSync: GitHubSyncState
  connectGitHub: (username: string, repoName: string) => void
  disconnectGitHub: () => void
  showDistractionMaintenanceModal: boolean
  setShowDistractionMaintenanceModal: (show: boolean) => void
  handleDistractionTabClick: () => void
  maintenanceToast: boolean
  setMaintenanceToast: (val: boolean) => void
}

const STORAGE_KEY_PREFIX = 'focusflow_v2_'

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tab`)
    return (saved as TabType) || 'dashboard'
  })

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab)
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tab`, tab)
  }

  // Auth User
  const [authUser, setAuthUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`)
    return saved
      ? JSON.parse(saved)
      : {
          isAuthenticated: true,
          email: 'student@demo.local',
          name: 'Demo Student',
          provider: 'demo'
        }
  })

  // GitHub Sync State (Default: not connected to satisfy requirement that distraction field is under maintenance until GitHub is connected)
  const [githubSync, setGithubSync] = useState<GitHubSyncState>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}github`)
    return saved
      ? JSON.parse(saved)
      : {
          isConnected: false,
          username: '',
          repoName: '',
          branch: 'main',
          lastSyncedAt: undefined
        }
  })

  const [showDistractionMaintenanceModal, setShowDistractionMaintenanceModal] = useState<boolean>(false)
  const [maintenanceToast, setMaintenanceToast] = useState<boolean>(false)

  // Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`)
    return saved ? JSON.parse(saved) : initialProfile
  })

  // Subjects
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subjects`)
    return saved ? JSON.parse(saved) : initialSubjects
  })

  // Tasks
  const [tasks, setTasks] = useState<TimetableTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tasks`)
    return saved ? JSON.parse(saved) : initialTasks
  })

  // Focus sessions
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`)
    return saved ? JSON.parse(saved) : initialFocusSessions
  })

  // Distraction logs
  const [distractionLogs, setDistractionLogs] = useState<DistractionLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}distractions`)
    return saved ? JSON.parse(saved) : initialDistractionLogs
  })

  // Distraction list items
  const [distractionItems, setDistractionItems] = useState<DistractionItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}distraction_items`)
    return saved ? JSON.parse(saved) : initialDistractionItems
  })

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`)
    return saved ? JSON.parse(saved) : initialSettings
  })

  // Modals & UI states
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(!profile.onboardingCompleted)
  const [showLogDistractionModal, setShowLogDistractionModal] = useState<boolean>(false)
  const [tabAwayNotice, setTabAwayNotice] = useState<{ show: boolean; seconds: number } | null>(null)

  // Active focus session state
  const [activeFocus, setActiveFocus] = useState<ActiveFocusState>({
    isActive: false,
    isPaused: false,
    isBreak: false,
    subjectId: '',
    subjectName: '',
    taskTitle: '',
    preset: '45-10',
    totalDurationSeconds: 45 * 60,
    remainingSeconds: 45 * 60,
    breakRemainingSeconds: 10 * 60,
    totalBreakSeconds: 10 * 60,
    interruptedCount: 0,
    interruptionSeconds: 0
  })

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, JSON.stringify(authUser))
  }, [authUser])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}github`, JSON.stringify(githubSync))
  }, [githubSync])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}subjects`, JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(focusSessions))
  }, [focusSessions])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}distractions`, JSON.stringify(distractionLogs))
  }, [distractionLogs])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}distraction_items`, JSON.stringify(distractionItems))
  }, [distractionItems])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings))
    const root = document.documentElement
    if (settings.theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [settings])

  // Auth handlers
  const login = (email: string, name = 'Student User', provider: 'email' | 'github' | 'demo' = 'email') => {
    setAuthUser({
      isAuthenticated: true,
      email,
      name,
      provider
    })
    updateProfile({ name })
    setActiveTab('dashboard')
  }

  const logout = () => {
    setAuthUser({
      isAuthenticated: false,
      email: '',
      name: '',
      provider: 'demo'
    })
    setActiveTab('login')
  }

  // GitHub integration handlers
  const connectGitHub = (username: string, repoName: string) => {
    setGithubSync({
      isConnected: true,
      username: username.trim() || 'student-dev',
      repoName: repoName.trim() || 'student-study-shield',
      branch: 'main',
      lastSyncedAt: new Date().toISOString()
    })
    setShowDistractionMaintenanceModal(false)
  }

  const disconnectGitHub = () => {
    setGithubSync({
      isConnected: false,
      username: '',
      repoName: '',
      branch: 'main',
      lastSyncedAt: undefined
    })
  }

  // Distraction tab click handler: Tab is strictly non-openable and marked "Under Maintenance"
  const handleDistractionTabClick = () => {
    setMaintenanceToast(true)
    setTimeout(() => {
      setMaintenanceToast(false)
    }, 3000)
  }

  // Profile actions
  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  // Subject actions
  const addSubject = (newSub: Omit<Subject, 'id'>) => {
    const id = `sub-${Date.now()}`
    setSubjects((prev) => [...prev, { ...newSub, id }])
  }

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  // Task actions
  const addTask = (newTask: Omit<TimetableTask, 'id'>) => {
    const id = `task-${Date.now()}`
    setTasks((prev) => [...prev, { ...newTask, id }])
  }

  const updateTask = (id: string, updates: Partial<TimetableTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTaskStatus = (id: string, targetStatus?: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const nextStatus = targetStatus ?? (t.status === 'completed' ? 'pending' : 'completed')
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toTimeString().slice(0, 5) : undefined
        }
      })
    )
  }

  const rescheduleIncompleteTasks = (targetDate?: string) => {
    const dateToUse = targetDate || getTodayDateString()
    setTasks((prev) =>
      prev.map((t) => {
        if (t.status === 'pending' || t.status === 'in_progress') {
          return {
            ...t,
            date: dateToUse,
            status: 'pending'
          }
        }
        return t
      })
    )
  }

  // Intelligent Timetable Generator
  const generateSmartTimetable = ({
    startHour,
    endHour,
    focusDurationMinutes,
    breakDurationMinutes,
    selectedSubjectIds
  }: {
    startHour: number
    endHour: number
    focusDurationMinutes: number
    breakDurationMinutes: number
    selectedSubjectIds: string[]
  }) => {
    const targetSubjects = subjects.filter((s) =>
      selectedSubjectIds.length > 0 ? selectedSubjectIds.includes(s.id) : true
    )

    if (targetSubjects.length === 0) return

    const priorityWeight: Record<PriorityLevel, number> = { high: 3, medium: 2, low: 1 }
    const sortedSubjects = [...targetSubjects].sort(
      (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
    )

    const todayStr = getTodayDateString()
    const generated: TimetableTask[] = []

    let currentMinute = startHour * 60
    const endMinute = endHour * 60
    let subjectIdx = 0

    const sampleTopics: Record<string, string[]> = {
      'Physics': [
        'Rotational Dynamics & Torque numerical drills',
        'Formula Sheet & Error Notebook Re-check',
        'Past 5 Years Questions Practice',
        'Wave Optics & Interference problem set'
      ],
      'Chemistry': [
        'Organic Reaction Mechanisms & Reagent notes',
        'Thermodynamics & Equilibrium calculations',
        'Inorganic NCERT Line-by-Line Revision',
        'Mock MCQ Speed Test'
      ],
      'Mathematics': [
        'Definite Integrals & Area under Curves',
        'Coordinate Geometry & Conic Sections drill',
        'High-Yield PYQ Speed Practice',
        'Challenging Tough Questions Review'
      ],
      'Computer Science': [
        'Algorithm Logic & Stack/Queue dry runs',
        'Code Implementation in Python',
        'Board Exam Pattern Questions',
        'Data Structures Debugging'
      ],
      'English': [
        'Theme Analysis & Literary devices',
        'Writing Section Format & Practice'
      ]
    }

    while (currentMinute + focusDurationMinutes <= endMinute) {
      const subject = sortedSubjects[subjectIdx % sortedSubjects.length]
      const topics = sampleTopics[subject.name] || ['Target Chapter Revision & Practice Questions']
      const topic = topics[Math.floor(Math.random() * topics.length)]

      const startH = Math.floor(currentMinute / 60).toString().padStart(2, '0')
      const startM = (currentMinute % 60).toString().padStart(2, '0')
      const taskEndMinute = currentMinute + focusDurationMinutes
      const endH = Math.floor(taskEndMinute / 60).toString().padStart(2, '0')
      const endM = (taskEndMinute % 60).toString().padStart(2, '0')

      generated.push({
        id: `gen-task-${Date.now()}-${generated.length}`,
        subjectId: subject.id,
        subjectName: subject.name,
        title: `${subject.name}: ${topic}`,
        startTime: `${startH}:${startM}`,
        endTime: `${endH}:${endM}`,
        durationMinutes: focusDurationMinutes,
        status: 'pending',
        date: todayStr,
        priority: subject.priority
      })

      currentMinute += focusDurationMinutes + breakDurationMinutes
      subjectIdx++
    }

    setTasks((prev) => {
      const existingCompleted = prev.filter((t) => t.date !== todayStr || t.status === 'completed')
      return [...existingCompleted, ...generated]
    })
  }

  // Focus Session controls
  const startFocusSession = (config: {
    subjectId: string
    subjectName: string
    taskTitle: string
    focusMinutes: number
    breakMinutes: number
    preset: '45-10' | '25-5' | '5-min-starter' | 'custom'
  }) => {
    setActiveFocus({
      isActive: true,
      isPaused: false,
      isBreak: false,
      subjectId: config.subjectId,
      subjectName: config.subjectName,
      taskTitle: config.taskTitle,
      preset: config.preset,
      totalDurationSeconds: config.focusMinutes * 60,
      remainingSeconds: config.focusMinutes * 60,
      breakRemainingSeconds: config.breakMinutes * 60,
      totalBreakSeconds: config.breakMinutes * 60,
      interruptedCount: 0,
      interruptionSeconds: 0
    })

    if (settings.soundEnabled) {
      soundManager.playStartChime()
    }
    if (settings.ambientSound !== 'none') {
      soundManager.startAmbient(settings.ambientSound, settings.ambientVolume)
    }
  }

  const pauseFocusSession = () => {
    setActiveFocus((prev) => ({ ...prev, isPaused: true }))
    soundManager.stopAmbient()
  }

  const resumeFocusSession = () => {
    setActiveFocus((prev) => ({ ...prev, isPaused: false }))
    if (settings.ambientSound !== 'none') {
      soundManager.startAmbient(settings.ambientSound, settings.ambientVolume)
    }
  }

  const skipToBreak = () => {
    setActiveFocus((prev) => ({
      ...prev,
      isBreak: true,
      remainingSeconds: 0
    }))
    if (settings.soundEnabled) {
      soundManager.playCompletionFanfare()
    }
    soundManager.stopAmbient()
  }

  const endBreakEarly = () => {
    endFocusSession(true)
  }

  const endFocusSession = useCallback((completed = true) => {
    if (activeFocus.isActive) {
      const elapsedSeconds = activeFocus.totalDurationSeconds - activeFocus.remainingSeconds
      if (elapsedSeconds > 60 || completed) {
        const newSession: FocusSession = {
          id: `session-${Date.now()}`,
          subjectId: activeFocus.subjectId,
          subjectName: activeFocus.subjectName,
          taskTitle: activeFocus.taskTitle,
          targetDurationMinutes: Math.round(activeFocus.totalDurationSeconds / 60),
          actualDurationSeconds: Math.max(60, elapsedSeconds),
          breakDurationMinutes: Math.round(activeFocus.totalBreakSeconds / 60),
          startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
          completedAt: new Date().toISOString(),
          interruptedCount: activeFocus.interruptedCount,
          interruptionMinutes: Math.round(activeFocus.interruptionSeconds / 60),
          preset: activeFocus.preset,
          rating: completed ? 5 : 3
        }
        setFocusSessions((prev) => [newSession, ...prev])

        setTasks((prev) =>
          prev.map((t) => {
            if (t.title === activeFocus.taskTitle && t.date === getTodayDateString()) {
              return { ...t, status: 'completed', completedAt: new Date().toTimeString().slice(0, 5) }
            }
            return t
          })
        )
      }
    }

    soundManager.stopAmbient()
    setActiveFocus({
      isActive: false,
      isPaused: false,
      isBreak: false,
      subjectId: '',
      subjectName: '',
      taskTitle: '',
      preset: '45-10',
      totalDurationSeconds: 45 * 60,
      remainingSeconds: 45 * 60,
      breakRemainingSeconds: 10 * 60,
      totalBreakSeconds: 10 * 60,
      interruptedCount: 0,
      interruptionSeconds: 0
    })
  }, [activeFocus])

  // Timer Tick effect
  useEffect(() => {
    if (!activeFocus.isActive || activeFocus.isPaused) return

    const interval = setInterval(() => {
      setActiveFocus((prev) => {
        if (!prev.isBreak) {
          if (prev.remainingSeconds <= 1) {
            if (settings.soundEnabled) {
              soundManager.playCompletionFanfare()
            }
            soundManager.stopAmbient()
            return {
              ...prev,
              remainingSeconds: 0,
              isBreak: true
            }
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1
          }
        } else {
          if (prev.breakRemainingSeconds <= 1) {
            if (settings.soundEnabled && settings.breakEnforcementAlert) {
              soundManager.playBreakEndingAlert()
            }
            if (settings.browserNotificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('🚨 Break Is Over! Time to Focus!', {
                body: `Your break for ${prev.subjectName} has ended. Return to your study session now!`,
                icon: '🎯'
              })
            }
            return {
              ...prev,
              breakRemainingSeconds: 0
            }
          }
          return {
            ...prev,
            breakRemainingSeconds: prev.breakRemainingSeconds - 1
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeFocus.isActive, activeFocus.isPaused, settings])

  // Tab Leave & In-App Distraction Tracking
  useEffect(() => {
    if (!settings.tabLeaveDetection) return

    let blurTimestamp: number | null = null

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (activeFocus.isActive && !activeFocus.isPaused && !activeFocus.isBreak) {
          blurTimestamp = Date.now()
        }
      } else {
        if (blurTimestamp && activeFocus.isActive && !activeFocus.isBreak) {
          const secondsAway = Math.round((Date.now() - blurTimestamp) / 1000)
          blurTimestamp = null
          if (secondsAway >= 15) {
            setTabAwayNotice({ show: true, seconds: secondsAway })
            setActiveFocus((prev) => ({
              ...prev,
              interruptedCount: prev.interruptedCount + 1,
              interruptionSeconds: prev.interruptionSeconds + secondsAway
            }))
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [activeFocus.isActive, activeFocus.isPaused, activeFocus.isBreak, settings.tabLeaveDetection])

  const dismissTabAwayNotice = (asDistraction = false) => {
    if (tabAwayNotice && asDistraction) {
      addDistractionLog({
        appOrWebsite: 'Switched Browser Tab / External App',
        category: 'other',
        minutesLost: Math.max(1, Math.round(tabAwayNotice.seconds / 60)),
        trigger: 'Switched tabs away from Focus Session'
      })
    }
    setTabAwayNotice(null)
  }

  // Distraction actions
  const addDistractionLog = (log: Omit<DistractionLog, 'id' | 'timestamp'>) => {
    const newLog: DistractionLog = {
      ...log,
      id: `dist-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    setDistractionLogs((prev) => [newLog, ...prev])
  }

  const deleteDistractionLog = (id: string) => {
    setDistractionLogs((prev) => prev.filter((d) => d.id !== id))
  }

  const addDistractionItem = (item: Omit<DistractionItem, 'id'>) => {
    const newItem: DistractionItem = {
      ...item,
      id: `item-${Date.now()}`
    }
    setDistractionItems((prev) => [...prev, newItem])
  }

  const deleteDistractionItem = (id: string) => {
    setDistractionItems((prev) => prev.filter((i) => i.id !== id))
  }

  const toggleDistractionItemBlock = (id: string) => {
    setDistractionItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isBlockedInFocus: !i.isBlockedInFocus } : i))
    )
  }

  // Settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      if (updates.ambientSound !== undefined || updates.ambientVolume !== undefined) {
        if (next.ambientSound !== 'none' && activeFocus.isActive && !activeFocus.isPaused) {
          soundManager.startAmbient(next.ambientSound, next.ambientVolume)
        } else {
          soundManager.stopAmbient()
        }
      }
      return next
    })
  }

  // Summary calculations
  const summary: ProductivitySummary = useMemo(() => {
    const todayStr = getTodayDateString()

    const todaySessions = focusSessions.filter((s) => s.startedAt.startsWith(todayStr))
    const sessionMinutes = Math.round(
      todaySessions.reduce((acc, s) => acc + s.actualDurationSeconds, 0) / 60
    )

    const completedTasks = tasks.filter((t) => t.date === todayStr && t.status === 'completed')
    const completedTaskMinutes = completedTasks.reduce((acc, t) => acc + t.durationMinutes, 0)

    const totalProductiveMinutes = Math.max(sessionMinutes, completedTaskMinutes)

    const todayDistractions = distractionLogs.filter((d) => d.timestamp.startsWith(todayStr))
    const totalWastedMinutes = todayDistractions.reduce((acc, d) => acc + d.minutesLost, 0)

    const preventedCount = todayDistractions.filter((d) => d.preventedByShield).length
    const baselineSaved = Math.round(totalProductiveMinutes * 0.35)
    const shieldSaved = preventedCount * 25
    const totalSavedMinutes = Math.max(30, baselineSaved + shieldSaved)

    const dailyTargetMinutes = profile.targetDailyStudyHours * 60
    const dailyGoalAdherencePercent = Math.min(
      100,
      Math.round((totalProductiveMinutes / dailyTargetMinutes) * 100)
    )

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const weeklyTrend = days.map((day, idx) => {
      const factor = idx === 6 ? 0.9 : 0.75 + (idx % 3) * 0.15
      const prodM = Math.round(totalProductiveMinutes * factor) || 210
      const wasteM = Math.round(totalWastedMinutes * (1.2 - idx * 0.08)) || 35
      return {
        day,
        productiveMinutes: prodM,
        wastedMinutes: wasteM,
        goalMinutes: dailyTargetMinutes
      }
    })

    return {
      totalProductiveMinutes,
      totalWastedMinutes,
      totalSavedMinutes,
      sessionsCompletedToday: todaySessions.length,
      dailyGoalAdherencePercent,
      weeklyTrend
    }
  }, [focusSessions, tasks, distractionLogs, profile.targetDailyStudyHours])

  // Data management
  const resetToDemoData = () => {
    setProfile(initialProfile)
    setSubjects(initialSubjects)
    setTasks(initialTasks)
    setFocusSessions(initialFocusSessions)
    setDistractionLogs(initialDistractionLogs)
    setDistractionItems(initialDistractionItems)
    setSettings(initialSettings)
  }

  const clearAllData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const exportDataJSON = () => {
    const data = {
      profile,
      subjects,
      tasks,
      focusSessions,
      distractionLogs,
      distractionItems,
      settings,
      githubSync,
      authUser,
      exportedAt: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr)
      if (parsed.profile) setProfile(parsed.profile)
      if (parsed.subjects) setSubjects(parsed.subjects)
      if (parsed.tasks) setTasks(parsed.tasks)
      if (parsed.focusSessions) setFocusSessions(parsed.focusSessions)
      if (parsed.distractionLogs) setDistractionLogs(parsed.distractionLogs)
      if (parsed.distractionItems) setDistractionItems(parsed.distractionItems)
      if (parsed.settings) setSettings(parsed.settings)
      if (parsed.githubSync) setGithubSync(parsed.githubSync)
      if (parsed.authUser) setAuthUser(parsed.authUser)
      return true
    } catch {
      return false
    }
  }

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        updateProfile,
        subjects,
        addSubject,
        deleteSubject,
        updateSubject,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        rescheduleIncompleteTasks,
        generateSmartTimetable,
        focusSessions,
        activeFocus,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        endFocusSession,
        skipToBreak,
        endBreakEarly,
        distractionLogs,
        addDistractionLog,
        deleteDistractionLog,
        distractionItems,
        addDistractionItem,
        deleteDistractionItem,
        toggleDistractionItemBlock,
        settings,
        updateSettings,
        summary,
        resetToDemoData,
        clearAllData,
        exportDataJSON,
        importDataJSON,
        showOnboardingModal,
        setShowOnboardingModal,
        showLogDistractionModal,
        setShowLogDistractionModal,
        tabAwayNotice,
        dismissTabAwayNotice,
        authUser,
        login,
        logout,
        githubSync,
        connectGitHub,
        disconnectGitHub,
        showDistractionMaintenanceModal,
        setShowDistractionMaintenanceModal,
        handleDistractionTabClick,
        maintenanceToast,
        setMaintenanceToast
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
