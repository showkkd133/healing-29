import { describe, expect, it } from 'bun:test'
import { BADGES, getBadgeById, getBadgesByCategory } from '../badges'

describe('BADGES', () => {
  it('should contain exactly 24 badges', () => {
    expect(BADGES).toHaveLength(24)
  })

  it('each badge should have all required fields', () => {
    for (const badge of BADGES) {
      expect(badge).toHaveProperty('id')
      expect(badge).toHaveProperty('name')
      expect(badge).toHaveProperty('description')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('category')
      expect(badge).toHaveProperty('requirement')
    }
  })

  it('all badge ids should be unique', () => {
    const ids = BADGES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getBadgeById', () => {
  it('should return first-step badge', () => {
    const badge = getBadgeById('first-step')
    expect(badge).toBeDefined()
    expect(badge!.name).toBe('第一步')
    expect(badge!.category).toBe('milestone')
  })

  it('should return undefined for unknown id', () => {
    expect(getBadgeById('nonexistent')).toBeUndefined()
  })
})

describe('getBadgesByCategory', () => {
  it('should return 5 milestone badges', () => {
    const milestones = getBadgesByCategory('milestone')
    expect(milestones).toHaveLength(5)
    expect(milestones.every((b) => b.category === 'milestone')).toBe(true)
  })

  it('should return empty array for unknown category', () => {
    expect(getBadgesByCategory('nonexistent')).toHaveLength(0)
  })
})
