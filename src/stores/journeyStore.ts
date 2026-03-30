import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DayNumber, EmotionIntensity, GenericDayTaskData } from '@/types'
import { asyncStorage } from '@/utils/storage'

// -- Store-local types --

interface DailyLog {
  readonly day: DayNumber
  readonly completedAt: string
  readonly moodScore: EmotionIntensity
  readonly taskData: GenericDayTaskData
}

// -- Store types --

interface JourneyState {
  readonly dailyLogs: Readonly<Record<number, DailyLog>>
  readonly currentDayData: GenericDayTaskData | null
  readonly isCompleted: boolean

  // Actions
  startDay: (day: DayNumber) => void
  updateDayData: (data: Partial<GenericDayTaskData>) => void
  completeDay: (day: DayNumber, moodScore: EmotionIntensity) => void
  getDayLog: (day: DayNumber) => DailyLog | undefined
  getMoodTrend: () => ReadonlyArray<{ day: DayNumber; score: EmotionIntensity }>
}

// -- Helpers --

const MAX_DAY = 29

const emptyDayData: GenericDayTaskData = {
  journalEntry: '',
  exerciseCompleted: false,
  meditationMinutes: 0,
  gratitudeItems: [],
  reflectionNotes: '',
}

// -- Store --

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
  dailyLogs: {},
  currentDayData: null,
  isCompleted: false,

  startDay: (day) =>
    set((state) => ({
      ...state,
      currentDayData: { ...emptyDayData },
    })),

  updateDayData: (data) =>
    set((state) => {
      if (state.currentDayData === null) {
        return state
      }
      return {
        ...state,
        currentDayData: {
          ...state.currentDayData,
          ...data,
          // Preserve immutability for the array field when provided
          ...(data.gratitudeItems !== undefined && {
            gratitudeItems: [...data.gratitudeItems],
          }),
        },
      }
    }),

  completeDay: (day, moodScore) =>
    set((state) => {
      if (state.currentDayData === null) {
        return state
      }

      const newLog: DailyLog = {
        day,
        completedAt: new Date().toISOString(),
        moodScore,
        taskData: { ...state.currentDayData },
      }

      return {
        ...state,
        dailyLogs: {
          ...state.dailyLogs,
          [day]: newLog,
        },
        currentDayData: null,
        isCompleted: day >= MAX_DAY,
      }
    }),

  getDayLog: (day) => get().dailyLogs[day],

  getMoodTrend: () => {
    const { dailyLogs } = get()

    return Object.values(dailyLogs)
      .map((log) => ({ day: log.day, score: log.moodScore }))
      .sort((a, b) => a.day - b.day)
  },
    }),
    {
      name: 'healing-journey-store',
      storage: createJSONStorage(() => asyncStorage),
    }
  )
)

export type {
  JourneyState,
  DailyLog,
}
