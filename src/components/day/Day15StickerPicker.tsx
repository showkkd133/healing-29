import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { CUTE_STICKERS } from './Day15Constants'

// ─── Sticker picker for the "bestie" ritual ───────────────────────

interface StickerPickerProps {
  readonly visible: boolean
  readonly onSelect: (sticker: string) => void
}

const Day15StickerPicker = React.memo(function Day15StickerPicker({
  visible,
  onSelect,
}: StickerPickerProps) {
  if (!visible) return null

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.hint}>选一个发给闺蜜</Text>
      <View style={styles.grid}>
        {CUTE_STICKERS.map((sticker, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => onSelect(sticker)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{sticker}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  hint: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  item: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  emoji: {
    fontSize: 28,
  },
})

export default Day15StickerPicker
