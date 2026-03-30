// Generic Zod validation middleware for Hono

import type { Context, Next } from 'hono'
import { z } from 'zod'
import type { AppEnv } from '../types'

/**
 * Creates a middleware that validates the request JSON body against a Zod schema.
 * Returns 400 with error details if validation fails.
 */
export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return async (c: Context<AppEnv>, next: Next) => {
    try {
      const body = await c.req.json()
      const parsed = schema.parse(body)
      // Store validated data on the context for downstream handlers
      c.set('validatedBody', parsed)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.issues.map((e: z.core.$ZodIssue) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          400
        )
      }

      return c.json(
        { success: false, error: 'Invalid request body' },
        400
      )
    }
  }
}

/**
 * Creates a middleware that validates URL params against a Zod schema.
 */
export const validateParams = <T extends z.ZodTypeAny>(schema: T) => {
  return async (c: Context<AppEnv>, next: Next) => {
    try {
      const params = c.req.param()
      const parsed = schema.parse(params)
      c.set('validatedParams', parsed)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            success: false,
            error: 'Invalid parameters',
            details: error.issues.map((e: z.core.$ZodIssue) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          400
        )
      }

      return c.json(
        { success: false, error: 'Invalid parameters' },
        400
      )
    }
  }
}
