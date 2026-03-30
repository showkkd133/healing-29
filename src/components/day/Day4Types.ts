// Shared types and constants for Day4 Declutter components

export interface DeclutterItem {
  readonly id: string
  readonly name: string
  readonly category: string
}

export const CATEGORIES = [
  { key: 'photo', label: '照片类', icon: 'camera' },
  { key: 'gift', label: '礼物类', icon: 'gift' },
  { key: 'daily', label: '日常用品类', icon: 'home' },
  { key: 'other', label: '其他', icon: 'package' },
] as const

export const GUIDANCE_TEXT = '今天只收拾，不做决定。把相关物品放进一个盒子'
export const COMPLETION_TEXT = '你把回忆收好了，现在房间是现在的你'

// Box icons based on item count
export const getBoxIcon = (count: number): string => {
  if (count === 0) return 'package'
  if (count <= 3) return 'archive'
  if (count <= 6) return 'mail'
  return 'gift'
}

export const getBoxLabel = (count: number): string => {
  if (count === 0) return '空箱子'
  if (count <= 3) return '刚开始装'
  if (count <= 6) return '装了一半'
  return '快满了'
}

// Default seal date: 3 months from today
export const getDefaultSealDate = (): string => {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
