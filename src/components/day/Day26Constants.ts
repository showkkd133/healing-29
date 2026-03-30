// Shared constants for Day26 self-gift components

export const WISH_TYPES = [
  { id: 'travel', icon: 'map', label: '旅行' },
  { id: 'item', icon: 'gift', label: '物品' },
  { id: 'experience', icon: 'activity', label: '体验' },
  { id: 'learning', icon: 'book', label: '学习' },
] as const

export const PLAN_OPTIONS = [
...

  { id: 'this_week', label: '本周做' },
  { id: 'future', label: '规划未来做' },
] as const

export const SLIDER_LABELS = [
  { id: 'time', label: '时间' },
  { id: 'money', label: '金钱' },
  { id: 'energy', label: '精力' },
] as const

export const GUIDANCE_TEXT = '做一件恋爱时想做但没做的事'
