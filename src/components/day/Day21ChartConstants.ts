// Shared constants and helpers for the Day21 mood curve chart

export const CHART_WIDTH = 320
export const CHART_HEIGHT = 200
export const CHART_PADDING_LEFT = 30
export const CHART_PADDING_RIGHT = 10
export const CHART_PADDING_TOP = 10
export const CHART_PADDING_BOTTOM = 25
export const PLOT_WIDTH = CHART_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT
export const PLOT_HEIGHT = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM

export const TIME_START = 6
export const TIME_END = 23
export const TIME_RANGE = TIME_END - TIME_START

// Normal fluctuation band (score 4-7)
export const NORMAL_LOW = 4
export const NORMAL_HIGH = 7

export interface MoodPoint {
  readonly id: string
  readonly hour: number
  readonly score: number
  readonly trigger: string
}

export const hourToX = (hour: number): number =>
  CHART_PADDING_LEFT + ((hour - TIME_START) / TIME_RANGE) * PLOT_WIDTH

export const scoreToY = (score: number): number =>
  CHART_PADDING_TOP + ((10 - score) / 10) * PLOT_HEIGHT

export const formatHour = (hour: number): string =>
  `${String(hour).padStart(2, '0')}:00`
