import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface ConfettiParticleProps {
  readonly icon: keyof typeof Feather.glyphMap
  readonly index: number
}

// ─── Component ────────────────────────────────────────────────────

const ConfettiParticle = React.memo(function ConfettiParticle({
  icon,
  index,
}: ConfettiParticleProps) {
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)
  const rotation = useSharedValue(0)

  useEffect(() => {
    const direction = index % 2 === 0 ? 1 : -1
    const spread = 30 + Math.random() * 60

    translateY.value = withSequence(
      withTiming(-120 - Math.random() * 80, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withTiming(40, { duration: 400, easing: Easing.in(Easing.cubic) })
    )
    translateX.value = withTiming(direction * spread, { duration: 1000 })
    rotation.value = withTiming(360 * (Math.random() > 0.5 ? 1 : -1), { duration: 1000 })
    opacity.value = withDelay(600, withTiming(0, { duration: 400 }))
  }, [index, translateY, translateX, opacity, rotation])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[styles.confetti, style]}>
      <Feather name={icon} size={20} color={COLORS.accent} />
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
  },
})

export default ConfettiParticle
