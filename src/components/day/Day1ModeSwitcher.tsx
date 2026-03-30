import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

type InputMode = 'voice' | 'text'

interface Day1ModeSwitcherProps {
  readonly mode: InputMode
  readonly onSwitch: (mode: InputMode) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day1ModeSwitcher = React.memo(function Day1ModeSwitcher({
  mode,
  onSwitch,
}: Day1ModeSwitcherProps) {
  return (
    <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.tabRow}>
      <TouchableOpacity
        style={[styles.tab, mode === 'voice' && styles.tabActive]}
        onPress={() => onSwitch('voice')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, mode === 'voice' && styles.tabTextActive]}>
          🎙 语音
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, mode === 'text' && styles.tabActive]}
        onPress={() => onSwitch('text')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, mode === 'text' && styles.tabTextActive]}>
          ✏️ 文字
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    padding: 3,
    marginBottom: SPACING['3xl'],
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING['2xl'],
    borderRadius: BORDER_RADIUS.lg,
  },
  tabActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
  },
})

export default Day1ModeSwitcher
