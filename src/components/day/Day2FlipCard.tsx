import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
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
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '../ui/ZenButton'
import ConfettiParticle from './Day2ConfettiParticle'

// ─── Constants ────────────────────────────────────────────────────

const CONFETTI_ICONS = ['star', 'sun', 'zap', 'heart'] as const
const CONFETTI_COUNT = 8
const FLIP_DURATION = 500

// ─── Types ────────────────────────────────────────────────────────

export interface TaskItem {
  readonly id: number
  readonly title: string
  readonly icon: string
  readonly provider?: 'Feather' | 'Ionicons'
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

  const handlePress = useCallback(() => {
    if (flipped) return
    onFlip()
  }, [flipped, onFlip])

  const renderIcon = () => {
    const IconComponent = task.provider === 'Ionicons' ? Ionicons : Feather
    return <IconComponent name={task.icon as any} size={28} color={COLORS.primary} />
  }

  return (
    <Animated.View entering={SlideInDown.delay(index * 150).duration(500)}>
      <ZenButton
        onPress={handlePress}
        disabled={flipped}
        variant="ghost"
        style={styles.flipCardContainer}
      >
        {/* Front face */}
        <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
          <View style={styles.iconContainer}>
            {renderIcon()}
          </View>
          <Text style={styles.cardTitle}>{task.title}</Text>
        </Animated.View>

        {/* Back face */}
        <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
          <Feather name="check-circle" size={32} color={COLORS.success} />
          <Text style={styles.cardDoneText}>完成！</Text>
        </Animated.View>

        {/* Confetti layer */}
        {showConfetti && (
          <View style={styles.confettiContainer}>
            {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
              <ConfettiParticle
                key={i}
                index={i}
                icon={CONFETTI_ICONS[i % CONFETTI_ICONS.length]}
              />
            ))}
          </View>
        )}
      </ZenButton>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flipCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: 'transparent',
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
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
