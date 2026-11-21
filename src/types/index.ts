export type ThemeMode = 'dark' | 'light'

export type PriorityLevel = 'high' | 'medium' | 'low'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'rescheduled'

export interface StudyChapter {
  id: string
  title: string
  completed: boolean
}

export interface Subject {
  id: string
  name: string
  color: string
  priority: PriorityLevel
  weeklyGoalHours: number
  chapters?: StudyChapter[]
}

export interface TimetableTask {
  id: string
  subjectId: string
  subjectName: string
  title: string
  startTime: string
  endTime: string
  durationMinutes: number
  status: TaskStatus
  date: string
  notes?: string
  priority: PriorityLevel
  completedAt?: string
  chapterId?: string
}

export interface FocusSession {
  id: string
  subjectId: string
  subjectName: string
  taskTitle: string
  targetDurationMinutes: number
  actualDurationSeconds: number
  breakDurationMinutes: number
  startedAt: string
  completedAt?: string
  interruptedCount: number
  interruptionMinutes: number
  preset: '45-10' | '25-5' | '5-min-starter' | 'custom'
  rating?: number
  reflection?: string
}

export interface DistractionLog {
  id: string
  appOrWebsite: string
  category: 'social_media' | 'short_video' | 'gaming' | 'messaging' | 'daydreaming' | 'other'
  minutesLost: number
  timestamp: string
  trigger: string
  preventedByShield?: boolean
}

export interface DistractionItem {
  id: string
  name: string
  category: 'social_media' | 'short_video' | 'gaming' | 'messaging' | 'other'
  severity: 'high' | 'medium' | 'low'
  isBlockedInFocus: boolean
  dailyLimitMinutes?: number
}

export interface StudentProfile {
  name: string
  gradeOrExam: string
  targetDailyStudyHours: number
  preferredFocusMinutes: number
  preferredBreakMinutes: number
  companionName: string
  companionTone: 'encouraging' | 'strict' | 'friendly'
  checkInIntervalMinutes: number
  streakDays: number
  lastActiveDate: string
  onboardingCompleted: boolean
}

export interface GitHubSyncState {
  isConnected: boolean
  username?: string
  repoName?: string
  branch?: string
  lastSyncedAt?: string
}

export interface AuthUser {
  isAuthenticated: boolean
  email?: string
  name: string
  provider: 'email' | 'github' | 'demo' | 'guest'
}

export interface AppSettings {
  theme: ThemeMode
  soundEnabled: boolean
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'lofi' | 'waves'
  ambientVolume: number
  browserNotificationsEnabled: boolean
  tabLeaveDetection: boolean
  breakEnforcementAlert: boolean
  fiveMinuteStarterRule: boolean
}

export interface FocusFlowSnapshot {
  profile: StudentProfile
  subjects: Subject[]
  tasks: TimetableTask[]
  focusSessions: FocusSession[]
  distractionLogs: DistractionLog[]
  distractionItems: DistractionItem[]
  settings: AppSettings
}

export interface ProductivitySummary {
  totalProductiveMinutes: number
  totalWastedMinutes: number
  totalSavedMinutes: number
  sessionsCompletedToday: number
  dailyGoalAdherencePercent: number
  weeklyTrend: { day: string; date: string; productiveMinutes: number; wastedMinutes: number; goalMinutes: number }[]
  focusScorePercent: number
  averageSessionMinutes: number
  streakDays: number
  totalSessionsAllTime: number
  hasActivity: boolean
}
