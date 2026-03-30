import React from 'react'
import { View, StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme'
import { ZenButton } from '../ui/ZenButton'
import { ZenTypography } from '../ui/ZenTypography'
import { Feather } from '@expo/vector-icons'

interface CompletionButtonProps {
  onPress: () => void
  disabled?: boolean
  tomorrowPreview?: string
}

/**
 * CompletionButton: The primary "check-in" button used throughout the app.
 * Refined to match the Zen design system with improved hierarchy and preview styling.
 */
const CompletionButton = React.memo(function CompletionButton({
  onPress,
  disabled = false,
  tomorrowPreview,
}: CompletionButtonProps) {
  return (
    <View style={styles.container}>
      <ZenButton
        title={disabled ? '今日已打卡' : '完成今日练习'}
        variant={disabled ? 'outline' : 'primary'}
        size="lg"
        fullWidth
        onPress={onPress}
        disabled={disabled}
        rightIcon={disabled ? 'check-circle' : 'chevron-right'}
      />
      
      {tomorrowPreview && (
        <View style={styles.previewContainer}>
          <Feather name="calendar" size={12} color={COLORS.textTertiary} style={styles.previewIcon} />
          <ZenTypography variant="medium" size="xs" color="textTertiary">
            明日预告：{tomorrowPreview}
          </ZenTypography>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    width: '100%',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  previewIcon: {
    marginRight: 6,
  },
})

export default CompletionButton
