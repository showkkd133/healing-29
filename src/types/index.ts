// Global type definitions for the 29-day Healing Journey app

// ─── Primitive Types ────────────────────────────────────────────────

/** Day number in the 29-day journey */
export type DayNumber =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29

/** Emotion intensity on a 1-10 scale */
export type EmotionIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** Emotion tags for categorizing feelings */
export type EmotionTag =
  | 'sadness'
  | 'anger'
  | 'anxiety'
  | 'hope'
  | 'acceptance'
  | 'relief'
  | 'joy'
  | 'nostalgia'
  | 'loneliness'
  | 'gratitude'

/** Theme preference */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** Privacy level for data storage */
export type PrivacyLevel = 'local' | 'cloud' | 'offline'

// ─── Stage Definitions ──────────────────────────────────────────────

/** Stage identifiers for the 10 healing stages */
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

export interface Stage {
  readonly id: StageId
  readonly name: string
  readonly days: readonly DayNumber[]
  readonly color: string
  readonly description: string
}

// ─── User Model ─────────────────────────────────────────────────────

export interface UserPreferences {
  readonly notificationTime: string // HH:mm format
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

// ─── Daily Task Data (per-day payloads) ─────────────────────────────

/** Day 1: Emotion Weather Report — record current emotional state */
export interface Day1Data {
  readonly type: 'day1'
  readonly audioFileUri: string | null
  readonly textEntry: string | null
  readonly moodScore: EmotionIntensity
}

/** Day 2: Minimum Survival Checklist — three basic self-care tasks */
export interface Day2Data {
  readonly type: 'day2'
  readonly tasksCompleted: readonly [boolean, boolean, boolean]
  readonly completionRate: number
}

/** Day 3: Silent Companionship — reach out or simply be present */
export interface Day3Data {
  readonly type: 'day3'
  readonly companionMode: 'message' | 'presence'
  readonly messageSent: boolean
}

/** Day 4: Goodbye Letter — write but never send */
export interface Day4Data {
  readonly type: 'day4'
  readonly letterText: string | null
  readonly wordCount: number
}

/** Day 5: Object Farewell — let go of a physical reminder */
export interface Day5Data {
  readonly type: 'day5'
  readonly objectDescription: string | null
  readonly photoUri: string | null
  readonly farewellAction: 'stored' | 'discarded' | 'transformed' | null
}

/** Day 6: Routine Reset — establish a new morning routine */
export interface Day6Data {
  readonly type: 'day6'
  readonly routineItems: readonly string[]
  readonly completedItems: readonly boolean[]
}

/** Day 7: Body Scan Meditation */
export interface Day7Data {
  readonly type: 'day7'
  readonly meditationDuration: number // seconds
  readonly bodyAreas: readonly string[]
}

/** Day 8: Gratitude Inventory */
export interface Day8Data {
  readonly type: 'day8'
  readonly gratitudeEntries: readonly string[]
}

/** Day 9: Inner Child Dialogue */
export interface Day9Data {
  readonly type: 'day9'
  readonly dialogueText: string | null
  readonly emotionsBefore: EmotionIntensity
  readonly emotionsAfter: EmotionIntensity
}

/** Day 10: Energy Audit */
export interface Day10Data {
  readonly type: 'day10'
  readonly energyDrains: readonly string[]
  readonly energySources: readonly string[]
}

/** Day 11: Boundary Setting Practice */
export interface Day11Data {
  readonly type: 'day11'
  readonly boundaryStatements: readonly string[]
  readonly practiceCompleted: boolean
}

/** Day 12: Self-Compassion Letter */
export interface Day12Data {
  readonly type: 'day12'
  readonly letterText: string | null
  readonly wordCount: number
}

/** Day 13: Memory Reframe */
export interface Day13Data {
  readonly type: 'day13'
  readonly originalMemory: string | null
  readonly reframedMemory: string | null
}

/** Day 14: Mid-Journey Reflection */
export interface Day14Data {
  readonly type: 'day14'
  readonly reflectionText: string | null
  readonly progressRating: EmotionIntensity
}

/** Day 15: Anger Release */
export interface Day15Data {
  readonly type: 'day15'
  readonly releaseMethod: 'writing' | 'movement' | 'art' | 'voice'
  readonly intensityBefore: EmotionIntensity
  readonly intensityAfter: EmotionIntensity
}

/** Day 16: Forgiveness Exploration */
export interface Day16Data {
  readonly type: 'day16'
  readonly forgivenessTarget: 'self' | 'other' | 'both'
  readonly reflectionText: string | null
}

/** Day 17: Social Identity Recovery */
export interface Day17Data {
  readonly type: 'day17'
  readonly identityTraits: readonly string[]
  readonly affirmation: string | null
}

/** Day 18: Sensory Desensitization */
export interface Day18Data {
  readonly type: 'day18'
  readonly trigger: string | null
  readonly exposureLevel: EmotionIntensity
  readonly anxietyAfter: EmotionIntensity
}

/** Day 19: Future Self Visualization */
export interface Day19Data {
  readonly type: 'day19'
  readonly visualizationText: string | null
  readonly timeframe: '1month' | '3months' | '1year'
}

/** Day 20: Value Realignment */
export interface Day20Data {
  readonly type: 'day20'
  readonly coreValues: readonly string[]
  readonly actionItems: readonly string[]
}

/** Day 21: Creative Expression */
export interface Day21Data {
  readonly type: 'day21'
  readonly medium: 'drawing' | 'writing' | 'music' | 'photography' | 'other'
  readonly mediaUri: string | null
  readonly description: string | null
}

/** Day 22: Relationship Pattern Analysis */
export interface Day22Data {
  readonly type: 'day22'
  readonly patterns: readonly string[]
  readonly insights: string | null
}

/** Day 23: Comfort Zone Challenge */
export interface Day23Data {
  readonly type: 'day23'
  readonly challengeDescription: string | null
  readonly completed: boolean
  readonly reflection: string | null
}

/** Day 24: Support Network Mapping */
export interface Day24Data {
  readonly type: 'day24'
  readonly innerCircle: readonly string[]
  readonly outerCircle: readonly string[]
  readonly newConnections: readonly string[]
}

/** Day 25: Milestone Celebration */
export interface Day25Data {
  readonly type: 'day25'
  readonly achievements: readonly string[]
  readonly rewardChosen: string | null
}

/** Day 26: Trigger Management Plan */
export interface Day26Data {
  readonly type: 'day26'
  readonly triggers: readonly string[]
  readonly copingStrategies: readonly string[]
}

/** Day 27: Growth Narrative */
export interface Day27Data {
  readonly type: 'day27'
  readonly narrativeText: string | null
  readonly wordCount: number
}

/** Day 28: Legacy Letter */
export interface Day28Data {
  readonly type: 'day28'
  readonly letterText: string | null
  readonly recipientType: 'past-self' | 'future-self' | 'ex'
}

/** Day 29: New Beginning Declaration */
export interface Day29Data {
  readonly type: 'day29'
  readonly declarationText: string | null
  readonly intentions: readonly string[]
  readonly moodScore: EmotionIntensity
}

/** Generic day task data used by stores for common task fields */
export interface GenericDayTaskData {
  readonly journalEntry: string
  readonly exerciseCompleted: boolean
  readonly meditationMinutes: number
  readonly gratitudeItems: readonly string[]
  readonly reflectionNotes: string
}

/** Union type for all 29 days' task data */
export type DayTaskData =
  | Day1Data | Day2Data | Day3Data | Day4Data | Day5Data
  | Day6Data | Day7Data | Day8Data | Day9Data | Day10Data
  | Day11Data | Day12Data | Day13Data | Day14Data | Day15Data
  | Day16Data | Day17Data | Day18Data | Day19Data | Day20Data
  | Day21Data | Day22Data | Day23Data | Day24Data | Day25Data
  | Day26Data | Day27Data | Day28Data | Day29Data

// ─── Day Completion Payload ─────────────────────────────────────────

/** Generic completion payload from any Day component */
export interface DayCompletionPayload {
  readonly [key: string]: unknown
}

// ─── Daily Log ──────────────────────────────────────────────────────

export interface DailyLog {
  readonly id: string
  readonly userId: string
  readonly dayNumber: DayNumber
  readonly theme: string
  readonly moodScore: EmotionIntensity
  readonly taskData: DayTaskData
  readonly completedAt: string | null
  readonly mediaAttachments: readonly string[]
}

// ─── Badge System ───────────────────────────────────────────────────

/** Badge category grouping */
export type BadgeCategory = 'milestone' | 'streak' | 'special' | 'stage'

export interface Badge {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly iconProvider?: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons'
  readonly category: BadgeCategory
  readonly unlockedAt: string | null
  readonly requirement: BadgeRequirement
}

export interface BadgeRequirement {
  readonly type: 'day_complete' | 'streak' | 'stage_complete' | 'special'
  readonly value: number
  readonly stageId?: StageId
}

// ─── Journey Summary ────────────────────────────────────────────────

export interface JourneySummary {
  readonly userId: string
  readonly totalDaysCompleted: number
  readonly currentStreak: number
  readonly longestStreak: number
  readonly averageMoodScore: number
  readonly moodTrend: readonly EmotionIntensity[]
  readonly completedStages: readonly StageId[]
  readonly earnedBadges: readonly string[]
  readonly startDate: string
  readonly lastActiveDate: string
}

// ─── Notification Preferences ───────────────────────────────────────

export type NotificationType = 'daily_reminder' | 'streak_alert' | 'badge_earned' | 'encouragement'

export interface NotificationPreference {
  readonly type: NotificationType
  readonly enabled: boolean
  readonly time: string | null // HH:mm, null = system default
}

// ─── Privacy Settings ───────────────────────────────────────────────

export interface PrivacySettings {
  readonly dataStorage: PrivacyLevel
  readonly analyticsEnabled: boolean
  readonly crashReportingEnabled: boolean
  readonly exportFormat: 'json' | 'pdf'
}

// ─── Day Configuration (used by constants/days.ts) ──────────────────

export interface DayConfig {
  readonly dayNumber: DayNumber
  readonly theme: string
  readonly subtitle: string
  readonly guidanceText: string
  readonly stageId: StageId
  readonly icon: string
  readonly tags: readonly string[]
  readonly estimatedMinutes: number
}

// ─── Navigation Types ───────────────────────────────────────────────

export type RootStackParamList = {
  readonly Home: undefined
  readonly DayDetail: { readonly dayNumber: DayNumber }
  readonly Settings: undefined
  readonly JourneyMap: undefined
  readonly BadgeGallery: undefined
}
