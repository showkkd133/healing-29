// ─── Types ─────────────────────────────────────────────────────────

export interface ActivityOption {
  readonly id: string
  readonly label: string
  readonly icon: string
}

// ─── Constants ─────────────────────────────────────────────────────

export const ACTIVITIES: readonly ActivityOption[] = [
  { id: 'exercise', label: '运动', icon: '🏃' },
  { id: 'food', label: '美食', icon: '🍜' },
  { id: 'bath', label: '热水浴', icon: '🛁' },
  { id: 'other', label: '其他', icon: '✨' },
] as const

export const ACTIVITY_GUIDES: Record<string, readonly string[]> = {
  exercise: [
    '颈部环绕 — 左右各5圈',
    '站立体前屈 — 保持20秒',
    '猫牛式拉伸 — 重复8次',
  ],
  food: [
    '附近的日式定食屋',
    '那家评价很高的面馆',
    '街角新开的甜品店',
  ],
  bath: [
    '水温 40-42°C 最佳',
    '加入一把粗盐或几滴精油',
    '泡 15-20 分钟，不要玩手机',
  ],
} as const

export const TIMER_DURATION_SEC = 15 * 60 // 15 minutes

// ─── Utilities ─────────────────────────────────────────────────────

export const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
