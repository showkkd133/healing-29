// NOTE: Not currently imported by any component — candidate for integration or removal
// app/day/[id].tsx calls getDayConfig() directly and computes isLocked inline.
// This hook adds memoized stage info (stageName, stageColor), isUnlocked, icon, and estimatedMinutes
// on top of the raw config — useful if [id].tsx ever needs those derived values.
//
// Hook for retrieving day-specific configuration with stage info

import { useMemo } from 'react'
import type { DayNumber } from '@/types'
import { getDayConfig as getConfig } from '@/constants/days'
import { getStageByDay } from '@/constants/stages'

export interface DayConfig {
  readonly dayNumber: DayNumber
  readonly theme: string
  readonly title: string
  readonly guidanceText: string
  readonly stageName: string
  readonly stageColor: string
  readonly isUnlocked: boolean
  readonly icon: string
  readonly estimatedMinutes: number
}

export const useDayConfig = (
  dayNumber: DayNumber,
  currentDay: DayNumber = 1 as DayNumber
): DayConfig => {
  return useMemo(() => {
    const config = getConfig(dayNumber)
    const stage = getStageByDay(dayNumber)

    return {
      dayNumber,
      theme: config?.theme ?? '',
      title: config?.subtitle ?? '',
      guidanceText: config?.guidanceText ?? '',
      stageName: stage?.name ?? '',
      stageColor: stage?.color ?? '',
      isUnlocked: dayNumber <= currentDay,
      icon: config?.icon ?? '',
      estimatedMinutes: config?.estimatedMinutes ?? 10,
    }
  }, [dayNumber, currentDay])
}
