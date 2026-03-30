import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface BalanceScaleProps {
  readonly leftCount: number
  readonly rightCount: number
}

// ─── Component ─────────────────────────────────────────────────────

const BalanceScale = React.memo(function BalanceScale({
  leftCount,
  rightCount,
}: BalanceScaleProps) {
  const tilt = useSharedValue(0)

  React.useEffect(() => {
    const diff = leftCount - rightCount
    const clampedTilt = Math.max(-15, Math.min(15, diff * 3))
    tilt.value = withTiming(clampedTilt, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    })
  }, [leftCount, rightCount, tilt])

  const beamStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tilt.value}deg` }],
  }))

  return (
    <View style={styles.scaleContainer}>
      <View style={styles.scalePillar} />
      <Animated.View style={[styles.scaleBeam, beamStyle]}>
        <View style={styles.scalePan}>
          <Text style={styles.scalePanCount}>{leftCount}</Text>
          <Text style={styles.scalePanLabel}>付出</Text>
        </View>
        <View style={styles.scalePan}>
          <Text style={styles.scalePanCount}>{rightCount}</Text>
          <Text style={styles.scalePanLabel}>收获</Text>
        </View>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scaleContainer: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    height: 120,
  },
  scalePillar: {
    width: 4,
    height: 40,
    backgroundColor: COLORS.textSecondary,
    borderRadius: 2,
  },
  scaleBeam: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '80%',
    height: 60,
    borderTopWidth: 3,
    borderTopColor: COLORS.textSecondary,
  },
  scalePan: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
  },
  scalePanCount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  scalePanLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING['2xs'],
  },
})

export default BalanceScale
