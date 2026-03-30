import React, { useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ────────────────────────────────────────────────────────

interface GiftBoxProps {
  readonly onOpen: () => void
}

// ─── Component ────────────────────────────────────────────────────

const GiftBox = React.memo(function GiftBox({ onOpen }: GiftBoxProps) {
  const shakeX = useSharedValue(0)

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }))

  // Start shake animation on mount, cancel on unmount
  useEffect(() => {
    shakeX.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        withTiming(6, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        withTiming(-4, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(4, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 60 })
      ),
      -1,
      false
    )
    return () => {
      cancelAnimation(shakeX)
    }
  }, [shakeX])

  const handleOpen = useCallback(async () => {
    cancelAnimation(shakeX)
    shakeX.value = 0

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch {
      // Haptics not available
    }
    onOpen()
  }, [shakeX, onOpen])

  return (
    <View style={styles.giftArea}>
      <Animated.View style={shakeStyle}>
        <Text style={styles.giftEmoji}>🎁</Text>
      </Animated.View>

      <Animated.Text entering={FadeIn.delay(500).duration(600)} style={styles.giftHint}>
        今天送自己一个盲盒
      </Animated.Text>

      <Animated.View entering={FadeIn.delay(800).duration(400)}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={handleOpen}
          activeOpacity={0.8}
        >
          <Text style={styles.openButtonText}>拆开盲盒</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  giftArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftEmoji: {
    fontSize: 100,
    marginBottom: SPACING['2xl'],
  },
  giftHint: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING['3xl'],
  },
  openButton: {
    paddingVertical: 16,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.accent,
    ...SHADOWS.md,
  },
  openButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
})

export default GiftBox
