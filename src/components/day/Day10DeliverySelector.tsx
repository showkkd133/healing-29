import React, { useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const DELIVERY_OPTIONS = [
  { id: '1year', label: '1年后' },
  { id: '2year', label: '2年后' },
  { id: 'custom', label: '自定义' },
] as const

export type DeliveryOption = typeof DELIVERY_OPTIONS[number]['id']

// ─── Helper ────────────────────────────────────────────────────────

export const getDeliveryDate = (option: DeliveryOption, customDate: string): string => {
  const now = new Date()
  if (option === '1year') {
    return `${now.getFullYear() + 1}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }
  if (option === '2year') {
    return `${now.getFullYear() + 2}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }
  return customDate
}

// ─── Props ─────────────────────────────────────────────────────────

interface Day10DeliverySelectorProps {
  readonly deliveryOption: DeliveryOption | null
  readonly onSelectDelivery: (option: DeliveryOption) => void
  readonly customDate: string
  readonly onCustomDateChange: (date: string) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day10DeliverySelector = React.memo(function Day10DeliverySelector({
  deliveryOption,
  onSelectDelivery,
  customDate,
  onCustomDateChange,
}: Day10DeliverySelectorProps) {
  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)}>
      <Text style={styles.sectionLabel}>选择送达时间</Text>
      <View style={styles.optionRow}>
        {DELIVERY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              deliveryOption === option.id && styles.optionButtonActive,
            ]}
            onPress={() => onSelectDelivery(option.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                deliveryOption === option.id && styles.optionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {deliveryOption === 'custom' && (
        <Animated.View entering={FadeIn.duration(300)}>
          <TextInput
            style={styles.dateInput}
            value={customDate}
            onChangeText={onCustomDateChange}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </Animated.View>
      )}
    </Animated.View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  optionTextActive: {
    color: COLORS.card,
  },
  dateInput: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
})

export default Day10DeliverySelector
