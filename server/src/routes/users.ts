// User routes — create anonymous users, get info, update preferences

import { Hono } from 'hono'
import { z } from 'zod'
import { validateBody } from '../middleware/validate'
import * as store from '../store/memoryStore'
import type { AppEnv } from '../types'

const users = new Hono<AppEnv>()

// ─── Schemas ────────────────────────────────────────────────────────

const preferencesSchema = z.object({
  notificationTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  privacyLevel: z.enum(['local', 'cloud', 'offline']).optional(),
})

// ─── POST /api/users — Create anonymous user ────────────────────────

users.post('/', async (c) => {
  try {
    const id = crypto.randomUUID()
    const user = store.createUser(id)
    return c.json({ success: true, data: user }, 201)
  } catch (error) {
    console.error('Failed to create user:', error)
    return c.json({ success: false, error: 'Failed to create user' }, 500)
  }
})

// ─── GET /api/users/:id — Get user info ─────────────────────────────

users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    if (!id) return c.json({ success: false, error: 'Missing id' }, 400)
    const user = store.getUser(id)

    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    return c.json({ success: true, data: user })
  } catch (error) {
    console.error('Failed to get user:', error)
    return c.json({ success: false, error: 'Failed to get user' }, 500)
  }
})

// ─── PATCH /api/users/:id/preferences — Update preferences ─────────

users.patch(
  '/:id/preferences',
  validateBody(preferencesSchema),
  async (c) => {
    try {
      const id = c.req.param('id')
      if (!id) return c.json({ success: false, error: 'Missing id' }, 400)
      const preferences = c.get('validatedBody') as z.infer<typeof preferencesSchema>

      const user = store.getUser(id)
      if (!user) {
        return c.json({ success: false, error: 'User not found' }, 404)
      }

      const updated = store.updateUserPreferences(id, preferences)
      return c.json({ success: true, data: updated })
    } catch (error) {
      console.error('Failed to update preferences:', error)
      return c.json(
        { success: false, error: 'Failed to update preferences' },
        500
      )
    }
  }
)

export default users
