import { describe, expect, test } from 'bun:test'
import {
  day1Schema,
  day2Schema,
  day3Schema,
  earlyDayDataSchema,
  validateDayData,
} from '../validators'

describe('day1Schema', () => {
  test('accepts valid input', () => {
    const input = { type: 'day1', audioFileUri: null, textEntry: 'hello', moodScore: 5 }
    expect(day1Schema.parse(input)).toEqual(input)
  })

  test('rejects moodScore out of range', () => {
    const input = { type: 'day1', audioFileUri: null, textEntry: 'hi', moodScore: 11 }
    expect(() => day1Schema.parse(input)).toThrow()
  })

  test('rejects moodScore of 0', () => {
    const input = { type: 'day1', audioFileUri: null, textEntry: 'hi', moodScore: 0 }
    expect(() => day1Schema.parse(input)).toThrow()
  })

  test('rejects empty textEntry when not null', () => {
    const input = { type: 'day1', audioFileUri: null, textEntry: '', moodScore: 5 }
    expect(() => day1Schema.parse(input)).toThrow()
  })
})

describe('day2Schema', () => {
  test('accepts valid input', () => {
    const input = { type: 'day2', tasksCompleted: [true, false, true], completionRate: 0.67 }
    expect(day2Schema.parse(input)).toEqual(input)
  })

  test('rejects completionRate above 1', () => {
    const input = { type: 'day2', tasksCompleted: [true, true, true], completionRate: 1.5 }
    expect(() => day2Schema.parse(input)).toThrow()
  })

  test('rejects wrong tuple length', () => {
    const input = { type: 'day2', tasksCompleted: [true, false], completionRate: 0.5 }
    expect(() => day2Schema.parse(input)).toThrow()
  })
})

describe('day3Schema', () => {
  test('accepts valid input', () => {
    const input = { type: 'day3', companionMode: 'message', messageSent: true }
    expect(day3Schema.parse(input)).toEqual(input)
  })

  test('rejects invalid companionMode', () => {
    const input = { type: 'day3', companionMode: 'invalid', messageSent: false }
    expect(() => day3Schema.parse(input)).toThrow()
  })
})

describe('earlyDayDataSchema', () => {
  test('discriminates by type field', () => {
    const d1 = { type: 'day1', audioFileUri: null, textEntry: null, moodScore: 3 }
    expect(earlyDayDataSchema.parse(d1)).toEqual(d1)
  })

  test('rejects unknown type', () => {
    const input = { type: 'day99', foo: 'bar' }
    expect(() => earlyDayDataSchema.parse(input)).toThrow()
  })
})

describe('validateDayData', () => {
  test('returns success for valid data', () => {
    const input = { type: 'day1', audioFileUri: null, textEntry: 'test', moodScore: 7 }
    const result = validateDayData(day1Schema, input)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toEqual(input)
  })

  test('returns error string for invalid data', () => {
    const result = validateDayData(day1Schema, { type: 'day1' })
    expect(result.success).toBe(false)
    if (!result.success) expect(typeof result.error).toBe('string')
  })
})
