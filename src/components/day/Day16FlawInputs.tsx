import React, { useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Props ─────────────────────────────────────────────────────────

interface Day16FlawInputsProps {
  readonly flaws: readonly [string, string, string]
  readonly crackVisible: readonly [boolean, boolean, boolean]
  readonly onFlawChange: (index: number, value: string) => void
  readonly onFlawSubmit: (index: number) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day16FlawInputs = React.memo(function Day16FlawInputs({
  flaws,
  crackVisible,
  onFlawChange,
  onFlawSubmit,
}: Day16FlawInputsProps) {
  return (
    <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.section}>
      {flaws.map((flaw, index) => (
        <View key={index} style={styles.flawRow}>
          <TextInput
            style={styles.flawInput}
            value={flaw}
            onChangeText={(v) => onFlawChange(index, v)}
            onBlur={() => onFlawSubmit(index)}
            placeholder={`缺点 ${index + 1}`}
            placeholderTextColor={COLORS.textTertiary}
            maxLength={50}
          />
          {crackVisible[index] && (
            <Animated.Text entering={FadeIn.duration(300)} style={styles.crackBadge}>
              💔
            </Animated.Text>
          )}
        </View>
      ))}
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING['2xl'],
  },
  flawRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  flawInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    ...SHADOWS.sm,
  },
  crackBadge: {
    fontSize: 20,
    marginLeft: SPACING.sm,
  },
})

export default Day16FlawInputs
