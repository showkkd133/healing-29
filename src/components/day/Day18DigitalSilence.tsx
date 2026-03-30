import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'
import Day18ConfirmScreen from './Day18ConfirmScreen'
import Day18CompletedScreen from './Day18CompletedScreen'
import Day18SilenceTimer from './Day18SilenceTimer'
import Day18SlipModal from './Day18SlipModal'
import Day18RulesSection from './Day18RulesSection'
import Day18TriggerList from './Day18TriggerList'

// ─── Props ─────────────────────────────────────────────────────────

interface Day18DigitalSilenceProps {
  readonly onComplete: (data: {
    readonly silenceDuration: number
    readonly slipTimes: number
    readonly triggers: string[]
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day18DigitalSilence = React.memo(function Day18DigitalSilence({
  onComplete,
}: Day18DigitalSilenceProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [slipTimes, setSlipTimes] = useState(0)
  const [triggers, setTriggers] = useState<readonly string[]>([])
  const [showSlipModal, setShowSlipModal] = useState(false)
  const [slipTrigger, setSlipTrigger] = useState('')
  const [completed, setCompleted] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Timer ──────────────────────────────────────────────────────

  useEffect(() => {
    if (confirmed && !completed) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [confirmed, completed])

  // ─── Handlers ───────────────────────────────────────────────────

  const handleConfirm = useCallback(async () => {
    setConfirmed(true)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleSlipPress = useCallback(() => {
    setShowSlipModal(true)
  }, [])

  const handleSlipCancel = useCallback(() => {
    setSlipTrigger('')
    setShowSlipModal(false)
  }, [])

  const handleSlipSubmit = useCallback(async () => {
    if (!slipTrigger.trim()) {
      setShowSlipModal(false)
      return
    }
    setSlipTimes((prev) => prev + 1)
    setTriggers((prev) => [...prev, slipTrigger.trim()])
    setSlipTrigger('')
    setShowSlipModal(false)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [slipTrigger])

  const handleEmergencyCall = useCallback(() => {
    Linking.openURL('tel:')
  }, [])

  const handleComplete = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCompleted(true)
    onComplete({
      silenceDuration: elapsedSeconds,
      slipTimes,
      triggers: [...triggers],
    })
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
  }, [elapsedSeconds, slipTimes, triggers, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return <Day18CompletedScreen />
  }

  // ─── Render: confirmation screen ─────────────────────────────────

  if (!confirmed) {
    return <Day18ConfirmScreen onConfirm={handleConfirm} />
  }

  // ─── Render: main silence session ────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Day18RulesSection />
      <Day18SilenceTimer elapsedSeconds={elapsedSeconds} />

      {/* Slip counter */}
      <Animated.View entering={FadeIn.delay(1100).duration(400)} style={styles.slipSection}>
        <Text style={styles.slipCount}>破戒次数：{slipTimes}</Text>
        <TouchableOpacity
          style={styles.slipButton}
          onPress={handleSlipPress}
          activeOpacity={0.7}
        >
          <Text style={styles.slipButtonText}>记录破戒</Text>
        </TouchableOpacity>
      </Animated.View>

      <Day18TriggerList triggers={triggers} />

      {/* Emergency contact */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyCall}
        activeOpacity={0.7}
      >
        <Text style={styles.emergencyButtonText}>📞 紧急联系人</Text>
      </TouchableOpacity>

      {/* Complete */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>结束静默</Text>
      </TouchableOpacity>

      <Day18SlipModal
        visible={showSlipModal}
        value={slipTrigger}
        onChangeText={setSlipTrigger}
        onCancel={handleSlipCancel}
        onSubmit={handleSlipSubmit}
      />
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  slipSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  slipCount: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  slipButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  emergencyButton: {
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emergencyButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day18DigitalSilence
