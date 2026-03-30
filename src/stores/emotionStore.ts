import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DayNumber, EmotionIntensity, EmotionTag } from '@/types'
import { asyncStorage } from '@/utils/storage'

// -- Store-local types --

interface EmotionRecord {
  readonly day: DayNumber
  readonly score: EmotionIntensity
  readonly tags: ReadonlyArray<EmotionTag>
  readonly note: string
  readonly recordedAt: string
}

interface EmotionTrend {
  readonly averageScore: number
  readonly direction: 'improving' | 'stable' | 'declining'
  readonly recentScores: ReadonlyArray<EmotionIntensity>
}

// -- Store types --

interface EmotionState {
  readonly records: ReadonlyArray<EmotionRecord>

  // Actions
  recordEmotion: (
    day: DayNumber,
    score: EmotionIntensity,
    tags: ReadonlyArray<EmotionTag>,
    note?: string
  ) => void
  getRecord: (day: DayNumber) => EmotionRecord | undefined
  getScoreHistory: () => ReadonlyArray<{
    day: DayNumber
    score: EmotionIntensity
  }>
  calculateTrend: (windowSize?: number) => EmotionTrend
  getTagFrequency: () => ReadonlyMap<EmotionTag, number>
}

// -- Helpers --

const computeDirection = (
  scores: ReadonlyArray<number>
): EmotionTrend['direction'] => {
  if (scores.length < 2) return 'stable'

  const midpoint = Math.floor(scores.length / 2)
  const firstHalf = scores.slice(0, midpoint)
  const secondHalf = scores.slice(midpoint)

  const avg = (arr: ReadonlyArray<number>): number =>
    arr.reduce((sum, v) => sum + v, 0) / arr.length

  const firstAvg = avg(firstHalf)
  const secondAvg = avg(secondHalf)
  const threshold = 0.5

  if (secondAvg - firstAvg > threshold) return 'improving'
  if (firstAvg - secondAvg > threshold) return 'declining'
  return 'stable'
}

// -- Store --

export const useEmotionStore = create<EmotionState>()(
  persist(
    (set, get) => ({
  records: [],

  recordEmotion: (day, score, tags, note = '') =>
    set((state) => {
      // Replace existing record for the same day (immutably)
      const filtered = state.records.filter((r) => r.day !== day)

      const newRecord: EmotionRecord = {
        day,
        score,
        tags: [...tags],
        note,
        recordedAt: new Date().toISOString(),
      }

      return {
        ...state,
        records: [...filtered, newRecord],
      }
    }),

  getRecord: (day) =>
    get().records.find((r) => r.day === day),

  getScoreHistory: () => {
    const { records } = get()
    return [...records]
      .sort((a, b) => a.day - b.day)
      .map(({ day, score }) => ({ day, score }))
  },

  calculateTrend: (windowSize = 7) => {
    const history = get().getScoreHistory()
    const recent = history.slice(-windowSize)
    const scores = recent.map((h) => h.score as number)

    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, v) => sum + v, 0) / scores.length
        : 0

    return {
      averageScore: Math.round(averageScore * 10) / 10,
      direction: computeDirection(scores),
      recentScores: recent.map((h) => h.score),
    }
  },

  getTagFrequency: () => {
    const { records } = get()
    const freq = new Map<EmotionTag, number>()

    for (const record of records) {
      for (const tag of record.tags) {
        freq.set(tag, (freq.get(tag) ?? 0) + 1)
      }
    }

    return freq
  },
    }),
    {
      name: 'healing-emotion-store',
      storage: createJSONStorage(() => asyncStorage),
    }
  )
)

export type {
  EmotionState,
  EmotionRecord,
  EmotionTrend,
}
