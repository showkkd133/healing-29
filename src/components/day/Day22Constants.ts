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

export interface TriggerOption {
  readonly id: string
  readonly icon: string
  readonly label: string
  readonly provider?: 'Feather' | 'Ionicons'
}

export const TRIGGER_TYPES: readonly TriggerOption[] = [
  { id: 'place', icon: 'map-pin', label: '地点' },
  { id: 'item', icon: 'gift', label: '物品' },
  { id: 'song', icon: 'music', label: '歌曲' },
  { id: 'smell', icon: 'wind', label: '气味' },
  { id: 'time', icon: 'clock', label: '时间' },
  { id: 'other', icon: 'help-circle', label: '其他' },
] as const

export const BODY_RESPONSES: readonly TriggerOption[] = [
  { id: 'heartbeat', icon: 'heart', label: '心跳加速' },
  { id: 'stomach', icon: 'activity', label: '胃紧缩' },
  { id: 'cry', icon: 'frown', label: '想哭' },
  { id: 'numb', icon: 'minus-circle', label: '麻木' },
  { id: 'other', icon: 'more-horizontal', label: '其他' },
] as const

export const COPING_STRATEGIES: readonly TriggerOption[] = [
  { id: 'breathe', icon: 'wind', label: '深呼吸' },
  { id: 'leave', icon: 'log-out', label: '离开现场' },
  { id: 'distract', icon: 'smile', label: '转移注意' },
  { id: 'other', icon: 'more-horizontal', label: '其他' },
] as const

export const GUIDANCE_TEXT = '标记今天的触发时刻'
export const COMPLETION_TEXT = '知道陷阱在哪，就不会掉进去'
