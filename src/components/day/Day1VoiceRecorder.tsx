import React, { useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated'
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '@/constants/theme'
import { useHaptic } from '@/hooks/useHaptic'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const haptic = useHaptic();
  const scale = useSharedValue(1);
  const innerRadius = useSharedValue(isRecording ? 8 : 20);
  const innerSize = useSharedValue(isRecording ? 32 : 40);
  const buttonBg = useSharedValue(isRecording ? '#FFF0F0' : COLORS.secondaryLight);
  const innerBg = useSharedValue(isRecording ? '#E05858' : COLORS.primary);

  useEffect(() => {
    innerRadius.value = withSpring(isRecording ? 8 : 20);
    innerSize.value = withSpring(isRecording ? 32 : 40);
    buttonBg.value = withTiming(isRecording ? '#FFF0F0' : COLORS.secondaryLight, { duration: 300 });
    innerBg.value = withTiming(isRecording ? '#E05858' : COLORS.primary, { duration: 300 });
  }, [isRecording]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: buttonBg.value,
  }));

  const animatedInnerStyle = useAnimatedStyle(() => ({
    width: innerSize.value,
    height: innerSize.value,
    borderRadius: innerRadius.value,
    backgroundColor: innerBg.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
    haptic.medium();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

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
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onRecordPress}
        style={[styles.recordButton, animatedButtonStyle]}
      >
        <Animated.View style={animatedInnerStyle} />
      </AnimatedPressable>

      <Text style={styles.recordHint}>
        {isRecording ? '点击停止录音' : '点击开始录音'}
      </Text>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  voiceContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 6,
    marginBottom: SPACING.xl,
  },
  waveBar: {
    width: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  waveBarIdle: {
    backgroundColor: COLORS.border,
  },
  waveBarActive: {
    backgroundColor: COLORS.primary,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING['3xl'],
    fontVariant: ['tabular-nums'],
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
    borderWidth: 4,
    borderColor: COLORS.card,
  },
  recordHint: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginTop: SPACING.xl,
    fontWeight: '500',
  },
})

export default Day1VoiceRecorder
