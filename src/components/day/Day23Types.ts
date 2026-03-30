// ─── Shared types and constants for Day23 ─────────────────────────

export interface DecisionEntry {
  readonly choice: string
  readonly time: number
  readonly satisfaction: string
}

export const DECISION_PAIRS = [
  { question: '早餐', optionA: '粥', optionB: '面包' },
  { question: '出门', optionA: '左转', optionB: '右转' },
  { question: '饮品', optionA: '咖啡', optionB: '茶' },
  { question: '今晚', optionA: '看书', optionB: '看剧' },
  { question: '运动', optionA: '走路', optionB: '跑步' },
] as const

export const SATISFACTION_OPTIONS = [
  { id: 'happy', emoji: '😊', label: '满意' },
  { id: 'regret', emoji: '😅', label: '后悔' },
  { id: 'neutral', emoji: '😐', label: '无所谓' },
] as const

export const DECISION_TIMEOUT_MS = 10_000

export const GUIDANCE_TEXT = '今天所有小事，10秒内决定'
export const REGRET_TEXT = '但你也活下来了'
export const COMPLETION_TEXT = '没有最优解，只有你的选择'
