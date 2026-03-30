import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Types ────────────────────────────────────────────────────────

export interface LocationInfo {
  readonly name: string
  readonly distance: string
  readonly funFact: string
}

interface RatingOption {
  readonly key: string
  readonly emoji: string
  readonly label: string
}

// ─── Constants ────────────────────────────────────────────────────

const RATINGS: readonly RatingOption[] = [
  { key: 'surprise', emoji: '😊', label: '惊喜' },
  { key: 'neutral', emoji: '😐', label: '一般' },
  { key: 'disappointed', emoji: '😔', label: '失望' },
] as const

// ─── Props ────────────────────────────────────────────────────────

interface LocationRevealProps {
  readonly location: LocationInfo
  readonly onComplete: (rating: string) => void
}

// ─── Component ────────────────────────────────────────────────────

const LocationReveal = React.memo(function LocationReveal({
  location,
  onComplete,
}: LocationRevealProps) {
  const [selectedRating, setSelectedRating] = useState<string | null>(null)

  const handleRate = useCallback(async (rating: string) => {
    setSelectedRating(rating)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(() => {
    if (!selectedRating) return
    onComplete(selectedRating)
  }, [selectedRating, onComplete])

  return (
    <>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.locationCard}>
        <Text style={styles.locationEmoji}>📍</Text>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationDistance}>{location.distance}</Text>
        <View style={styles.funFactContainer}>
          <Text style={styles.funFactLabel}>冷知识</Text>
          <Text style={styles.funFactText}>{location.funFact}</Text>
        </View>
      </Animated.View>

      {/* Rating section */}
      <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>体验评分</Text>
        <View style={styles.ratingRow}>
          {RATINGS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.ratingButton,
                selectedRating === option.key && styles.ratingButtonActive,
              ]}
              onPress={() => handleRate(option.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.ratingEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.ratingLabel,
                  selectedRating === option.key && styles.ratingLabelActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disappointed message */}
        {selectedRating === 'disappointed' && (
          <Animated.Text entering={FadeIn.duration(400)} style={styles.disappointedText}>
            失望也是体验的一部分
          </Animated.Text>
        )}
      </Animated.View>

      {/* Complete button */}
      {selectedRating && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.completeSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>完成</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING['2xl'],
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
  },
  locationEmoji: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  locationName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  locationDistance: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  funFactContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    width: '100%',
  },
  funFactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  funFactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  ratingButton: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
    ...SHADOWS.sm,
  },
  ratingButtonActive: {
    borderColor: COLORS.primary,
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  ratingLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  ratingLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disappointedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.lg,
  },
  completeSection: {
    alignItems: 'center',
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default LocationReveal
