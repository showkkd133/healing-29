// NOTE: Not currently imported by any component — candidate for integration or removal
import React, { useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import { COLORS } from '../../constants/theme'

interface CardFlipProps {
  front: React.ReactNode
  back: React.ReactNode
  flipped: boolean
  onFlip: () => void
}

const FLIP_DURATION = 500

// Flippable card with front/back content and 3D rotation animation
const CardFlip = React.memo(function CardFlip({
  front,
  back,
  flipped,
  onFlip,
}: CardFlipProps) {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withTiming(flipped ? 180 : 0, {
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.ease),
    })
  }, [flipped, rotation])

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
    }
  })

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
    }
  })

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onFlip}
      activeOpacity={0.95}
    >
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        {front}
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        {back}
      </Animated.View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    minHeight: 200,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
  },
})

export default CardFlip
