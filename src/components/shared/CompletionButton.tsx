// NOTE: Not currently imported by any component — candidate for integration or removal
import React, { useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { COLORS } from '../../constants/theme'

interface CompletionButtonProps {
  onPress: () => void
  disabled?: boolean
  tomorrowPreview?: string
}

// Large rounded check-in button with haptic feedback and optional tomorrow preview
const CompletionButton = React.memo(function CompletionButton({
  onPress,
  disabled = false,
  tomorrowPreview,
}: CompletionButtonProps) {
  const handlePress = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics may not be available on all devices
    }
    onPress()
  }, [onPress])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
          {disabled ? '已完成 ✓' : '完成今日打卡'}
        </Text>
      </TouchableOpacity>
      {tomorrowPreview && (
        <Text style={styles.preview}>明日预告：{tomorrowPreview}</Text>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.card,
  },
  buttonTextDisabled: {
    color: COLORS.textSecondary,
  },
  preview: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
})

export default CompletionButton
