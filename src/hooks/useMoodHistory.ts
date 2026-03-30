// NOTE: Not currently imported by any component — candidate for integration or removal
//
// Mood history hook with AsyncStorage persistence and trend analysis

import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { calculateTrend } from '@/utils/moodUtils'
import { getTodayISO } from '@/utils/dateUtils'

const STORAGE_KEY = 'healing29:mood_history'

interface MoodEntry {
  readonly day: number
  readonly score: number
  readonly date: string
}

interface UseMoodHistory {
  readonly history: ReadonlyArray<MoodEntry>
  readonly trend: 'improving' | 'stable' | 'fluctuating'
  readonly averageScore: number
  readonly addEntry: (day: number, score: number) => void
}

/**
 * Load mood history from AsyncStorage.
 */
const loadHistory = async (): Promise<ReadonlyArray<MoodEntry>> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to load mood history:', error)
    return []
  }
}

/**
 * Persist mood history to AsyncStorage.
 */
const saveHistory = async (entries: ReadonlyArray<MoodEntry>): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('Failed to save mood history:', error)
  }
}

/**
 * Compute the arithmetic mean of scores. Returns 0 for empty arrays.
 */
const computeAverage = (entries: ReadonlyArray<MoodEntry>): number => {
  if (entries.length === 0) return 0
  const sum = entries.reduce((acc, entry) => acc + entry.score, 0)
  return Math.round((sum / entries.length) * 10) / 10
}

export const useMoodHistory = (): UseMoodHistory => {
  const [history, setHistory] = useState<ReadonlyArray<MoodEntry>>([])

  // Load persisted data on mount
  useEffect(() => {
    loadHistory().then(setHistory)
  }, [])

  const addEntry = useCallback((day: number, score: number) => {
    setHistory((prev) => {
      // Replace existing entry for the same day, or append
      const existing = prev.findIndex((e) => e.day === day)
      const newEntry: MoodEntry = {
        day,
        score,
        date: getTodayISO(),
      }

      const updated = existing >= 0
        ? [...prev.slice(0, existing), newEntry, ...prev.slice(existing + 1)]
        : [...prev, newEntry]

      // Sort by day number for consistent ordering
      const sorted = [...updated].sort((a, b) => a.day - b.day)

      // Persist asynchronously (fire and forget)
      saveHistory(sorted)

      return sorted
    })
  }, [])

  const scores = history.map((e) => e.score)
  const trend = calculateTrend(scores)
  const averageScore = computeAverage(history)

  return {
    history,
    trend,
    averageScore,
    addEntry,
  } as const
}
