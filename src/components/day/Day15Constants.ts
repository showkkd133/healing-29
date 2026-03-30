import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { StyleSheet } from 'react-native'

// ─── Types ────────────────────────────────────────────────────────

export interface Day15RitualReplaceProps {
  readonly onComplete: (data: {
    readonly oldRitual: string
    readonly newRitual: string
    readonly feeling: string
    readonly reminderSet: boolean
  }) => void
}

export interface RitualOption {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
}

export interface FeelingOption {
  readonly id: string
  readonly label: string
}

// ─── Constants ────────────────────────────────────────────────────

export const NEW_RITUALS: readonly RitualOption[] = [
  { id: 'bestie', title: '给闺蜜发晚安', description: '把温暖转给值得的人', icon: '💬' },
  { id: 'journal', title: '写日记', description: '和自己对话三行字', icon: '📓' },
  { id: 'podcast', title: '听播客入睡', description: '让别人的故事陪你', icon: '🎧' },
  { id: 'custom', title: '自定义', description: '创造属于你的新仪式', icon: '✨' },
] as const

export const CUTE_STICKERS = ['🌙', '💤', '🥰', '✨', '🤗', '💕'] as const

export const FEELINGS: readonly FeelingOption[] = [
  { id: 'free', label: '更自由' },
  { id: 'empty', label: '有点空' },
  { id: 'similar', label: '差不多' },
  { id: 'other', label: '其他' },
] as const

// ─── Shared Styles ────────────────────────────────────────────────

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
})
