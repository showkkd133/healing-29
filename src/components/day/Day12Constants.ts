// Day 12 – Kindness Experiment shared types and constants

export interface TargetOption {
  readonly id: string
  readonly icon: string
  readonly label: string
}

export interface MethodOption {
  readonly id: string
  readonly title: string
  readonly description: string
}

export interface ReactionOption {
  readonly id: string
  readonly emoji: string
  readonly label: string
}

export const TARGET_TABS: readonly TargetOption[] = [
  { id: 'staff', icon: '👨‍🍳', label: '服务人员' },
  { id: 'stranger', icon: '🚶', label: '陌生人' },
  { id: 'friend', icon: '👫', label: '朋友' },
] as const

export const INTROVERT_TARGETS: readonly TargetOption[] = [
  { id: 'pet', icon: '🐱', label: '宠物' },
  { id: 'plant', icon: '🌱', label: '植物' },
] as const

export const METHODS: readonly MethodOption[] = [
  { id: 'thanks', title: '真诚说谢谢', description: '看着TA的眼睛，认真说一句谢谢' },
  { id: 'compliment', title: '赞美具体细节', description: '找到一个具体的点去赞美' },
  { id: 'smile', title: '默默微笑', description: '给TA一个温暖的微笑就好' },
] as const

export const REACTIONS: readonly ReactionOption[] = [
  { id: 'warm', emoji: '😊', label: '热情' },
  { id: 'neutral', emoji: '😐', label: '平淡' },
  { id: 'surprised', emoji: '😮', label: '惊讶' },
  { id: 'none', emoji: '🤷', label: '无反应' },
] as const
