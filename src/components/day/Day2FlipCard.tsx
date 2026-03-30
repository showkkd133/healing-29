import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, {
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import ConfettiParticle from './Day2ConfettiParticle'

// ─── Constants ────────────────────────────────────────────────────

const CONFETTI_EMOJIS = ['🎉', '✨', '💫', '🌟', '🎊', '⭐'] as const
const CONFETTI_COUNT = 8
const FLIP_DURATION = 500

// ─── Types ────────────────────────────────────────────────────────

export interface TaskItem {
  readonly id: number
  readonly title: string
  readonly icon: string
}

// ─── Props ────────────────────────────────────────────────────────

interface FlipCardProps {
  readonly task: TaskItem
  readonly flipped: boolean
  readonly onFlip: () => void
  readonly index: number
}

// ─── Component ────────────────────────────────────────────────────

const FlipCard = React.memo(function FlipCard({
  task,
  flipped,
  onFlip,
  index,
}: FlipCardProps) {
  const rotation = useSharedValue(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    rotation.value = withTiming(flipped ? 180 : 0, {
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.ease),
    })
    if (flipped) {
      setShowConfetti(true)
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [flipped, rotation])

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
    }
  })

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360])
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
    }
  })

  const handlePress = useCallback(async () => {
    if (flipped) return
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
    onFlip()
  }, [flipped, onFlip])

  return (
    <Animated.View entering={SlideInDown.delay(index * 150).duration(500)}>
      <TouchableOpacity
        style={styles.flipCardContainer}
        onPress={handlePress}
        activeOpacity={0.95}
        disabled={flipped}
      >
        {/* Front face */}
        <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
          <Text style={styles.cardIcon}>{task.icon}</Text>
          <Text style={styles.cardTitle}>{task.title}</Text>
        </Animated.View>

        {/* Back face */}
        <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
          <Text style={styles.checkMark}>✓</Text>
          <Text style={styles.cardDoneText}>完成！</Text>
        </Animated.View>

        {/* Confetti layer */}
        {showConfetti && (
          <View style={styles.confettiContainer}>
            {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
              <ConfettiParticle
                key={i}
                index={i}
                emoji={CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flipCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  cardFront: {
    backgroundColor: COLORS.card,
  },
  cardBack: {
    backgroundColor: COLORS.secondary,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  checkMark: {
    fontSize: 32,
    color: COLORS.success,
    fontWeight: '700',
  },
  cardDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
})

export default FlipCard
