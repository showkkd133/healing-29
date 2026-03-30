// Day 11 Meltdown Day — shared constants and types

export interface Day11MeltdownDayProps {
  readonly onComplete: (data: {
    readonly duration: number
    readonly toolsUsed: readonly string[]
    readonly faceWashed: boolean
  }) => void
}

export type MeltdownPhase = 'setup' | 'meltdown' | 'timeup' | 'completed'

export interface DurationOption {
  readonly id: string
  readonly label: string
  readonly minutes: number
}

export const DURATION_OPTIONS: readonly DurationOption[] = [
  { id: '1h', label: '1小时', minutes: 60 },
  { id: '2h', label: '2小时', minutes: 120 },
  { id: 'custom', label: '自定义', minutes: 0 },
] as const

export interface ToolItem {
  readonly id: string
  readonly icon: string
  readonly iconName: string
  readonly title: string
}

export const TOOLS: readonly ToolItem[] = [
  { id: 'photos', icon: '❤️', iconName: 'heart', title: '前任照片查看器' },
  { id: 'music', icon: '🎵', iconName: 'music', title: '悲伤歌单' },
  { id: 'timeline', icon: '📝', iconName: 'edit-3', title: '回忆时间线' },
  { id: 'vent', icon: '💢', iconName: 'zap', title: '发泄打字板' },
] as const

export const MOCK_SONGS = [
  '后来 — 刘若英',
  '说散就散 — 袁娅维',
  '体面 — 于文文',
  '我们没有在一起 — 刘若英',
  '分手快乐 — 梁静茹',
] as const

export const EXTEND_CONFIRMATIONS_NEEDED = 3

export const formatCountdown = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
