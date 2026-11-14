import {
  StudentProfile,
  Subject,
  TimetableTask,
  FocusSession,
  DistractionLog,
  DistractionItem,
  AppSettings
} from '../types'

// Every new user starts with a blank slate. All stats are derived from what they actually do.
export const initialProfile: StudentProfile = {
  name: '',
  gradeOrExam: '',
  targetDailyStudyHours: 4,
  preferredFocusMinutes: 45,
  preferredBreakMinutes: 10,
  companionName: 'StudyBot',
  companionTone: 'encouraging',
  checkInIntervalMinutes: 20,
  streakDays: 0,
  lastActiveDate: '',
  onboardingCompleted: false
}

export const initialSubjects: Subject[] = []
export const initialTasks: TimetableTask[] = []
export const initialFocusSessions: FocusSession[] = []
export const initialDistractionLogs: DistractionLog[] = []
export const initialDistractionItems: DistractionItem[] = []

export const initialSettings: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  ambientSound: 'none',
  ambientVolume: 0.35,
  browserNotificationsEnabled: true,
  tabLeaveDetection: true,
  breakEnforcementAlert: true,
  fiveMinuteStarterRule: true
}

export const GENERAL_SUBJECT: Subject = {
  id: 'general',
  name: 'General Study',
  color: '#8ab4f8',
  priority: 'medium',
  weeklyGoalHours: 0
}

// IDs of the sample records older versions pre-loaded into every browser.
export const LEGACY_DEMO_IDS = new Set([
  'task-1', 'task-2', 'task-3', 'task-4', 'task-5',
  'session-1', 'session-2', 'session-prev-1', 'session-prev-2',
  'dist-1', 'dist-2', 'dist-3',
  'item-1', 'item-2', 'item-3', 'item-4', 'item-5'
])
export const LEGACY_DEMO_SUBJECT_IDS = new Set(['sub-phy', 'sub-chem', 'sub-math', 'sub-cs', 'sub-eng'])
export const LEGACY_DEMO_PROFILE_NAME = 'Aarav Sharma'
