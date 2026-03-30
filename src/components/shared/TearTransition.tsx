import React, { useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import { IconCheck } from '@/components/icons'
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme'

interface TearTransitionProps {
  readonly visible: boolean
  readonly dayNumber: number
  readonly onComplete: () => void
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')
const HALF_H = SCREEN_H / 2
const TEAR_DURATION = 600
const LINGER_DELAY = 500

// Generate a jagged tear-edge SVG path across the screen width
function buildTearEdge(): string {
  const teeth = 24
  const step = SCREEN_W / teeth
  const amp = 6
  let d = `M0,0`
  for (let i = 0; i < teeth; i++) {
    const x1 = i * step + step / 2
    const x2 = (i + 1) * step
    d += ` L${x1},${i % 2 === 0 ? amp : -amp} L${x2},0`
  }
  return d
}

const TEAR_PATH = buildTearEdge()

// Full-screen "tear calendar page" transition overlay
const TearTransition = React.memo(function TearTransition({
  visible,
  dayNumber,
  onComplete,
}: TearTransitionProps) {
  const tearProgress = useSharedValue(0)
  const doneOpacity = useSharedValue(0)

  const fireComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    if (!visible) return

    // Phase 1: tear the top half away
    tearProgress.value = withTiming(1, {
      duration: TEAR_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    })

    // Phase 2: fade in completion text
    doneOpacity.value = withDelay(
      TEAR_DURATION,
      withTiming(1, { duration: 300 }),
    )

    // Schedule completion callback after all animations finish
    const timer = setTimeout(() => {
      fireComplete()
    }, TEAR_DURATION + 300 + LINGER_DELAY)

    return () => clearTimeout(timer)
  }, [visible, tearProgress, doneOpacity, fireComplete])

  // Upper half: rotates upward and fades out
  const topHalfStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${interpolate(tearProgress.value, [0, 1], [0, -90])}deg` },
      { translateY: interpolate(tearProgress.value, [0, 1], [0, -100]) },
    ],
    opacity: interpolate(tearProgress.value, [0, 0.8, 1], [1, 0.5, 0]),
  }))

  // Completion badge that fades in after the tear
  const doneStyle = useAnimatedStyle(() => ({
    opacity: doneOpacity.value,
    transform: [
      { scale: interpolate(doneOpacity.value, [0, 1], [0.85, 1]) },
    ],
  }))

  if (!visible) return null

  return (
    <View style={styles.overlay}>
      {/* Bottom layer: completion message */}
      <View style={styles.bottomLayer}>
        <Animated.View style={[styles.doneContainer, doneStyle]}>
          <View style={styles.checkCircle}>
            <IconCheck size={32} color={COLORS.success} />
          </View>
          <Text style={styles.doneText}>Day {dayNumber} 完成</Text>
        </Animated.View>
      </View>

      {/* Top half: tears away */}
      <Animated.View style={[styles.topHalf, topHalfStyle]}>
        <View style={styles.topContent} />
        {/* Jagged tear edge at the bottom of the top half */}
        <Svg
          width={SCREEN_W}
          height={12}
          style={styles.tearEdge}
          viewBox={`0 -6 ${SCREEN_W} 12`}
        >
          <Path d={TEAR_PATH} fill={COLORS.background} />
        </Svg>
      </Animated.View>
    </View>
  )
})

const CENTER = { alignItems: 'center', justifyContent: 'center' } as const

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  bottomLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.background, ...CENTER },
  topHalf: {
    position: 'absolute', top: 0, left: 0,
    width: SCREEN_W, height: HALF_H, overflow: 'visible',
  },
  topContent: { flex: 1, backgroundColor: COLORS.background },
  tearEdge: { position: 'absolute', bottom: -6, left: 0 },
  doneContainer: { alignItems: 'center', gap: SPACING.lg },
  checkCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#E8F5E9', ...CENTER,
  },
  doneText: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
})

export default TearTransition
