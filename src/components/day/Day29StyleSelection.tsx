import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { STYLE_OPTIONS } from './Day29Types'

// ─── Props ────────────────────────────────────────────────────────

interface Day29StyleSelectionProps {
  readonly onSelectStyle: (styleId: string) => void
}

// ─── Component ────────────────────────────────────────────────────

const Day29StyleSelection = React.memo(function Day29StyleSelection({
  onSelectStyle,
}: Day29StyleSelectionProps) {
  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(400)} style={styles.title}>
        选择简历风格
      </Animated.Text>

      <View style={styles.grid}>
        {STYLE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.card, { backgroundColor: opt.color }]}
            onPress={() => onSelectStyle(opt.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.cardLabel, { color: opt.textColor }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
})

export default Day29StyleSelection
