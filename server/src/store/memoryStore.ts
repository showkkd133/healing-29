// In-memory data store — will be replaced with Supabase
// All operations return new objects (immutable pattern)

import type {
  User,
  UserPreferences,
  DailyLog,
  UserBadge,
  UserNotificationSettings,
  NotificationSetting,
  DayNumber,
  EmotionIntensity,
} from '../types'

// ─── Storage Maps ───────────────────────────────────────────────────

const users = new Map<string, User>()
const dailyLogs = new Map<string, DailyLog[]>()
const userBadges = new Map<string, UserBadge[]>()
const notificationSettings = new Map<string, UserNotificationSettings>()

// ─── User Operations ────────────────────────────────────────────────

export const createUser = (id: string): User => {
  const user: User = {
    id,
    createdAt: new Date().toISOString(),
    currentDay: 1 as DayNumber,
    streakDays: 0,
    preferences: {
      notificationTime: '09:00',
      theme: 'auto',
      privacyLevel: 'local',
    },
  }
  users.set(id, user)
  return user
}

export const getUser = (id: string): User | undefined => {
  return users.get(id)
}

export const updateUserPreferences = (
  id: string,
  preferences: Partial<UserPreferences>
): User | undefined => {
  const user = users.get(id)
  if (!user) return undefined

  const updated: User = {
    ...user,
    preferences: {
      ...user.preferences,
      ...preferences,
    },
  }
  users.set(id, updated)
  return updated
}

export const updateUserDay = (
  id: string,
  day: DayNumber,
  streakDays: number
): User | undefined => {
  const user = users.get(id)
  if (!user) return undefined

  const updated: User = {
    ...user,
    currentDay: day,
    streakDays,
  }
  users.set(id, updated)
  return updated
}

// ─── Daily Log Operations ───────────────────────────────────────────

export const startDay = (
  userId: string,
  dayNumber: DayNumber,
  theme: string
): DailyLog => {
  const log: DailyLog = {
    id: `${userId}-day-${dayNumber}`,
    userId,
    dayNumber,
    theme,
    moodScore: 5 as EmotionIntensity,
    taskData: {},
    startedAt: new Date().toISOString(),
    completedAt: null,
    mediaAttachments: [],
  }

  const logs = dailyLogs.get(userId) ?? []
  // Replace existing log for same day or append
  const existingIndex = logs.findIndex((l) => l.dayNumber === dayNumber)
  const updatedLogs = existingIndex >= 0
    ? [...logs.slice(0, existingIndex), log, ...logs.slice(existingIndex + 1)]
    : [...logs, log]

  dailyLogs.set(userId, updatedLogs)
  return log
}

export const completeDay = (
  userId: string,
  dayNumber: DayNumber,
  moodScore: EmotionIntensity,
  taskData: Record<string, unknown>
): DailyLog | undefined => {
  const logs = dailyLogs.get(userId) ?? []
  const existingIndex = logs.findIndex((l) => l.dayNumber === dayNumber)

  if (existingIndex < 0) return undefined

  const completed: DailyLog = {
    ...logs[existingIndex],
    moodScore,
    taskData,
    completedAt: new Date().toISOString(),
  }

  const updatedLogs = [
    ...logs.slice(0, existingIndex),
    completed,
    ...logs.slice(existingIndex + 1),
  ]
  dailyLogs.set(userId, updatedLogs)

  // Advance user's current day and update streak
  const user = users.get(userId)
  if (user) {
    const nextDay = Math.min(dayNumber + 1, 29) as DayNumber
    const newStreak = user.streakDays + 1
    updateUserDay(userId, nextDay, newStreak)
  }

  return completed
}

export const getDailyLogs = (userId: string): readonly DailyLog[] => {
  return (dailyLogs.get(userId) ?? []).filter((l) => l.completedAt !== null)
}

export const getDayLog = (
  userId: string,
  dayNumber: DayNumber
): DailyLog | undefined => {
  const logs = dailyLogs.get(userId) ?? []
  return logs.find((l) => l.dayNumber === dayNumber)
}

export const getMoodTrend = (userId: string): readonly number[] => {
  const logs = dailyLogs.get(userId) ?? []
  return logs
    .filter((l) => l.completedAt !== null)
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((l) => l.moodScore)
}

// ─── Badge Operations ───────────────────────────────────────────────

export const getUserBadges = (userId: string): readonly UserBadge[] => {
  return userBadges.get(userId) ?? []
}

export const awardBadge = (userId: string, badgeId: string): UserBadge => {
  const badge: UserBadge = {
    badgeId,
    userId,
    unlockedAt: new Date().toISOString(),
  }

  const existing = userBadges.get(userId) ?? []
  userBadges.set(userId, [...existing, badge])
  return badge
}

export const hasBadge = (userId: string, badgeId: string): boolean => {
  const badges = userBadges.get(userId) ?? []
  return badges.some((b) => b.badgeId === badgeId)
}

// ─── Notification Settings Operations ───────────────────────────────

const defaultNotificationSettings: readonly NotificationSetting[] = [
  { type: 'daily_reminder', enabled: true, time: '09:00' },
  { type: 'streak_alert', enabled: true, time: null },
  { type: 'badge_earned', enabled: true, time: null },
  { type: 'encouragement', enabled: true, time: '20:00' },
]

export const getNotificationSettings = (
  userId: string
): UserNotificationSettings => {
  const existing = notificationSettings.get(userId)
  if (existing) return existing

  const defaults: UserNotificationSettings = {
    userId,
    settings: defaultNotificationSettings,
  }
  notificationSettings.set(userId, defaults)
  return defaults
}

export const updateNotificationSettings = (
  userId: string,
  settings: readonly NotificationSetting[]
): UserNotificationSettings => {
  const updated: UserNotificationSettings = { userId, settings }
  notificationSettings.set(userId, updated)
  return updated
}

// ─── Utility ────────────────────────────────────────────────────────

export const clearAll = (): void => {
  users.clear()
  dailyLogs.clear()
  userBadges.clear()
  notificationSettings.clear()
}
