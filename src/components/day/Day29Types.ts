// Shared types and constants for Day29 components

import { COLORS } from '@/constants/theme'

// ─── Types ────────────────────────────────────────────────────────

export interface ResumeSections {
  readonly identity: ReadonlyArray<string>
  readonly likes: ReadonlyArray<string>
  readonly experiences: ReadonlyArray<string>
  readonly possibilities: ReadonlyArray<string>
}

export type SectionKey = keyof ResumeSections

export type Day29Phase = 'input' | 'style' | 'preview' | 'review' | 'done'

// ─── Constants ────────────────────────────────────────────────────

export const RESUME_SECTIONS = [
  { id: 'identity', title: '我是谁', placeholder: '添加身份标签，如"程序员""吃货""猫奴"' },
  { id: 'likes', title: '我喜欢什么', placeholder: '添加喜好标签' },
  { id: 'experiences', title: '我想体验什么', placeholder: '添加体验标签' },
  { id: 'possibilities', title: '我有什么可能性', placeholder: '添加可能性标签' },
] as const

export const STYLE_OPTIONS = [
  { id: 'minimal', label: '极简', color: '#FAFAFA', textColor: COLORS.text },
  { id: 'artistic', label: '艺术', color: '#F0E6FF', textColor: '#6B3FA0' },
  { id: 'business', label: '商务', color: '#E8F0F8', textColor: '#2C5282' },
  { id: 'handdrawn', label: '手绘', color: '#FFF8E8', textColor: '#8B6914' },
] as const

export const GUIDANCE_TEXT = '为你自己写一份简历，不提任何恋情'
export const COMPLETION_TEXT = '这不是结束，是你选择的新开始'

export const NEXT_OPTIONS = [
  { id: 'restart', label: '重新开始29天' },
  { id: 'maintenance', label: '进入维护模式' },
  { id: 'export', label: '导出全部数据' },
] as const
