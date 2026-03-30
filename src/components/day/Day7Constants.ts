// Day 7 — Self Hunt shared constants and types

export interface Day7SelfHuntProps {
  readonly onComplete: (data: {
    readonly appreciations: string[]
    readonly category: string[]
  }) => void
}

export const GUIDANCE_TEXT = '找出3个你喜欢自己的地方'

export const TABS = [
  { key: 'appearance', label: '外貌' },
  { key: 'personality', label: '性格' },
  { key: 'ability', label: '能力' },
  { key: 'other', label: '其他' },
] as const

export const INSPIRATION_TAGS: Record<string, readonly string[]> = {
  appearance: ['笑起来好看', '眼睛有神', '发型好看', '身材匀称', '皮肤好', '手好看'],
  personality: ['靠谱', '善良', '有耐心', '幽默', '真诚', '温柔'],
  ability: ['做饭好吃', '学东西快', '有创造力', '善于倾听', '解决问题能力强', '文笔好'],
  other: ['有品味', '很努力', '独立', '有责任心', '乐观', '坚强'],
} as const

export const COMPLETION_TEXT = '这是你的新装备，随时查看'
export const TOTAL_SLOTS = 3
