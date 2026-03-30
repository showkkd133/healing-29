// NOTE: Not currently imported by any component — candidate for integration or removal
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme'

interface EmotionBadgeProps {
  name: string
  icon: string
  unlocked: boolean
  onPress?: () => void
}

// Circular badge with icon and name, supports locked/unlocked states
const EmotionBadge = React.memo(function EmotionBadge({
  name,
  icon,
  unlocked,
  onPress,
}: EmotionBadgeProps) {
  const content = (
    <View style={styles.wrapper}>
      <View style={[styles.circle, unlocked ? styles.unlocked : styles.locked]}>
        <Text style={[styles.icon, !unlocked && styles.iconLocked]}>
          {unlocked ? icon : '🔒'}
        </Text>
      </View>
      <Text
        style={[styles.name, !unlocked && styles.nameLocked]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  )

  if (onPress && unlocked) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    )
  }

  return content
})

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 72,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  unlocked: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  locked: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
  },
  icon: {
    fontSize: 24,
  },
  iconLocked: {
    opacity: 0.5,
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  nameLocked: {
    color: COLORS.textSecondary,
  },
})

export default EmotionBadge
