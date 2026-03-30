import { describe, expect, it } from 'bun:test'
import { STAGES, getStageByDay, getStageById } from '../stages'

describe('STAGES', () => {
  it('should contain exactly 10 stages', () => {
    expect(STAGES).toHaveLength(10)
  })

  it('should cover all 29 days without gaps', () => {
    const allDays = STAGES.flatMap((s) => [...s.days]).sort((a, b) => a - b)
    expect(allDays).toEqual(Array.from({ length: 29 }, (_, i) => i + 1))
  })

  it('should have no duplicate days across stages', () => {
    const allDays = STAGES.flatMap((s) => [...s.days])
    const unique = new Set(allDays)
    expect(unique.size).toBe(allDays.length)
  })
})

describe('getStageByDay', () => {
  it('should return emergency for day 1', () => {
    const stage = getStageByDay(1)
    expect(stage).toBeDefined()
    expect(stage!.id).toBe('emergency')
  })

  it('should return restart for day 29', () => {
    const stage = getStageByDay(29)
    expect(stage).toBeDefined()
    expect(stage!.id).toBe('restart')
  })

  it('should return undefined for out-of-range day', () => {
    expect(getStageByDay(0)).toBeUndefined()
    expect(getStageByDay(30)).toBeUndefined()
  })
})

describe('getStageById', () => {
  it('should return correct stage for emergency', () => {
    const stage = getStageById('emergency')
    expect(stage).toBeDefined()
    expect(stage!.name).toBe('紧急自救')
    expect(stage!.days).toEqual([1, 2, 3])
  })

  it('should return undefined for unknown id', () => {
    expect(getStageById('nonexistent')).toBeUndefined()
  })
})
