import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DayNumber, UserPreferences } from '@/types'
import { asyncStorage } from '@/utils/storage'

// -- Store types --

interface UserState {
  // Hydration flag (not persisted)
  readonly _hasHydrated: boolean

  // User profile
  readonly userId: string | null
  readonly currentDay: DayNumber
  readonly streakDays: number
  readonly lastActiveDate: string | null
  readonly createdAt: string | null

  // Preferences
  readonly notificationTime: string
  readonly privacyLevel: 'local' | 'cloud' | 'offline'

  // Actions
  initUser: () => void
  advanceDay: () => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}

// -- Helpers --

const generateId = (): string =>
  `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

const MAX_DAY = 29

// -- Store --

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
  _hasHydrated: false,
  userId: null,
  currentDay: 1 as DayNumber,
  streakDays: 0,
  lastActiveDate: null,
  createdAt: null,

  notificationTime: '20:00',
  privacyLevel: 'local',

  initUser: () =>
    set((state) => {
      // Prevent re-initialisation if already set up
      if (state.userId !== null) {
        return state
      }
      return {
        ...state,
        userId: generateId(),
        currentDay: 1 as DayNumber,
        streakDays: 0,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      }
    }),

  advanceDay: () =>
    set((state) => {
      const nextDay = state.currentDay + 1
      if (nextDay > MAX_DAY) {
        return state
      }

      const today = new Date().toISOString().slice(0, 10)
      const lastDate = state.lastActiveDate

      // Check if consecutive day (within 2 calendar days to be forgiving)
      let newStreak = 1
      if (lastDate) {
        const diffMs = Date.now() - new Date(lastDate).getTime()
        const diffDays = diffMs / (1000 * 60 * 60 * 24)
        newStreak = diffDays <= 2 ? state.streakDays + 1 : 1
      }

      return {
        ...state,
        currentDay: nextDay as DayNumber,
        streakDays: newStreak,
        lastActiveDate: today,
      }
    }),

  updatePreferences: (prefs) =>
    set((state) => ({
      ...state,
      ...(prefs.notificationTime !== undefined && {
        notificationTime: prefs.notificationTime,
      }),
      ...(prefs.privacyLevel !== undefined && {
        privacyLevel: prefs.privacyLevel,
      }),
    })),
    }),
    {
      name: 'healing-user-store',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => {
        // Exclude hydration flag from persistence
        const { _hasHydrated, ...rest } = state
        return rest
      },
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.error('User store hydration failed:', error)
          }
          // Always set hydrated, even on failure
          useUserStore.setState({ _hasHydrated: true })
        }
      },
    }
  )
)

export type { UserState }
