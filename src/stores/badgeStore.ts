import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DayNumber, GenericDayTaskData } from '@/types'
import { asyncStorage } from '@/utils/storage'

// -- Store-local types --

interface EarnedBadge {
  readonly badgeId: string
  readonly earnedAt: string
}

// -- Badge definitions --

interface BadgeRule {
  readonly id: string
  readonly check: (day: DayNumber, data: GenericDayTaskData) => boolean
}

const BADGE_RULES: ReadonlyArray<BadgeRule> = [
  {
    id: 'first-step',
    // Milestone: completing day 1
    check: (day) => day === 1,
  },
  {
    id: 'one-week',
    // Milestone: completing day 7
    check: (day) => day === 7,
  },
  {
    id: 'halfway',
    // Milestone: completing day 14
    check: (day) => day === 14,
  },
  {
    id: 'journey-complete',
    // Milestone: completing all 29 days
    check: (day) => day === 29,
  },
  {
    id: 'wordsmith',
    // Special: journal entry exceeds 500 characters (contributes toward 3000-char total)
    check: (_day, data) => data.journalEntry.length > 500,
  },
  {
    id: 'streak-3',
    // Streak: awarded on day 3+ as a proxy for 3-day consecutive completion
    check: (day) => day >= 3,
  },
  {
    id: 'mood-climber',
    // Special: awarded when meditation reaches 20+ min (proxy for emotional growth)
    check: (_day, data) => data.meditationMinutes >= 20,
  },
]

// -- Store types --

interface BadgeState {
  readonly earnedBadges: ReadonlyArray<EarnedBadge>

  // Actions
  checkAndAward: (day: DayNumber, data: GenericDayTaskData) => void
  hasBadge: (badgeId: string) => boolean
}

// -- Store --

export const useBadgeStore = create<BadgeState>()(
  persist(
    (set, get) => ({
  earnedBadges: [],

  checkAndAward: (day, data) =>
    set((state) => {
      const existingIds = new Set(state.earnedBadges.map((b) => b.badgeId))

      const newBadges = BADGE_RULES.filter(
        (rule) => !existingIds.has(rule.id) && rule.check(day, data)
      ).map(
        (rule): EarnedBadge => ({
          badgeId: rule.id,
          earnedAt: new Date().toISOString(),
        })
      )

      if (newBadges.length === 0) {
        return state
      }

      return {
        ...state,
        earnedBadges: [...state.earnedBadges, ...newBadges],
      }
    }),

  hasBadge: (badgeId) =>
    get().earnedBadges.some((b) => b.badgeId === badgeId),
    }),
    {
      name: 'healing-badge-store',
      storage: createJSONStorage(() => asyncStorage),
    }
  )
)

export type { BadgeState, EarnedBadge, BadgeRule }
