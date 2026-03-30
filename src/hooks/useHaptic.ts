// NOTE: Not currently imported by any component — candidate for integration or removal
//
// Haptic feedback hook wrapping expo-haptics

import { useCallback } from 'react'
import * as Haptics from 'expo-haptics'

interface UseHaptic {
  readonly light: () => void
  readonly medium: () => void
  readonly heavy: () => void
  readonly success: () => void
  readonly error: () => void
}

/**
 * Fire-and-forget haptic feedback. Errors are silently caught
 * so haptics never break the UI flow.
 */
const safeHaptic = (fn: () => Promise<void>): void => {
  fn().catch(() => {})
}

export const useHaptic = (): UseHaptic => {
  const light = useCallback(() => {
    safeHaptic(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    )
  }, [])

  const medium = useCallback(() => {
    safeHaptic(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    )
  }, [])

  const heavy = useCallback(() => {
    safeHaptic(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    )
  }, [])

  const success = useCallback(() => {
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    )
  }, [])

  const error = useCallback(() => {
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    )
  }, [])

  return { light, medium, heavy, success, error } as const
}
