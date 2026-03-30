import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Component ─────────────────────────────────────────────────────

const TearAnimation = React.memo(function TearAnimation() {
  const leftX = useSharedValue(0)
  const rightX = useSharedValue(0)
  const leftRotate = useSharedValue(0)
  const rightRotate = useSharedValue(0)
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    leftX.value = withDelay(200, withTiming(-120, { duration: 800 }))
    rightX.value = withDelay(200, withTiming(120, { duration: 800 }))
    leftRotate.value = withDelay(200, withTiming(-15, { duration: 800 }))
    rightRotate.value = withDelay(200, withTiming(15, { duration: 800 }))
    opacity.value = withDelay(600, withTiming(0, { duration: 600 }))
  }, [leftX, rightX, leftRotate, rightRotate, opacity])

  const leftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: leftX.value },
      { rotate: `${leftRotate.value}deg` },
    ],
    opacity: opacity.value,
  }))

  const rightStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: rightX.value },
      { rotate: `${rightRotate.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return (
    <View style={styles.tearContainer}>
      <Animated.View style={[styles.tearHalf, styles.tearLeft, leftStyle]}>
        <Text style={styles.tearText}>付出清算单</Text>
      </Animated.View>
      <Animated.View style={[styles.tearHalf, styles.tearRight, rightStyle]}>
        <Text style={styles.tearText}>已结清</Text>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tearContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  tearHalf: {
    width: '40%',
    height: 60,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  tearLeft: {
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
  },
  tearRight: {
    borderTopRightRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },
  tearText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
})

export default TearAnimation
