// Badge routes — definitions, user badges, badge check/award

import { Hono } from 'hono'
import * as store from '../store/memoryStore'
import type { BadgeDefinition } from '../types'

const badges = new Hono()

// ─── Badge Definitions (mirrors frontend constants/badges.ts) ───────

const BADGE_DEFINITIONS: readonly BadgeDefinition[] = [
  // Milestone badges
  { id: 'first-step', name: '第一步', description: '完成第1天的任务', icon: '👣', category: 'milestone', requirement: { type: 'day_complete', value: 1 } },
  { id: 'one-week', name: '一周勇士', description: '完成前7天的旅程', icon: '🏅', category: 'milestone', requirement: { type: 'day_complete', value: 7 } },
  { id: 'halfway', name: '半程英雄', description: '完成第14天', icon: '⭐', category: 'milestone', requirement: { type: 'day_complete', value: 14 } },
  { id: 'three-weeks', name: '三周里程碑', description: '完成前21天的旅程', icon: '🏆', category: 'milestone', requirement: { type: 'day_complete', value: 21 } },
  { id: 'journey-complete', name: '涅槃重生', description: '完成全部29天', icon: '🦋', category: 'milestone', requirement: { type: 'day_complete', value: 29 } },
  // Streak badges
  { id: 'streak-3', name: '初露锋芒', description: '连续完成3天', icon: '🔥', category: 'streak', requirement: { type: 'streak', value: 3 } },
  { id: 'streak-7', name: '势不可挡', description: '连续完成7天', icon: '💪', category: 'streak', requirement: { type: 'streak', value: 7 } },
  { id: 'streak-14', name: '坚韧不拔', description: '连续完成14天', icon: '🌟', category: 'streak', requirement: { type: 'streak', value: 14 } },
  { id: 'streak-29', name: '完美旅程', description: '29天零中断', icon: '👑', category: 'streak', requirement: { type: 'streak', value: 29 } },
  // Stage badges
  { id: 'stage-emergency', name: '自救成功', description: '完成"紧急自救"阶段', icon: '🛟', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'emergency' } },
  { id: 'stage-rebuild', name: '秩序回归', description: '完成"秩序重建"阶段', icon: '🧱', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'rebuild' } },
  { id: 'stage-energy', name: '能量满格', description: '完成"能量补给"阶段', icon: '⚡', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'energy' } },
  { id: 'stage-deep-healing', name: '深层治愈', description: '完成"深度疗愈"阶段', icon: '💜', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'deep-healing' } },
  { id: 'stage-review', name: '回望智者', description: '完成"中途回顾"阶段', icon: '🔭', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'review' } },
  { id: 'stage-disillusion', name: '破茧而出', description: '完成"祛魅脱敏"阶段', icon: '🦋', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'disillusion' } },
  { id: 'stage-desensitize', name: '无畏勇者', description: '完成"脱敏训练"阶段', icon: '🛡️', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'desensitize' } },
  { id: 'stage-reorganize', name: '生活建筑师', description: '完成"重组生活"阶段', icon: '🏗️', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'reorganize' } },
  { id: 'stage-awakening', name: '觉醒之光', description: '完成"觉醒成长"阶段', icon: '🌅', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'awakening' } },
  { id: 'stage-restart', name: '新生', description: '完成"崭新启程"阶段', icon: '🌱', category: 'stage', requirement: { type: 'stage_complete', value: 1, stageId: 'restart' } },
  // Special badges
  { id: 'night-owl', name: '深夜疗愈者', description: '在凌晨12点后完成任务', icon: '🦉', category: 'special', requirement: { type: 'special', value: 1 } },
  { id: 'early-bird', name: '晨光先行者', description: '在早上6点前完成任务', icon: '🐦', category: 'special', requirement: { type: 'special', value: 2 } },
  { id: 'wordsmith', name: '文字疗愈师', description: '累计写作超过3000字', icon: '✍️', category: 'special', requirement: { type: 'special', value: 3 } },
  { id: 'mood-climber', name: '情绪攀登者', description: '心情评分连续3天上升', icon: '📈', category: 'special', requirement: { type: 'special', value: 4 } },
]

// ─── GET /api/badges — All badge definitions ────────────────────────

badges.get('/', async (c) => {
  try {
    return c.json({ success: true, data: BADGE_DEFINITIONS })
  } catch (error) {
    console.error('Failed to get badge definitions:', error)
    return c.json({ success: false, error: 'Failed to get badges' }, 500)
  }
})

// ─── GET /api/badges/:userId — User's earned badges ─────────────────

badges.get('/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const user = store.getUser(userId)

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const userBadges = store.getUserBadges(userId)

    // Enrich with badge definition details
    const enriched = userBadges.map((ub) => {
      const definition = BADGE_DEFINITIONS.find((d) => d.id === ub.badgeId)
      return {
        ...ub,
        badge: definition ?? null,
      }
    })

    return c.json({ success: true, data: enriched })
  } catch (error) {
    console.error('Failed to get user badges:', error)
    return c.json({ success: false, error: 'Failed to get user badges' }, 500)
  }
})

// ─── POST /api/badges/:userId/check — Check and award new badges ────

badges.post('/:userId/check', async (c) => {
  try {
    const userId = c.req.param('userId')
    const user = store.getUser(userId)

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const logs = store.getDailyLogs(userId)
    const completedDays = logs.length
    const streak = user.streakDays
    const newlyAwarded: string[] = []

    for (const badge of BADGE_DEFINITIONS) {
      // Skip if already earned
      if (store.hasBadge(userId, badge.id)) continue

      let earned = false

      switch (badge.requirement.type) {
        case 'day_complete':
          earned = completedDays >= badge.requirement.value
          break
        case 'streak':
          earned = streak >= badge.requirement.value
          break
        case 'stage_complete':
          // TODO: implement stage completion check with stage config
          break
        case 'special':
          // Special badges require specific logic — handled externally
          break
      }

      if (earned) {
        store.awardBadge(userId, badge.id)
        newlyAwarded.push(badge.id)
      }
    }

    return c.json({
      success: true,
      data: {
        newlyAwarded,
        totalBadges: store.getUserBadges(userId).length,
      },
    })
  } catch (error) {
    console.error('Failed to check badges:', error)
    return c.json({ success: false, error: 'Failed to check badges' }, 500)
  }
})

export default badges
