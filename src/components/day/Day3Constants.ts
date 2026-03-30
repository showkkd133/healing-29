// ─── Shared types and constants for Day3 ──────────────────────────

export type CompanionMode = 'message' | 'presence'

export interface MessageTemplate {
  readonly id: number
  readonly text: string
}

export const MESSAGE_TEMPLATES: readonly MessageTemplate[] = [
  { id: 1, text: '最近有点难过，不用回我，就想告诉你一声' },
  { id: 2, text: '在自我修复中，晚些找你' },
] as const

export interface NearbyPlace {
  readonly id: string
  readonly name: string
  readonly type: string
  readonly distance: string
}

export const NEARBY_PLACES: readonly NearbyPlace[] = [
  { id: 'p1', name: '安静咖啡馆', type: '☕', distance: '350m' },
  { id: 'p2', name: '城市花园', type: '🌳', distance: '500m' },
  { id: 'p3', name: '街角书屋', type: '📚', distance: '800m' },
  { id: 'p4', name: '河边步道', type: '🌊', distance: '1.2km' },
  { id: 'p5', name: '社区公园', type: '🏞', distance: '1.5km' },
] as const

// Virtual companionship count — gives sense of connection
export const COMPANION_COUNT = 1247

export const BADGE_NAME = '我不是一个人'
