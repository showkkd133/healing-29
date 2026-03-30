// Shared types and constants for Day27 Legacy components

export interface LegacyEntry {
  readonly item: string
  readonly category: string
  readonly ownership: string
  readonly transformation?: string
}

export const LEGACY_CATEGORIES = [
  { id: 'skill', label: '技能' },
  { id: 'cognition', label: '认知' },
  { id: 'experience', label: '体验' },
  { id: 'social', label: '人际' },
  { id: 'other', label: '其他' },
] as const

export const OWNERSHIP_OPTIONS = [
  { id: 'self', label: '我自带的' },
  { id: 'cultivated', label: '关系培养的' },
  { id: 'given', label: '对方给的' },
] as const

export const GUIDANCE_TEXT = '这段关系留给你什么正面遗产？'
export const COMPLETION_TEXT = '你带走了光，留下了影子'
