import { describe, expect, test } from 'bun:test'
import {
  formatDate,
  getRelativeDay,
  isToday,
  getDaysSince,
  formatDuration,
  getTodayISO,
} from '../dateUtils'

describe('formatDate', () => {
  test('formats Date object with default pattern', () => {
    expect(formatDate(new Date(2025, 0, 15))).toBe('2025年1月15日')
  })

  test('formats ISO string with custom pattern', () => {
    expect(formatDate('2025-03-01', 'M/d')).toBe('3/1')
  })

  test('throws on invalid date string', () => {
    expect(() => formatDate('not-a-date')).toThrow()
  })
})

describe('getRelativeDay', () => {
  test('returns 1 for same day', () => {
    expect(getRelativeDay('2025-01-10', '2025-01-10')).toBe(1)
  })

  test('returns correct offset', () => {
    expect(getRelativeDay('2025-01-01', '2025-01-10')).toBe(10)
  })

  test('returns negative for target before start', () => {
    expect(getRelativeDay('2025-01-10', '2025-01-01')).toBe(-8)
  })
})

describe('isToday', () => {
  test('returns true for today', () => {
    expect(isToday(new Date())).toBe(true)
  })

  test('returns false for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(isToday(yesterday)).toBe(false)
  })
})

describe('getDaysSince', () => {
  test('returns 0 for today', () => {
    expect(getDaysSince(new Date())).toBe(0)
  })
})

describe('formatDuration', () => {
  test('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('00:00')
  })

  test('formats seconds only', () => {
    expect(formatDuration(45)).toBe('00:45')
  })

  test('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('02:05')
  })

  test('formats large values', () => {
    expect(formatDuration(3661)).toBe('61:01')
  })
})

describe('getTodayISO', () => {
  test('returns YYYY-MM-DD format', () => {
    expect(getTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
