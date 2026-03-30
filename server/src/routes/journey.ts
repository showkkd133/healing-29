// Journey routes — start/complete days, get logs, mood trends, summary

import { Hono } from 'hono'
import { z } from 'zod'
import { validateBody } from '../middleware/validate'
import * as store from '../store/memoryStore'
import type { AppEnv, DayNumber, EmotionIntensity } from '../types'

const journey = new Hono<AppEnv>()

// ─── Schemas ────────────────────────────────────────────────────────

const dayParamSchema = z.coerce.number().int().min(1).max(29)

const startDaySchema = z.object({
  theme: z.string().min(1).max(200),
})

const completeDaySchema = z.object({
  moodScore: z.number().int().min(1).max(10),
  taskData: z.record(z.string(), z.unknown()),
})

// ─── Helper ─────────────────────────────────────────────────────────

const parseDayParam = (raw: string | undefined): DayNumber | null => {
  if (!raw) return null
  const result = dayParamSchema.safeParse(raw)
  return result.success ? (result.data as DayNumber) : null
}

const ensureUser = (userId: string | undefined) => {
  if (!userId) return undefined
  return store.getUser(userId)
}

// ─── POST /api/journey/:userId/days/:day/start ──────────────────────

journey.post(
  '/:userId/days/:day/start',
  validateBody(startDaySchema),
  async (c) => {
    try {
      const userId = c.req.param('userId')
      const day = parseDayParam(c.req.param('day'))

      if (!userId || !day) {
        return c.json({ success: false, error: !userId ? 'Missing userId' : 'Invalid day number (1-29)' }, 400)
      }

      if (!ensureUser(userId)) {
        return c.json({ success: false, error: 'User not found' }, 404)
      }

      const body = c.get('validatedBody') as z.infer<typeof startDaySchema>
      const log = store.startDay(userId, day, body.theme)

      return c.json({ success: true, data: log }, 201)
    } catch (error) {
      console.error('Failed to start day:', error)
      return c.json({ success: false, error: 'Failed to start day' }, 500)
    }
  }
)

// ─── POST /api/journey/:userId/days/:day/complete ───────────────────

journey.post(
  '/:userId/days/:day/complete',
  validateBody(completeDaySchema),
  async (c) => {
    try {
      const userId = c.req.param('userId')
      const day = parseDayParam(c.req.param('day'))

      if (!userId || !day) {
        return c.json({ success: false, error: !userId ? 'Missing userId' : 'Invalid day number (1-29)' }, 400)
      }

      if (!ensureUser(userId)) {
        return c.json({ success: false, error: 'User not found' }, 404)
      }

      const body = c.get('validatedBody') as z.infer<typeof completeDaySchema>
      const log = store.completeDay(
        userId,
        day,
        body.moodScore as EmotionIntensity,
        body.taskData
      )

      if (!log) {
        return c.json(
          { success: false, error: 'Day not started yet. Call start first.' },
          400
        )
      }

      return c.json({ success: true, data: log })
    } catch (error) {
      console.error('Failed to complete day:', error)
      return c.json({ success: false, error: 'Failed to complete day' }, 500)
    }
  }
)

// ─── GET /api/journey/:userId/days — All completed day logs ─────────

journey.get('/:userId/days', async (c) => {
  try {
    const userId = c.req.param('userId')
    if (!userId) return c.json({ success: false, error: 'Missing userId' }, 400)

    if (!ensureUser(userId)) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const logs = store.getDailyLogs(userId)
    return c.json({ success: true, data: logs })
  } catch (error) {
    console.error('Failed to get daily logs:', error)
    return c.json({ success: false, error: 'Failed to get daily logs' }, 500)
  }
})

// ─── GET /api/journey/:userId/days/:day — Single day detail ─────────

journey.get('/:userId/days/:day', async (c) => {
  try {
    const userId = c.req.param('userId')
    const day = parseDayParam(c.req.param('day'))

    if (!userId || !day) {
      return c.json({ success: false, error: !userId ? 'Missing userId' : 'Invalid day number (1-29)' }, 400)
    }

    if (!ensureUser(userId)) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const log = store.getDayLog(userId, day)
    if (!log) {
      return c.json({ success: false, error: 'Day log not found' }, 404)
    }

    return c.json({ success: true, data: log })
  } catch (error) {
    console.error('Failed to get day log:', error)
    return c.json({ success: false, error: 'Failed to get day log' }, 500)
  }
})

// ─── GET /api/journey/:userId/mood-trend — Mood trend data ──────────

journey.get('/:userId/mood-trend', async (c) => {
  try {
    const userId = c.req.param('userId')
    if (!userId) return c.json({ success: false, error: 'Missing userId' }, 400)

    if (!ensureUser(userId)) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const trend = store.getMoodTrend(userId)
    return c.json({ success: true, data: trend })
  } catch (error) {
    console.error('Failed to get mood trend:', error)
    return c.json({ success: false, error: 'Failed to get mood trend' }, 500)
  }
})

// ─── GET /api/journey/:userId/summary — Journey summary (Day 29+) ──

journey.get('/:userId/summary', async (c) => {
  try {
    const userId = c.req.param('userId')
    if (!userId) return c.json({ success: false, error: 'Missing userId' }, 400)

    const user = ensureUser(userId)

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const logs = store.getDailyLogs(userId)
    const completedCount = logs.length

    // Summary is available after completing at least 1 day (full summary after Day 29)
    if (completedCount === 0) {
      return c.json(
        { success: false, error: 'No completed days yet' },
        400
      )
    }

    const moodScores = logs.map((l) => l.moodScore)
    const averageMood =
      moodScores.reduce((sum, s) => sum + s, 0) / moodScores.length

    const badges = store.getUserBadges(userId)

    const summary = {
      userId,
      totalDaysCompleted: completedCount,
      currentStreak: user.streakDays,
      longestStreak: user.streakDays, // simplified — track separately in production
      averageMoodScore: Math.round(averageMood * 10) / 10,
      moodTrend: store.getMoodTrend(userId),
      completedStages: [], // TODO: derive from completed days + stage config
      earnedBadges: badges.map((b) => b.badgeId),
      startDate: user.createdAt,
      lastActiveDate: logs[logs.length - 1]?.completedAt ?? user.createdAt,
    }

    return c.json({ success: true, data: summary })
  } catch (error) {
    console.error('Failed to get journey summary:', error)
    return c.json(
      { success: false, error: 'Failed to get journey summary' },
      500
    )
  }
})

export default journey
