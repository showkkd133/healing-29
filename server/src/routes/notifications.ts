// Notification routes — settings management and schedule

import { Hono } from 'hono'
import { z } from 'zod'
import { validateBody } from '../middleware/validate'
import * as store from '../store/memoryStore'
import type { AppEnv } from '../types'

const notifications = new Hono<AppEnv>()

// ─── Schemas ────────────────────────────────────────────────────────

const notificationSettingsSchema = z.object({
  settings: z.array(
    z.object({
      type: z.enum(['daily_reminder', 'streak_alert', 'badge_earned', 'encouragement']),
      enabled: z.boolean(),
      time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
    })
  ),
})

const scheduleSchema = z.object({
  type: z.enum(['daily_reminder', 'streak_alert', 'badge_earned', 'encouragement']),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/),
  message: z.string().min(1).max(500).optional(),
})

// ─── GET /api/notifications/:userId/settings ────────────────────────

notifications.get('/:userId/settings', async (c) => {
  try {
    const userId = c.req.param('userId')
    if (!userId) return c.json({ success: false, error: 'Missing userId' }, 400)
    const user = store.getUser(userId)

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    const settings = store.getNotificationSettings(userId)
    return c.json({ success: true, data: settings })
  } catch (error) {
    console.error('Failed to get notification settings:', error)
    return c.json(
      { success: false, error: 'Failed to get notification settings' },
      500
    )
  }
})

// ─── PUT /api/notifications/:userId/settings ────────────────────────

notifications.put(
  '/:userId/settings',
  validateBody(notificationSettingsSchema),
  async (c) => {
    try {
      const userId = c.req.param('userId')
      if (!userId) return c.json({ success: false, error: 'Missing userId' }, 400)
      const user = store.getUser(userId)

      if (!user) {
        return c.json({ success: false, error: 'User not found' }, 404)
      }

      const body = c.get('validatedBody') as z.infer<typeof notificationSettingsSchema>
      const updated = store.updateNotificationSettings(userId, body.settings)
      return c.json({ success: true, data: updated })
    } catch (error) {
      console.error('Failed to update notification settings:', error)
      return c.json(
        { success: false, error: 'Failed to update notification settings' },
        500
      )
    }
  }
)

// ─── POST /api/notifications/:userId/schedule — Schedule a push ─────

notifications.post(
  '/:userId/schedule',
  validateBody(scheduleSchema),
  async (c) => {
    try {
      const userId = c.req.param('userId')
      if (!userId) return c.json({ success: false, error: 'Missing userId' }, 400)
      const user = store.getUser(userId)

      if (!user) {
        return c.json({ success: false, error: 'User not found' }, 404)
      }

      const body = c.get('validatedBody') as z.infer<typeof scheduleSchema>

      // Check that the notification type is enabled
      const settings = store.getNotificationSettings(userId)
      const typeSetting = settings.settings.find((s) => s.type === body.type)

      if (!typeSetting?.enabled) {
        return c.json(
          { success: false, error: `Notification type "${body.type}" is disabled` },
          400
        )
      }

      // In production, this would schedule via push notification service
      // For now, return a confirmation with scheduled info
      const scheduled = {
        userId,
        type: body.type,
        scheduledTime: body.scheduledTime,
        message: body.message ?? null,
        scheduledAt: new Date().toISOString(),
        status: 'scheduled' as const,
      }

      return c.json({ success: true, data: scheduled }, 201)
    } catch (error) {
      console.error('Failed to schedule notification:', error)
      return c.json(
        { success: false, error: 'Failed to schedule notification' },
        500
      )
    }
  }
)

export default notifications
