import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
  AuthUser,
  FocusFlowSnapshot
} from '../types'
import {
  initialProfile,
  initialSubjects,
  initialTasks,
  initialFocusSessions,
  initialDistractionLogs,
  initialDistractionItems,
  initialSettings,
  LEGACY_DEMO_IDS,
  LEGACY_DEMO_SUBJECT_IDS,
  LEGACY_DEMO_PROFILE_NAME
} from '../data/defaults'
import { getTodayDateString, getLocalDateOf, toLocalDateString } from '../utils/formatters'
import { soundManager } from '../utils/sound'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut, updateProfile as updateFirebaseProfile } from 'firebase/auth'
import { firebaseAuth } from '../firebase'
import { deleteRemoteState, loadRemoteState, saveRemoteState } from '../utils/remoteStore'

const STORAGE_KEY_PREFIX = 'focusflow_v2_'

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// Earlier versions seeded every browser with a fake student's history. Strip those records once
// so returning users only see what they actually did.
function purgeLegacyDemoData() {
  const flagKey = `${STORAGE_KEY_PREFIX}demo_purged`
  if (localStorage.getItem(flagKey)) return

  const write = (key: string, value: unknown) =>
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(value))
  const withoutDemo = <T extends { id: string }>(items: T[]) => items.filter((i) => !LEGACY_DEMO_IDS.has(i.id))

  const tasks = withoutDemo(readStored<TimetableTask[]>('tasks', []))
  const sessions = withoutDemo(readStored<FocusSession[]>('sessions', []))
  write('tasks', tasks)
  write('sessions', sessions)
  write('distractions', withoutDemo(readStored<DistractionLog[]>('distractions', [])))
  write('distraction_items', withoutDemo(readStored<DistractionItem[]>('distraction_items', [])))

  const usedSubjectIds = new Set([...tasks, ...sessions].map((x) => x.subjectId))
  write(
    'subjects',
    readStored<Subject[]>('subjects', []).filter(
      (s) => !LEGACY_DEMO_SUBJECT_IDS.has(s.id) || usedSubjectIds.has(s.id)
    )
  )

  const storedProfile = readStored<StudentProfile | null>('profile', null)
  if (storedProfile?.name === LEGACY_DEMO_PROFILE_NAME) write('profile', initialProfile)

  localStorage.setItem(flagKey, '1')
}

purgeLegacyDemoData()

function hasBrowserData(state: FocusFlowSnapshot): boolean {
  return Boolean(
    JSON.stringify(state.profile) !== JSON.stringify(initialProfile) ||
    state.subjects.length ||
    state.tasks.length ||
    state.focusSessions.length ||
    state.distractionLogs.length ||
    state.distractionItems.length ||
    JSON.stringify(state.settings) !== JSON.stringify(initialSettings)
  )
}

export type DatabaseSyncStatus = 'loading' | 'ready' | 'offline' | 'import-needed' | 'saving'

