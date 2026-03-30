import { describe, expect, it } from 'bun:test'
import { DAYS, getDayConfig, getDaysByStage } from '../days'

describe('DAYS', () => {
  it('should contain exactly 29 days', () => {
    expect(DAYS).toHaveLength(29)
  })

  it('each day should have all required fields', () => {
    for (const day of DAYS) {
      expect(day).toHaveProperty('dayNumber')
      expect(day).toHaveProperty('theme')
      expect(day).toHaveProperty('subtitle')
      expect(day).toHaveProperty('guidanceText')
      expect(day).toHaveProperty('stageId')
      expect(day).toHaveProperty('icon')
      expect(day).toHaveProperty('tags')
      expect(day).toHaveProperty('estimatedMinutes')
    }
  })

  it('day numbers should be sequential from 1 to 29', () => {
    const numbers = DAYS.map((d) => d.dayNumber)
    expect(numbers).toEqual(Array.from({ length: 29 }, (_, i) => i + 1))
  })
})

describe('getDayConfig', () => {
  it('should return day 1 config', () => {
    const day = getDayConfig(1)
    expect(day).toBeDefined()
    expect(day!.dayNumber).toBe(1)
    expect(day!.stageId).toBe('emergency')
  })

  it('should return undefined for out-of-range day', () => {
    expect(getDayConfig(30)).toBeUndefined()
    expect(getDayConfig(0)).toBeUndefined()
  })
})

describe('getDaysByStage', () => {
  it('should return 3 days for emergency stage', () => {
    const days = getDaysByStage('emergency')
    expect(days).toHaveLength(3)
    expect(days.every((d) => d.stageId === 'emergency')).toBe(true)
  })

  it('should return empty array for unknown stage', () => {
    expect(getDaysByStage('nonexistent')).toHaveLength(0)
  })
})
