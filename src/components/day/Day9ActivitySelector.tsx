import React, { useCallback } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInUp,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ACTIVITIES } from './Day9Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day9ActivitySelectorProps {
  readonly onSelect: (id: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day9ActivitySelector = React.memo(function Day9ActivitySelector({
  onSelect,
}: Day9ActivitySelectorProps) {
  const handleSelect = useCallback(async (id: string) => {
    onSelect(id)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [onSelect])

  return (
    <>
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.guidanceText}>
        选一种让身体先快乐的方式
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.activityGrid}>
        {ACTIVITIES.map((activity, index) => (
          <Animated.View
            key={activity.id}
            entering={SlideInUp.delay(600 + index * 100).duration(400)}
          >
            <TouchableOpacity
              style={styles.activityCard}
              onPress={() => handleSelect(activity.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <Text style={styles.activityLabel}>{activity.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>
    </>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['3xl'],
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  activityCard: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  activityIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
})

export default Day9ActivitySelector
