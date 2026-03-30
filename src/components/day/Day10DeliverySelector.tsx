import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '../ui/ZenButton'
import { ZenTypography } from '../ui/ZenTypography'
import { useHaptic } from '@/hooks/useHaptic'

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
  const haptic = useHaptic();

  const handleSelect = (option: DeliveryOption) => {
    haptic.light();
    onSelectDelivery(option);
  };

  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)}>
      <ZenTypography variant="bold" size="sm" color="text" style={styles.sectionLabel}>
        选择送达时间
      </ZenTypography>
      <View style={styles.optionRow}>
        {DELIVERY_OPTIONS.map((option) => (
          <View key={option.id} style={styles.optionWrapper}>
            <ZenButton
              title={option.label}
              variant={deliveryOption === option.id ? 'primary' : 'outline'}
              size="sm"
              fullWidth
              onPress={() => handleSelect(option.id)}
            />
          </View>
        ))}
      </View>

      {deliveryOption === 'custom' && (
        <Animated.View entering={FadeInDown.duration(300)}>
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
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  optionWrapper: {
    flex: 1,
  },
  dateInput: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
})

export default Day10DeliverySelector
