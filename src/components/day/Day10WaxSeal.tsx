import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { SPACING, SHADOWS } from '@/constants/theme'

// ─── Wax Seal animation component ─────────────────────────────────

const WaxSeal = React.memo(function WaxSeal() {
  const scale = useSharedValue(0)
  const stampScale = useSharedValue(0)
  const stampOpacity = useSharedValue(0)

  React.useEffect(() => {
    // Seal grows from center
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
    })
    // Stamp appears after seal
    stampScale.value = withDelay(
      400,
      withSequence(
        withTiming(1.3, { duration: 150, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) })
      )
    )
    stampOpacity.value = withDelay(400, withTiming(1, { duration: 150 }))
  }, [scale, stampScale, stampOpacity])

  const sealStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stampScale.value }],
    opacity: stampOpacity.value,
  }))

  return (
    <View style={sealStyles.container}>
      <Animated.View style={[sealStyles.seal, sealStyle]}>
        <Animated.Text style={[sealStyles.stampText, stampStyle]}>封</Animated.Text>
      </Animated.View>
    </View>
  )
})

export const sealStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING['3xl'],
  },
  seal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  stampText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5E6CC',
  },
})

export default WaxSeal
