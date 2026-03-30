// Date utility functions for the 29-day journey

import {
  format,
  differenceInDays,
  isToday as dateFnsIsToday,
  parseISO,
  startOfDay,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * Format a date string or Date object into a human-readable format.
 * Defaults to Chinese locale.
 */
export const formatDate = (
  date: Date | string,
  pattern: string = 'yyyy年M月d日'
): string => {
  const parsed = typeof date === 'string' ? parseISO(date) : date
  return format(parsed, pattern, { locale: zhCN })
}

/**
 * Get the relative day number from a journey start date.
 * Day 1 is the start date itself.
 */
export const getRelativeDay = (
  startDate: Date | string,
  targetDate: Date | string = new Date()
): number => {
  const start = startOfDay(
    typeof startDate === 'string' ? parseISO(startDate) : startDate
  )
  const target = startOfDay(
    typeof targetDate === 'string' ? parseISO(targetDate) : targetDate
  )
  return differenceInDays(target, start) + 1
}

/**
 * Check whether a given date is today.
 */
export const isToday = (date: Date | string): boolean => {
  const parsed = typeof date === 'string' ? parseISO(date) : date
  return dateFnsIsToday(parsed)
}

/**
 * Get the number of full days elapsed since a given date.
 */
export const getDaysSince = (date: Date | string): number => {
  const parsed = typeof date === 'string' ? parseISO(date) : date
  return differenceInDays(new Date(), parsed)
}

/**
 * Format a duration in seconds into mm:ss display string.
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Get today's date as an ISO date string (YYYY-MM-DD).
 */
export const getTodayISO = (): string => {
  return format(new Date(), 'yyyy-MM-dd')
}
