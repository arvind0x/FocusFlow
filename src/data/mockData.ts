import {
  StudentProfile,
  Subject,
  TimetableTask,
  FocusSession,
  DistractionLog,
  DistractionItem,
  AppSettings
} from '../types'
import { getTodayDateString } from '../utils/formatters'

export const initialProfile: StudentProfile = {
  name: 'Aarav Sharma',
  gradeOrExam: 'Class 11 — JEE Main & Boards Aspirant',
  targetDailyStudyHours: 5.5,
  preferredFocusMinutes: 45,
  preferredBreakMinutes: 10,
  companionName: 'StudyBot',
  companionTone: 'encouraging',
  checkInIntervalMinutes: 20,
  streakDays: 6,
  lastActiveDate: getTodayDateString(),
  onboardingCompleted: true
}

export const initialSubjects: Subject[] = [
  {
    id: 'sub-phy',
    name: 'Physics',
    color: '#3b82f6', // blue
    priority: 'high',
    weeklyGoalHours: 12
  },
  {
    id: 'sub-chem',
    name: 'Chemistry',
    color: '#10b981', // emerald
    priority: 'high',
    weeklyGoalHours: 10
  },
  {
    id: 'sub-math',
    name: 'Mathematics',
    color: '#8b5cf6', // purple
    priority: 'high',
    weeklyGoalHours: 14
  },
  {
    id: 'sub-cs',
    name: 'Computer Science',
    color: '#f59e0b', // amber
    priority: 'medium',
    weeklyGoalHours: 6
  },
  {
    id: 'sub-eng',
    name: 'English',
    color: '#ec4899', // pink
    priority: 'low',
    weeklyGoalHours: 4
  }
]

const today = getTodayDateString()

export const initialTasks: TimetableTask[] = [
  {
    id: 'task-1',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    title: 'Rotational Motion: Moment of Inertia numericals (Q1 - Q15)',
    startTime: '16:00',
    endTime: '16:45',
    durationMinutes: 45,
    status: 'completed',
    date: today,
    priority: 'high',
    completedAt: '16:46'
  },
  {
    id: 'task-2',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    title: 'Chemical Bonding: Hybridization & Molecular Orbital Theory revision',
    startTime: '17:00',
    endTime: '17:45',
    durationMinutes: 45,
    status: 'completed',
    date: today,
    priority: 'high',
    completedAt: '17:48'
  },
  {
    id: 'task-3',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    title: 'Limits & Derivatives: Standard limits and L\'Hôpital rule practice',
    startTime: '18:00',
    endTime: '18:45',
    durationMinutes: 45,
    status: 'in_progress',
    date: today,
    priority: 'high'
  },
  {
    id: 'task-4',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science',
    title: 'Python Data Structures: Stack implementation using Lists',
    startTime: '19:15',
    endTime: '20:00',
    durationMinutes: 45,
    status: 'pending',
    date: today,
    priority: 'medium'
  },
  {
    id: 'task-5',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    title: 'Formula Flashcards Review & Error Log Analysis',
    startTime: '20:30',
    endTime: '21:15',
    durationMinutes: 45,
    status: 'pending',
    date: today,
    priority: 'medium'
  }
]

export const initialFocusSessions: FocusSession[] = [
  {
    id: 'session-1',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    taskTitle: 'Rotational Motion: Moment of Inertia numericals (Q1 - Q15)',
    targetDurationMinutes: 45,
    actualDurationSeconds: 45 * 60,
    breakDurationMinutes: 10,
    startedAt: `${today}T16:00:00`,
    completedAt: `${today}T16:45:00`,
    interruptedCount: 0,
    interruptionMinutes: 0,
    preset: '45-10',
    rating: 5,
    reflection: 'Finished all 15 questions without checking my phone once!'
  },
  {
    id: 'session-2',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    taskTitle: 'Chemical Bonding: Hybridization & MOT revision',
    targetDurationMinutes: 45,
    actualDurationSeconds: 43 * 60,
    breakDurationMinutes: 10,
    startedAt: `${today}T17:00:00`,
    completedAt: `${today}T17:43:00`,
    interruptedCount: 1,
    interruptionMinutes: 3,
    preset: '45-10',
    rating: 4,
    reflection: 'Got a bit distracted by YouTube notification but returned quickly.'
  },
  {
    id: 'session-prev-1',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    taskTitle: 'Trigonometric Equations past-year papers',
    targetDurationMinutes: 45,
    actualDurationSeconds: 45 * 60,
    breakDurationMinutes: 10,
    startedAt: '2026-11-13T16:30:00',
    completedAt: '2026-11-13T17:15:00',
    interruptedCount: 0,
    interruptionMinutes: 0,
    preset: '45-10',
    rating: 5
  },
  {
    id: 'session-prev-2',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    taskTitle: 'Work, Energy and Power revision',
    targetDurationMinutes: 5,
    actualDurationSeconds: 25 * 60,
    breakDurationMinutes: 5,
    startedAt: '2026-11-13T18:00:00',
    completedAt: '2026-11-13T18:25:00',
    interruptedCount: 0,
    interruptionMinutes: 0,
    preset: '5-min-starter',
    rating: 5,
    reflection: 'Used the 5-Minute Rule to start studying when I felt lazy. Kept going for 25 minutes!'
  }
]

export const initialDistractionLogs: DistractionLog[] = [
  {
    id: 'dist-1',
    appOrWebsite: 'Instagram Reels',
    category: 'short_video',
    minutesLost: 25,
    timestamp: `${today}T15:20:00`,
    trigger: 'Phone notification during break, lost track of time',
    preventedByShield: false
  },
  {
    id: 'dist-2',
    appOrWebsite: 'YouTube Algorithm',
    category: 'short_video',
    minutesLost: 15,
    timestamp: `${today}T17:45:00`,
    trigger: 'Looked up 1 physics solution, ended up clicking suggested vlog',
    preventedByShield: false
  },
  {
    id: 'dist-3',
    appOrWebsite: 'Discord Gaming Server',
    category: 'gaming',
    minutesLost: 0,
    timestamp: `${today}T16:15:00`,
    trigger: 'Attempted to open during Focus session',
    preventedByShield: true
  }
]

export const initialDistractionItems: DistractionItem[] = [
  {
    id: 'item-1',
    name: 'Instagram & Reels',
    category: 'short_video',
    severity: 'high',
    isBlockedInFocus: true,
    dailyLimitMinutes: 20
  },
  {
    id: 'item-2',
    name: 'YouTube Shorts & Feeds',
    category: 'short_video',
    severity: 'high',
    isBlockedInFocus: true,
    dailyLimitMinutes: 30
  },
  {
    id: 'item-3',
    name: 'Discord / Gaming Chat',
    category: 'gaming',
    severity: 'medium',
    isBlockedInFocus: true,
    dailyLimitMinutes: 30
  },
  {
    id: 'item-4',
    name: 'WhatsApp Web / Non-study groups',
    category: 'messaging',
    severity: 'medium',
    isBlockedInFocus: true,
    dailyLimitMinutes: 25
  },
  {
    id: 'item-5',
    name: 'Reddit / Gaming Subreddits',
    category: 'social_media',
    severity: 'high',
    isBlockedInFocus: true,
    dailyLimitMinutes: 15
  }
]

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
