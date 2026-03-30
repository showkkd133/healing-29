// NOTE: Not currently imported by any component — candidate for integration or removal
//
// Zod validation schemas for daily task data (Day 1-3)

import { z } from 'zod'

// ─── Shared schemas ────────────────────────────────────────────────

const emotionIntensitySchema = z.number().int().min(1).max(10)

// ─── Day 1: Emotion Weather Report ────────────────────────────────

export const day1Schema = z.object({
  type: z.literal('day1'),
  audioFileUri: z.string().nullable(),
  textEntry: z
    .string()
    .min(1, '请写下你的感受')
    .max(5000, '内容不能超过5000字')
    .nullable(),
  moodScore: emotionIntensitySchema,
})

export type Day1Input = z.infer<typeof day1Schema>

// ─── Day 2: Minimum Survival Checklist ────────────────────────────

export const day2Schema = z.object({
  type: z.literal('day2'),
  tasksCompleted: z.tuple([z.boolean(), z.boolean(), z.boolean()]),
  completionRate: z.number().min(0).max(1),
})

export type Day2Input = z.infer<typeof day2Schema>

// ─── Day 3: Silent Companionship ──────────────────────────────────

export const day3Schema = z.object({
  type: z.literal('day3'),
  companionMode: z.enum(['message', 'presence']),
  messageSent: z.boolean(),
})

export type Day3Input = z.infer<typeof day3Schema>

// ─── Discriminated union for Day 1-3 ──────────────────────────────

export const earlyDayDataSchema = z.discriminatedUnion('type', [
  day1Schema,
  day2Schema,
  day3Schema,
])

export type EarlyDayData = z.infer<typeof earlyDayDataSchema>

// ─── Validation helper ────────────────────────────────────────────

/**
 * Validate day data and return a typed result.
 * Returns { success: true, data } or { success: false, error }.
 */
export const validateDayData = <T extends z.ZodTypeAny>(
  schema: T,
  input: unknown
): { readonly success: true; readonly data: z.infer<T> }
  | { readonly success: false; readonly error: string } => {
  const result = schema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data } as const
  }
  const errorMessage = result.error.issues
    .map((issue) => issue.message)
    .join('; ')
  return { success: false, error: errorMessage } as const
}
