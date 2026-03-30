import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'

interface Day18TriggerListProps {
  readonly triggers: readonly string[]
}

// List of recorded slip triggers during the silence session
const Day18TriggerList = React.memo(function Day18TriggerList({
  triggers,
}: Day18TriggerListProps) {
  if (triggers.length === 0) {
    return null
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.triggerList}>
      {triggers.map((trigger, index) => (
        <View key={index} style={styles.triggerItem}>
          <Text style={styles.triggerBullet}>#{index + 1}</Text>
          <Text style={styles.triggerText}>{trigger}</Text>
        </View>
      ))}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  triggerList: {
    marginBottom: SPACING.xl,
  },
  triggerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  triggerBullet: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginRight: SPACING.sm,
    width: 24,
  },
  triggerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
})

export default Day18TriggerList
