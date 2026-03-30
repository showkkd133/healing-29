import { describe, expect, test } from 'bun:test'
import {
  getMoodEmoji,
  getMoodLabel,
  getMoodColor,
  calculateTrend,
} from '../moodUtils'

describe('getMoodEmoji', () => {
  test('returns correct emoji for valid scores', () => {
    expect(getMoodEmoji(1)).toBe('\u{1F32A}\uFE0F')
    expect(getMoodEmoji(10)).toBe('\u{1F308}')
  })

  test('clamps score below 1 to 1', () => {
    expect(getMoodEmoji(0)).toBe(getMoodEmoji(1))
    expect(getMoodEmoji(-5)).toBe(getMoodEmoji(1))
  })

  test('clamps score above 10 to 10', () => {
    expect(getMoodEmoji(11)).toBe(getMoodEmoji(10))
    expect(getMoodEmoji(99)).toBe(getMoodEmoji(10))
  })

  test('rounds decimal scores', () => {
    expect(getMoodEmoji(4.7)).toBe(getMoodEmoji(5))
  })
})

describe('getMoodLabel', () => {
  test('returns label for boundary scores', () => {
    expect(getMoodLabel(1)).toBe('\u66B4\u98CE\u96E8')
    expect(getMoodLabel(10)).toBe('\u5F69\u8679')
  })

  test('clamps out-of-range scores', () => {
    expect(getMoodLabel(0)).toBe(getMoodLabel(1))
    expect(getMoodLabel(11)).toBe(getMoodLabel(10))
  })
})

describe('getMoodColor', () => {
  test('returns a color string for valid score', () => {
    expect(getMoodColor(5)).toMatch(/^#/)
  })

  test('clamps out-of-range scores', () => {
    expect(getMoodColor(-1)).toBe(getMoodColor(1))
    expect(getMoodColor(15)).toBe(getMoodColor(10))
  })
})

describe('calculateTrend', () => {
  test('returns stable for fewer than 3 data points', () => {
    expect(calculateTrend([])).toBe('stable')
    expect(calculateTrend([5, 6])).toBe('stable')
  })

  test('returns improving for upward trend', () => {
    expect(calculateTrend([1, 2, 3, 4, 5, 6, 7])).toBe('improving')
  })

  test('returns stable for flat scores', () => {
    expect(calculateTrend([5, 5, 5, 5, 5])).toBe('stable')
  })

  test('returns fluctuating for high variance', () => {
    expect(calculateTrend([1, 10, 1, 10, 1, 10])).toBe('fluctuating')
  })

  test('returns fluctuating for downward trend', () => {
    expect(calculateTrend([7, 6, 5, 4, 3, 2, 1])).toBe('fluctuating')
  })
})
