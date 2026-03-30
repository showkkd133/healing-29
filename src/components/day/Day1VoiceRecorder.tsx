import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated'
import { COLORS, SPACING, SHADOWS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const BAR_COUNT = 12
const MAX_RECORDING_MS = 3 * 60 * 1000

// ─── Timer formatting ──────────────────────────────────────────────

const formatTimer = (ms: number): string => {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// ─── WaveBar ───────────────────────────────────────────────────────

interface WaveBarProps {
  readonly index: number
  readonly active: boolean
}

const WaveBar = React.memo(function WaveBar({ index, active }: WaveBarProps) {
  const height = useSharedValue(8)

  useEffect(() => {
    if (active) {
      // Each bar animates with a slight offset for wave effect
      const baseDelay = index * 80
      height.value = withRepeat(
        withSequence(
          withTiming(8 + Math.random() * 32, {
            duration: 300 + baseDelay,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(8, {
            duration: 300 + baseDelay,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      )
    } else {
      cancelAnimation(height)
      height.value = withTiming(8, { duration: 200 })
    }
  }, [active, height, index])

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return (
    <Animated.View
      style={[
        styles.waveBar,
        active ? styles.waveBarActive : styles.waveBarIdle,
        animatedStyle,
      ]}
    />
  )
})

// ─── Props ─────────────────────────────────────────────────────────

interface Day1VoiceRecorderProps {
  readonly isRecording: boolean
  readonly elapsedMs: number
  readonly onRecordPress: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day1VoiceRecorder = React.memo(function Day1VoiceRecorder({
  isRecording,
  elapsedMs,
  onRecordPress,
}: Day1VoiceRecorderProps) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.voiceContainer}>
      {/* Waveform */}
      <View style={styles.waveformRow}>
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <WaveBar key={i} index={i} active={isRecording} />
        ))}
      </View>

      {/* Timer */}
      <Text style={styles.timerText}>
        {formatTimer(elapsedMs)} / {formatTimer(MAX_RECORDING_MS)}
      </Text>

      {/* Record button */}
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
        onPress={onRecordPress}
        activeOpacity={0.8}
      >
        <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
      </TouchableOpacity>

      <Text style={styles.recordHint}>
        {isRecording ? '再次点击停止录音' : '点击开始录音'}
      </Text>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  voiceContainer: {
    alignItems: 'center',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
    marginBottom: SPACING.xl,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  waveBarIdle: {
    backgroundColor: COLORS.border,
  },
  waveBarActive: {
    backgroundColor: COLORS.primary,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textSecondary,
    marginBottom: SPACING['3xl'],
  },
  recordButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  recordButtonActive: {
    backgroundColor: '#F9E0E0',
  },
  recordInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
  },
  recordInnerActive: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E05858',
  },
  recordHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },
})

export default Day1VoiceRecorder