function computeStreak(activeDates: Set<string>): number {
  const cursor = new Date()
  if (!activeDates.has(toLocalDateString(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (activeDates.has(toLocalDateString(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

const idleFocusState = {
  isActive: false,
  isPaused: false,
  isBreak: false,
  subjectId: '',
  subjectName: '',
  taskTitle: '',
  preset: '45-10' as const,
  totalDurationSeconds: 45 * 60,
  remainingSeconds: 45 * 60,
  breakRemainingSeconds: 10 * 60,
  totalBreakSeconds: 10 * 60,
  interruptedCount: 0,
  interruptionSeconds: 0,
  focusedSeconds: 0
}

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
  focusedSeconds: number
}

interface AppContextType {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  profile: StudentProfile
  updateProfile: (profile: Partial<StudentProfile>) => void
  subjects: Subject[]
  addSubject: (subject: Omit<Subject, 'id'>) => void
  addSubjects: (subjects: Omit<Subject, 'id'>[]) => Subject[]
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
    subjectPool?: Subject[]
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
  resetAllData: () => void
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
  authUserId: string
  authReady: boolean
  databaseReady: boolean
  databaseUserId: string
  databaseStatus: DatabaseSyncStatus
  databaseError: string
  needsLegacyImport: boolean
  confirmBrowserDataImport: () => Promise<void>
  startFreshInDatabase: () => void
  retryDatabaseSync: () => void
  login: (email: string, password: string, signUp: boolean, name?: string) => Promise<void>
  loginAsGuest: (name: string) => Promise<void>
  logout: () => Promise<void>
  githubSync: GitHubSyncState
  connectGitHub: (username: string, repoName: string) => void
  disconnectGitHub: () => void
  showDistractionMaintenanceModal: boolean
  setShowDistractionMaintenanceModal: (show: boolean) => void
  handleDistractionTabClick: () => void
  maintenanceToast: boolean
  setMaintenanceToast: (val: boolean) => void
}

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

  // Firebase is the source of truth for authentication, not the previous demo session.
  const [authUser, setAuthUser] = useState<AuthUser>({
    isAuthenticated: false,
    email: '',
    name: '',
    provider: 'email'
  })
  const [authReady, setAuthReady] = useState(false)
  const [authUserId, setAuthUserId] = useState('')
  const [databaseReady, setDatabaseReady] = useState(false)
  const [databaseUserId, setDatabaseUserId] = useState('')
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseSyncStatus>('loading')
  const [databaseError, setDatabaseError] = useState('')
  const [needsLegacyImport, setNeedsLegacyImport] = useState(false)
  const [databaseRetryVersion, setDatabaseRetryVersion] = useState(0)
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve())

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthReady(true)
      return
    }
    return onAuthStateChanged(firebaseAuth, (user) => {
      setAuthUserId(user?.uid || '')
      setDatabaseUserId('')
      setDatabaseReady(!user)
      setNeedsLegacyImport(false)
      setDatabaseStatus(user ? 'loading' : 'ready')
      setDatabaseError('')
      setAuthUser(user ? {
        isAuthenticated: true,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Student',
        provider: user.isAnonymous ? 'guest' : 'email'
      } : { isAuthenticated: false, email: '', name: '', provider: 'email' })
      setAuthReady(true)
    })
  }, [])

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
  const [storedProfile, setProfile] = useState<StudentProfile>(() => ({
    ...initialProfile,
    ...readStored<Partial<StudentProfile>>('profile', {})
  }))
  const [subjects, setSubjects] = useState<Subject[]>(() => readStored('subjects', initialSubjects))
  const [tasks, setTasks] = useState<TimetableTask[]>(() => readStored('tasks', initialTasks))
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() =>
    readStored('sessions', initialFocusSessions)
  )
  const [distractionLogs, setDistractionLogs] = useState<DistractionLog[]>(() =>
    readStored('distractions', initialDistractionLogs)
  )
  const [distractionItems, setDistractionItems] = useState<DistractionItem[]>(() =>
    readStored('distraction_items', initialDistractionItems)
  )
  const [settings, setSettings] = useState<AppSettings>(() => ({
    ...initialSettings,
    ...readStored<Partial<AppSettings>>('settings', {})
  }))
  const snapshot = useMemo<FocusFlowSnapshot>(() => ({
    profile: storedProfile,
    subjects,
    tasks,
    focusSessions,
    distractionLogs,
    distractionItems,
    settings
  }), [storedProfile, subjects, tasks, focusSessions, distractionLogs, distractionItems, settings])
  const snapshotRef = useRef(snapshot)

  useEffect(() => {
    snapshotRef.current = snapshot
  }, [snapshot])

  // Streak is derived from real focus sessions, never stored or typed in by hand.
  const streakDays = useMemo(
    () => computeStreak(new Set(focusSessions.map((s) => getLocalDateOf(s.startedAt)))),
    [focusSessions]
  )
  const lastActiveDate = useMemo(
    () => focusSessions.reduce((latest, s) => {
      const d = getLocalDateOf(s.startedAt)
      return d > latest ? d : latest
    }, ''),
    [focusSessions]
  )
  const profile = useMemo<StudentProfile>(
    () => ({ ...storedProfile, streakDays, lastActiveDate }),
    [storedProfile, streakDays, lastActiveDate]
  )

  // Modals & UI states
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(!profile.onboardingCompleted)
  const [showLogDistractionModal, setShowLogDistractionModal] = useState<boolean>(false)
  const [tabAwayNotice, setTabAwayNotice] = useState<{ show: boolean; seconds: number } | null>(null)

  // Active focus session state
  const [activeFocus, setActiveFocus] = useState<ActiveFocusState>(idleFocusState)

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}github`, JSON.stringify(githubSync))
  }, [githubSync])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(storedProfile))
  }, [storedProfile])

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

  useEffect(() => {
    if (!authReady) return

    const user = firebaseAuth?.currentUser
    if (!user || !authUserId || user.uid !== authUserId) return

    let active = true
    const loadUserData = async () => {
      try {
        const remoteState = await loadRemoteState(await user.getIdToken())
        if (!active) return

        if (remoteState) {
          setProfile(remoteState.profile)
          setSubjects(remoteState.subjects)
          setTasks(remoteState.tasks)
          setFocusSessions(remoteState.focusSessions)
          setDistractionLogs(remoteState.distractionLogs)
          setDistractionItems(remoteState.distractionItems)
          setSettings(remoteState.settings)
          setDatabaseStatus('ready')
        } else if (hasBrowserData(snapshotRef.current)) {
          setNeedsLegacyImport(true)
          setDatabaseStatus('import-needed')
        } else {
          setDatabaseStatus('ready')
        }

        setDatabaseUserId(user.uid)
        setDatabaseReady(true)
      } catch (error) {
        if (!active) return
        setDatabaseUserId(user.uid)
        setDatabaseReady(true)
        setDatabaseStatus('offline')
        setDatabaseError(error instanceof Error ? error.message : 'Could not connect to your account data.')
      }
    }

    void loadUserData()
    return () => { active = false }
  }, [authReady, authUserId, databaseRetryVersion])

  useEffect(() => {
    if (
      !authReady ||
      !authUserId ||
      !databaseReady ||
      databaseUserId !== authUserId ||
      needsLegacyImport
    ) return

    const user = firebaseAuth?.currentUser
    if (!user || user.uid !== authUserId) return

    let active = true
    const timer = window.setTimeout(() => {
      setDatabaseStatus('saving')
      setDatabaseError('')
      saveQueueRef.current = saveQueueRef.current
        .catch(() => {})
        .then(async () => {
          const currentUser = firebaseAuth?.currentUser
          if (!currentUser || currentUser.uid !== authUserId) return
          await saveRemoteState(await currentUser.getIdToken(), snapshot)
          if (active) setDatabaseStatus('ready')
        })
        .catch((error: unknown) => {
          if (!active) return
          setDatabaseStatus('offline')
          setDatabaseError(error instanceof Error ? error.message : 'Could not save your account data.')
        })
    }, 600)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [authReady, authUserId, databaseReady, databaseUserId, needsLegacyImport, snapshot])

  // Auth handlers
  const login = async (email: string, password: string, signUp: boolean, name?: string) => {
    if (!firebaseAuth) throw new Error('Firebase is not configured. Please contact the app administrator.')
    const result = signUp
      ? await createUserWithEmailAndPassword(firebaseAuth, email, password)
      : await signInWithEmailAndPassword(firebaseAuth, email, password)
    if (signUp && name?.trim()) {
      try {
        await updateFirebaseProfile(result.user, { displayName: name.trim() })
      } catch {
        // Account creation already succeeded; a profile update must not report it as a failed signup.
      }
    }
    setAuthUserId(result.user.uid)
    setAuthUser({
      isAuthenticated: true,
      email: result.user.email || '',
      name: result.user.displayName || email.split('@')[0],
      provider: 'email'
    })
    setActiveTab('dashboard')
  }

  const loginAsGuest = async (name: string) => {
    if (!firebaseAuth) throw new Error('Firebase is not configured. Please contact the app administrator.')
    const displayName = name.trim()
    if (!displayName) throw new Error('Please enter your name.')
    const result = await signInAnonymously(firebaseAuth)
    try {
      await updateFirebaseProfile(result.user, { displayName })
    } catch {
      await signOut(firebaseAuth)
      throw new Error('Could not save your guest name. Please try again.')
    }
    setProfile((previous) => ({ ...previous, name: displayName }))
    setAuthUserId(result.user.uid)
    setAuthUser({ isAuthenticated: true, name: displayName, provider: 'guest' })
    setActiveTab('dashboard')
  }

  const logout = async () => {
    if (!firebaseAuth) return
    await signOut(firebaseAuth)
    setAuthUserId('')
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

  const addSubjects = (newSubs: Omit<Subject, 'id'>[]): Subject[] => {
    const existingNames = new Set(subjects.map((s) => s.name.toLowerCase()))
    const created = newSubs
      .filter((s) => !existingNames.has(s.name.toLowerCase()))
      .map((s, i) => ({ ...s, id: `sub-${Date.now()}-${i}` }))
    if (created.length > 0) setSubjects((prev) => [...prev, ...created])
    return [...subjects, ...created]
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
    selectedSubjectIds,
    subjectPool = subjects
  }: {
    startHour: number
    endHour: number
    focusDurationMinutes: number
    breakDurationMinutes: number
    selectedSubjectIds: string[]
    subjectPool?: Subject[]
  }) => {
    const targetSubjects = subjectPool.filter((s) =>
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
      interruptionSeconds: 0,
      focusedSeconds: 0
    })

    if (settings.soundEnabled) {
      soundManager.playStartChime()
    }
    if (settings.ambientSound !== 'none' && settings.ambientSound !== 'lofi') {
      soundManager.startAmbient(settings.ambientSound, settings.ambientVolume)
    }
  }

  const pauseFocusSession = () => {
    setActiveFocus((prev) => ({ ...prev, isPaused: true }))
    soundManager.stopAmbient()
  }

  const resumeFocusSession = () => {
    setActiveFocus((prev) => ({ ...prev, isPaused: false }))
    if (settings.ambientSound !== 'none' && settings.ambientSound !== 'lofi') {
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

  const endFocusSession = useCallback((_completed = true) => {
    if (activeFocus.isActive) {
      // Only seconds the timer actually ran count, minus time spent away from the tab.
      const productiveSeconds = Math.max(0, activeFocus.focusedSeconds - activeFocus.interruptionSeconds)
      if (productiveSeconds >= 60) {
        const newSession: FocusSession = {
          id: `session-${Date.now()}`,
          subjectId: activeFocus.subjectId,
          subjectName: activeFocus.subjectName,
          taskTitle: activeFocus.taskTitle,
          targetDurationMinutes: Math.round(activeFocus.totalDurationSeconds / 60),
          actualDurationSeconds: productiveSeconds,
          breakDurationMinutes: Math.round(activeFocus.totalBreakSeconds / 60),
          startedAt: new Date(Date.now() - activeFocus.focusedSeconds * 1000).toISOString(),
          completedAt: new Date().toISOString(),
          interruptedCount: activeFocus.interruptedCount,
          interruptionMinutes: Math.round(activeFocus.interruptionSeconds / 60),
          preset: activeFocus.preset
        }
        setFocusSessions((prev) => [newSession, ...prev])

        // A planned task is only marked done once its focus block reached the break.
        if (activeFocus.isBreak) {
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
    }

    soundManager.stopAmbient()
    setActiveFocus(idleFocusState)
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
              focusedSeconds: prev.focusedSeconds + 1,
              isBreak: true
            }
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
            focusedSeconds: prev.focusedSeconds + 1
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
        if (next.ambientSound !== 'none' && next.ambientSound !== 'lofi' && activeFocus.isActive && !activeFocus.isPaused && !activeFocus.isBreak) {
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
    const dailyTargetMinutes = profile.targetDailyStudyHours * 60

    const realLosses = distractionLogs.filter((d) => !d.preventedByShield && d.minutesLost > 0)
    const avgMinutesLostPerDistraction =
      realLosses.length > 0 ? realLosses.reduce((a, d) => a + d.minutesLost, 0) / realLosses.length : 0

    const statsForDate = (dateStr: string) => {
      const daySessions = focusSessions.filter((s) => getLocalDateOf(s.startedAt) === dateStr)
      const sessionMinutes = daySessions.reduce((acc, s) => acc + s.actualDurationSeconds, 0) / 60

      // Tasks ticked off manually (without a timer session) still represent study the user reported.
      const sessionTitles = new Set(daySessions.map((s) => s.taskTitle))
      const manualTaskMinutes = tasks
        .filter((t) => t.date === dateStr && t.status === 'completed' && !sessionTitles.has(t.title))
        .reduce((acc, t) => acc + t.durationMinutes, 0)

      const dayDistractions = distractionLogs.filter((d) => getLocalDateOf(d.timestamp) === dateStr)
      const wastedMinutes = dayDistractions
        .filter((d) => !d.preventedByShield)
        .reduce((acc, d) => acc + d.minutesLost, 0)
      const preventedCount = dayDistractions.filter((d) => d.preventedByShield).length

      return {
        sessions: daySessions.length,
        productiveMinutes: Math.round(sessionMinutes + manualTaskMinutes),
        wastedMinutes: Math.round(wastedMinutes),
        savedMinutes: Math.round(preventedCount * avgMinutesLostPerDistraction)
      }
    }

    const today = statsForDate(getTodayDateString())

    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = toLocalDateString(date)
      const stats = statsForDate(dateStr)
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        productiveMinutes: stats.productiveMinutes,
        wastedMinutes: stats.wastedMinutes,
        goalMinutes: dailyTargetMinutes
      }
    })

    const weekProductive = weeklyTrend.reduce((a, d) => a + d.productiveMinutes, 0)
    const weekWasted = weeklyTrend.reduce((a, d) => a + d.wastedMinutes, 0)
    const focusScorePercent =
      weekProductive + weekWasted > 0 ? Math.round((weekProductive / (weekProductive + weekWasted)) * 100) : 0

    const averageSessionMinutes =
      focusSessions.length > 0
        ? Math.round(focusSessions.reduce((a, s) => a + s.actualDurationSeconds, 0) / focusSessions.length / 60)
        : 0

    return {
      totalProductiveMinutes: today.productiveMinutes,
      totalWastedMinutes: today.wastedMinutes,
      totalSavedMinutes: today.savedMinutes,
      sessionsCompletedToday: today.sessions,
      dailyGoalAdherencePercent:
        dailyTargetMinutes > 0 ? Math.min(100, Math.round((today.productiveMinutes / dailyTargetMinutes) * 100)) : 0,
      weeklyTrend,
      focusScorePercent,
      averageSessionMinutes,
      streakDays,
      totalSessionsAllTime: focusSessions.length,
      hasActivity: focusSessions.length > 0 || distractionLogs.length > 0 || tasks.some((t) => t.status === 'completed')
    }
  }, [focusSessions, tasks, distractionLogs, profile.targetDailyStudyHours, streakDays])

  const confirmBrowserDataImport = async () => {
    const user = firebaseAuth?.currentUser
    if (!user || user.uid !== databaseUserId) return

    setDatabaseStatus('saving')
    setDatabaseError('')
    try {
      await saveRemoteState(await user.getIdToken(), snapshotRef.current)
      setNeedsLegacyImport(false)
      setDatabaseStatus('ready')
    } catch (error) {
      setDatabaseStatus('import-needed')
      setDatabaseError(error instanceof Error ? error.message : 'Could not import this browser data.')
    }
  }

  const startFreshInDatabase = () => {
    const accountName = firebaseAuth?.currentUser?.displayName || authUser.name
    setProfile({ ...initialProfile, name: accountName })
    setSubjects(initialSubjects)
    setTasks(initialTasks)
    setFocusSessions(initialFocusSessions)
    setDistractionLogs(initialDistractionLogs)
    setDistractionItems(initialDistractionItems)
    setSettings(initialSettings)
    setActiveFocus(idleFocusState)
    setShowOnboardingModal(true)
    setNeedsLegacyImport(false)
    setDatabaseError('')
    setDatabaseStatus('ready')
  }

  const retryDatabaseSync = () => {
    setDatabaseReady(false)
    setDatabaseUserId('')
    setNeedsLegacyImport(false)
    setDatabaseStatus('loading')
    setDatabaseError('')
    setDatabaseRetryVersion((version) => version + 1)
  }

  // Data management
  const resetAllData = () => {
    setProfile(initialProfile)
    setSubjects(initialSubjects)
    setTasks(initialTasks)
    setFocusSessions(initialFocusSessions)
    setDistractionLogs(initialDistractionLogs)
    setDistractionItems(initialDistractionItems)
    setSettings(initialSettings)
    setActiveFocus(idleFocusState)
    setShowOnboardingModal(true)
  }

  const clearAllData = async () => {
    const user = firebaseAuth?.currentUser
    if (user) await deleteRemoteState(await user.getIdToken())
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
        addSubjects,
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
        resetAllData,
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
        authUserId,
        authReady,
        databaseReady,
        databaseUserId,
        databaseStatus,
        databaseError,
        needsLegacyImport,
        confirmBrowserDataImport,
        startFreshInDatabase,
        retryDatabaseSync,
        login,
        loginAsGuest,
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
