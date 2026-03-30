// Backend type definitions — adapted from frontend types for server use

// ─── Primitive Types ────────────────────────────────────────────────

/** Day number in the 29-day journey */
export type DayNumber =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29

/** Emotion intensity on a 1-10 scale */
export type EmotionIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** Theme preference */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** Privacy level for data storage */
export type PrivacyLevel = 'local' | 'cloud' | 'offline'

// ─── Stage Definitions ──────────────────────────────────────────────

export type StageId =
  | 'emergency'
  | 'rebuild'
  | 'energy'
  | 'deep-healing'
  | 'review'
  | 'disillusion'
  | 'desensitize'
  | 'reorganize'
  | 'awakening'
  | 'restart'

// ─── User Model ─────────────────────────────────────────────────────

export interface UserPreferences {
  readonly notificationTime: string
  readonly theme: ThemeMode
  readonly privacyLevel: PrivacyLevel
}

export interface User {
  readonly id: string
  readonly createdAt: string
  readonly currentDay: DayNumber
  readonly streakDays: number
  readonly preferences: UserPreferences
}

// ─── Daily Log ──────────────────────────────────────────────────────

export interface DailyLog {
  readonly id: string
  readonly userId: string
  readonly dayNumber: DayNumber
  readonly theme: string
  readonly moodScore: EmotionIntensity
  readonly taskData: Record<string, unknown>
  readonly startedAt: string
  readonly completedAt: string | null
  readonly mediaAttachments: readonly string[]
}

// ─── Badge System ───────────────────────────────────────────────────

export type BadgeCategory = 'milestone' | 'streak' | 'special' | 'stage'

export interface BadgeRequirement {
  readonly type: 'day_complete' | 'streak' | 'stage_complete' | 'special'
  readonly value: number
  readonly stageId?: StageId
}

export interface BadgeDefinition {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly category: BadgeCategory
  readonly requirement: BadgeRequirement
}

export interface UserBadge {
  readonly badgeId: string
  readonly userId: string
  readonly unlockedAt: string
}

// ─── Notification Settings ──────────────────────────────────────────

export type NotificationType = 'daily_reminder' | 'streak_alert' | 'badge_earned' | 'encouragement'

export interface NotificationSetting {
  readonly type: NotificationType
  readonly enabled: boolean
  readonly time: string | null
}

export interface UserNotificationSettings {
  readonly userId: string
  readonly settings: readonly NotificationSetting[]
}

// ─── Journey Summary ────────────────────────────────────────────────

export interface JourneySummary {
  readonly userId: string
  readonly totalDaysCompleted: number
  readonly currentStreak: number
  readonly longestStreak: number
  readonly averageMoodScore: number
  readonly moodTrend: readonly number[]
  readonly completedStages: readonly StageId[]
  readonly earnedBadges: readonly string[]
  readonly startDate: string
  readonly lastActiveDate: string
}

// ─── Hono Environment ───────────────────────────────────────────────

/** Shared Hono env type for middleware-injected variables */
export interface AppEnv {
  Variables: {
    validatedBody: unknown
    validatedParams: unknown
  }
}

// ─── API Response ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  readonly success: boolean
  readonly data?: T
  readonly error?: string
}
