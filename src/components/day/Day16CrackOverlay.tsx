import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated'
import { COLORS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface CrackOverlayProps {
  readonly visible: boolean
  readonly index: number
}

// ─── Component ─────────────────────────────────────────────────────

const CrackOverlay = React.memo(function CrackOverlay({ visible, index }: CrackOverlayProps) {
  const opacity = useSharedValue(0)

  React.useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withDelay(index * 200, withTiming(0.6, { duration: 300 })),
        withTiming(0.15, { duration: 500 })
      )
    } else {
      // Reset opacity when no longer visible
      opacity.value = withTiming(0, { duration: 200 })
    }
  }, [visible, index, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  if (!visible) return null

  return (
    <Animated.View
      style={[styles.crackOverlay, animatedStyle]}
      pointerEvents="none"
    >
      <View style={[styles.crackLine, { transform: [{ rotate: `${-30 + index * 25}deg` }] }]} />
      <View style={[styles.crackLine, { transform: [{ rotate: `${15 + index * 20}deg` }], left: '30%' }]} />
      <View style={[styles.crackLine, { transform: [{ rotate: `${-10 + index * 15}deg` }], left: '60%' }]} />
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  crackOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  crackLine: {
    position: 'absolute',
    top: '20%',
    left: '40%',
    width: 2,
    height: '60%',
    backgroundColor: COLORS.border,
  },
})

export default CrackOverlay
