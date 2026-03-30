// Healing-29 API server — Bun + Hono

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import users from './routes/users'
import journey from './routes/journey'
import badges from './routes/badges'
import notifications from './routes/notifications'

const app = new Hono()

// ─── Global Middleware ──────────────────────────────────────────────

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:8081', 'http://localhost:19006'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

// ─── Routes ─────────────────────────────────────────────────────────

app.route('/api/users', users)
app.route('/api/journey', journey)
app.route('/api/badges', badges)
app.route('/api/notifications', notifications)

// ─── Health Check ───────────────────────────────────────────────────

app.get('/api/health', (c) => {
  return c.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
})

// ─── 404 Fallback ───────────────────────────────────────────────────

app.notFound((c) => {
  return c.json({ success: false, error: 'Not found' }, 404)
})

// ─── Global Error Handler ───────────────────────────────────────────

app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ success: false, error: 'Internal server error' }, 500)
})

// ─── Start Server ───────────────────────────────────────────────────

const PORT = Number(process.env.PORT) || 3001

export default {
  port: PORT,
  fetch: app.fetch,
}

console.info(`Healing-29 API server running on http://localhost:${PORT}`)
