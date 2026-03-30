import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { TRIGGER_TYPES, type TriggerEntry } from './Day22Constants'

// ─── Props ────────────────────────────────────────────────────────

interface Day22TriggerCardProps {
  readonly trigger: TriggerEntry
  readonly index: number
}

// ─── Component ────────────────────────────────────────────────────

const Day22TriggerCard = React.memo(function Day22TriggerCard({
  trigger,
  index,
}: Day22TriggerCardProps) {
  const typeInfo = TRIGGER_TYPES.find((t) => t.id === trigger.type)
  // Deeper opacity = higher effectiveness (more intense)
  const intensity = 0.3 + trigger.effectiveness * 0.14

  return (
    <Animated.View
      entering={SlideInDown.delay(index * 100).duration(300)}
      style={[
        styles.triggerCard,
        { backgroundColor: `rgba(124, 156, 180, ${intensity})` },
      ]}
    >
      <Text style={styles.triggerCardEmoji}>{typeInfo?.emoji ?? '?'}</Text>
      <View style={styles.triggerCardInfo}>
        <Text style={styles.triggerCardName}>{trigger.name}</Text>
        <Text style={styles.triggerCardMeta}>
          {'★'.repeat(trigger.effectiveness)}{'☆'.repeat(5 - trigger.effectiveness)}
        </Text>
      </View>
    </Animated.View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  triggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  triggerCardEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  triggerCardInfo: {
    flex: 1,
  },
  triggerCardName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.card,
  },
  triggerCardMeta: {
    fontSize: 13,
    color: COLORS.card,
    marginTop: SPACING.xs,
  },
})

export default Day22TriggerCard
