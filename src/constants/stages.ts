// 10 healing stages that group the 29 days into thematic phases

import type { Stage } from '@/types'
import { COLORS } from './theme'

export const STAGES: readonly Stage[] = [
  {
    id: 'emergency',
    name: '紧急自救',
    days: [1, 2, 3],
    color: COLORS.stageEmergency,
    description: '最痛的前三天，先稳住自己。接纳情绪，保证最基本的生存需求。',
  },
  {
    id: 'rebuild',
    name: '秩序重建',
    days: [4, 5, 6],
    color: COLORS.stageRebuild,
    description: '告别旧有痕迹，建立新的日常节奏。写告别信、清理物品、重设作息。',
  },
  {
    id: 'energy',
    name: '能量补给',
    days: [7, 8, 9],
    color: COLORS.stageEnergy,
    description: '通过冥想、感恩和内在对话，为自己补充消耗的心理能量。',
  },
  {
    id: 'deep-healing',
    name: '深度疗愈',
    days: [10, 11, 12],
    color: COLORS.stageDeepHealing,
    description: '审视能量消耗模式，练习设立界限，给自己写一封自我疗愈的信。',
  },
  {
    id: 'review',
    name: '中途回顾',
    days: [13, 14],
    color: COLORS.stageReview,
    description: '重新解读记忆，回顾旅程中期的成长变化。',
  },
  {
    id: 'disillusion',
    name: '祛魅脱敏',
    days: [15, 16, 17],
    color: COLORS.stageDisillusion,
    description: '释放愤怒，探索宽恕，重新找回属于自己的社会身份。',
  },
  {
    id: 'desensitize',
    name: '脱敏训练',
    days: [18, 19],
    color: COLORS.stageDesensitize,
    description: '有意识地面对触发点，练习降低情绪反应强度。',
  },
  {
    id: 'reorganize',
    name: '重组生活',
    days: [20, 21, 22, 23],
    color: COLORS.stageReorganize,
    description: '重新对齐价值观，通过创造性表达和新挑战重组生活版图。',
  },
  {
    id: 'awakening',
    name: '觉醒成长',
    days: [24, 25, 26, 27],
    color: COLORS.stageAwakening,
    description: '建立支持网络，庆祝里程碑，制定触发管理计划，书写成长叙事。',
  },
  {
    id: 'restart',
    name: '崭新启程',
    days: [28, 29],
    color: COLORS.stageRestart,
    description: '写给自己的信，发表新的开始宣言。你已准备好重新出发。',
  },
] as const

/** Look up the stage for a given day number */
export const getStageByDay = (dayNumber: number): Stage | undefined =>
  STAGES.find((stage) => stage.days.includes(dayNumber as any))

/** Look up a stage by its id */
export const getStageById = (stageId: string): Stage | undefined =>
  STAGES.find((stage) => stage.id === stageId)
