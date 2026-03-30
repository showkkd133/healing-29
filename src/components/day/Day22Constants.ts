// Constants and types for Day22 Trigger Map

// ─── Trigger entry type ───────────────────────────────────────────

export interface TriggerEntry {
  readonly type: string
  readonly name: string
  readonly response: string
  readonly strategy: string
  readonly effectiveness: number
}

// ─── Selection options ────────────────────────────────────────────

export const TRIGGER_TYPES = [
  { id: 'place', emoji: '📍', label: '地点' },
  { id: 'item', emoji: '🎁', label: '物品' },
  { id: 'song', emoji: '🎵', label: '歌曲' },
  { id: 'smell', emoji: '👃', label: '气味' },
  { id: 'time', emoji: '⏰', label: '时间' },
  { id: 'other', emoji: '❓', label: '其他' },
] as const

export const BODY_RESPONSES = [
  { id: 'heartbeat', emoji: '💓', label: '心跳加速' },
  { id: 'stomach', emoji: '😣', label: '胃紧缩' },
  { id: 'cry', emoji: '😢', label: '想哭' },
  { id: 'numb', emoji: '😶', label: '麻木' },
  { id: 'other', emoji: '🔘', label: '其他' },
] as const

export const COPING_STRATEGIES = [
  { id: 'breathe', emoji: '🧘', label: '深呼吸' },
  { id: 'leave', emoji: '🚶', label: '离开现场' },
  { id: 'distract', emoji: '🎮', label: '转移注意' },
  { id: 'other', emoji: '🔘', label: '其他' },
] as const

export const GUIDANCE_TEXT = '标记今天的触发时刻'
export const COMPLETION_TEXT = '知道陷阱在哪，就不会掉进去'
