import React, { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import { ELEMENTS } from './Day28FarewellConstants'

// ─── Props ─────────────────────────────────────────────────────────

interface ReleaseAnimationProps {
  readonly element: string
  readonly onFinish: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day28ReleaseAnimation = React.memo(function Day28ReleaseAnimation({
  element,
  onFinish,
}: ReleaseAnimationProps) {
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  const rotation = useSharedValue(0)

  // Stabilize onFinish ref to prevent timer restart on parent re-render
  const onFinishRef = useRef(onFinish)
  React.useEffect(() => { onFinishRef.current = onFinish }, [onFinish])

  React.useEffect(() => {
    const duration = 2000

    switch (element) {
      case 'water':
        // Flow down
        translateY.value = withTiming(300, { duration, easing: Easing.in(Easing.cubic) })
        opacity.value = withDelay(1200, withTiming(0, { duration: 800 }))
        break
      case 'fire':
        // Burn and dissipate
        scale.value = withSequence(
          withTiming(1.3, { duration: 600 }),
          withTiming(0, { duration: 1400, easing: Easing.in(Easing.cubic) })
        )
        opacity.value = withDelay(800, withTiming(0, { duration: 1200 }))
        break
      case 'earth':
        // Sink into ground
        translateY.value = withTiming(200, { duration, easing: Easing.in(Easing.quad) })
        scale.value = withDelay(800, withTiming(0.3, { duration: 1200 }))
        opacity.value = withDelay(1400, withTiming(0, { duration: 600 }))
        break
      case 'wind':
        // Drift away
        translateX.value = withTiming(200, { duration, easing: Easing.out(Easing.cubic) })
        translateY.value = withTiming(-100, { duration })
        rotation.value = withTiming(360, { duration })
        opacity.value = withDelay(800, withTiming(0, { duration: 1200 }))
        break
    }

    const timer = setTimeout(() => {
      onFinishRef.current()
    }, duration + 500)

    return () => clearTimeout(timer)
  }, [element, translateY, translateX, scale, opacity, rotation])

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }))

  const elementInfo = ELEMENTS.find((e) => e.id === element)

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.item, animStyle]}>
        <Text style={styles.emoji}>{elementInfo?.emoji ?? '🌊'}</Text>
      </Animated.View>
      <Text style={styles.label}>释放中…</Text>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginBottom: SPACING['3xl'],
  },
  emoji: {
    fontSize: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
})

export default Day28ReleaseAnimation
