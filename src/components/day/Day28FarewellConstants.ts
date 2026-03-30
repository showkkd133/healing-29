// Shared types and constants for Day28 Farewell components

export interface Day28FarewellResult {
  readonly method: string
  readonly element?: string
  readonly item: string
  readonly farewellWords: string
  readonly mood: string
}

export interface Day28FarewellProps {
  readonly onComplete: (data: Day28FarewellResult) => void
}

export const METHOD_OPTIONS = [
  { id: 'virtual', emoji: '🌊', label: '虚拟' },
  { id: 'reality', emoji: '🔥', label: '现实' },
] as const

export const ELEMENTS = [
  { id: 'water', emoji: '💧', label: '水', color: '#B3D9E8' },
  { id: 'fire', emoji: '🔥', label: '火', color: '#E8B3B3' },
  { id: 'earth', emoji: '🌱', label: '土', color: '#C8D9B3' },
  { id: 'wind', emoji: '🌬', label: '风', color: '#D9D9E8' },
] as const

export const MOOD_OPTIONS = [
  { id: 'relieved', emoji: '😌', label: '轻松' },
  { id: 'empty', emoji: '🫥', label: '空虚' },
  { id: 'sad', emoji: '😢', label: '悲伤' },
  { id: 'other', emoji: '🤔', label: '其他' },
] as const

export const DEFAULT_FAREWELL = '谢谢你，我不需要你了'
export const COMPLETION_TEXT = '空间腾出来了，给新的可能'
export const SAFETY_GUIDE = '安全提醒：请在安全环境中进行，不要燃烧危险物品。如果选择撕碎或丢弃，确保妥善处理。注意保护自己和环境。'

export type FarewellPhase = 'input' | 'release' | 'mood' | 'certificate' | 'done'
