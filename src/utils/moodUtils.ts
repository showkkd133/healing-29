// Mood-related utility functions for emotion scoring and visualization
import { COLORS } from '@/constants/theme'

/**
 * Map a mood score (1-10) to a representative emoji
 */
export const getMoodEmoji = (score: number): string => {
  const emojiMap: Record<number, string> = {
    1: '🌪️',
    2: '⛈️',
    3: '🌧️',
    4: '🌦️',
    5: '☁️',
    6: '🌥️',
    7: '⛅',
    8: '🌤️',
    9: '☀️',
    10: '🌈',
  }
  const clamped = Math.max(1, Math.min(10, Math.round(score)))
  return emojiMap[clamped] ?? '☁️'
}

/**
 * Map a mood score (1-10) to a Chinese weather-style label
 */
export const getMoodLabel = (score: number): string => {
  const labelMap: Record<number, string> = {
    1: '暴风雨',
    2: '雷阵雨',
    3: '大雨',
    4: '小雨',
    5: '多云',
    6: '阴转晴',
    7: '多云转晴',
    8: '晴',
    9: '晴空万里',
    10: '彩虹',
  }
  const clamped = Math.max(1, Math.min(10, Math.round(score)))
  return labelMap[clamped] ?? '多云'
}

/**
 * Map a mood score (1-10) to a gradient-friendly color
 */
export const getMoodColor = (score: number): string => {
  const colorMap: Record<number, string> = {
    1: COLORS.mood1,
    2: COLORS.mood2,
    3: COLORS.mood3,
    4: COLORS.mood4,
    5: COLORS.mood5,
    6: COLORS.mood6,
    7: COLORS.mood7,
    8: COLORS.mood8,
    9: COLORS.mood9,
    10: COLORS.mood10,
  }
  const clamped = Math.max(1, Math.min(10, Math.round(score)))
  return colorMap[clamped] ?? COLORS.mood5
}

/**
 * Calculate mood trend using simple linear regression slope.
 * Requires at least 3 data points for meaningful analysis.
 */
export const calculateTrend = (
  scores: readonly number[]
): 'improving' | 'stable' | 'fluctuating' => {
  if (scores.length < 3) return 'stable'

  const n = scores.length

  // Simple linear regression: y = mx + b
  const sumX = scores.reduce((acc, _, i) => acc + i, 0)
  const sumY = scores.reduce((acc, s) => acc + s, 0)
  const sumXY = scores.reduce((acc, s, i) => acc + i * s, 0)
  const sumX2 = scores.reduce((acc, _, i) => acc + i * i, 0)

  const denominator = n * sumX2 - sumX * sumX
  if (denominator === 0) return 'stable'

  const slope = (n * sumXY - sumX * sumY) / denominator

  // Calculate variance to detect fluctuation
  const mean = sumY / n
  const variance = scores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / n
  const stdDev = Math.sqrt(variance)

  // High variance relative to the scale indicates fluctuation
  if (stdDev > 2.0) return 'fluctuating'

  // Slope thresholds for trend detection
  if (slope > 0.15) return 'improving'
  if (slope < -0.15) return 'fluctuating'

  return 'stable'
}
