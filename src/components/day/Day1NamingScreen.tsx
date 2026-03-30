import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { SlideInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import type { PrivacyLevel } from '@/types'

// ─── Props ─────────────────────────────────────────────────────────

interface Day1NamingScreenProps {
  readonly recordingName: string
  readonly defaultName: string
  readonly onChangeName: (name: string) => void
  readonly onSave: (storage: PrivacyLevel) => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day1NamingScreen = React.memo(function Day1NamingScreen({
  recordingName,
  defaultName,
  onChangeName,
  onSave,
}: Day1NamingScreenProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={SlideInDown.duration(500)} style={styles.namingContainer}>
        <Text style={styles.namingLabel}>给这段记录起个名字</Text>
        <TextInput
          style={styles.namingInput}
          value={recordingName}
          onChangeText={onChangeName}
          placeholder={defaultName}
          placeholderTextColor={COLORS.textTertiary}
          maxLength={30}
        />
        <View style={styles.saveRow}>
          <TouchableOpacity
            style={[styles.saveButton, styles.saveLocal]}
            onPress={() => onSave('local')}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>保存本地</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, styles.saveCloud]}
            onPress={() => onSave('cloud')}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveButtonText, styles.saveCloudText]}>云端封存</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  namingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  namingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  namingInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    ...SHADOWS.sm,
    marginBottom: SPACING['3xl'],
  },
  saveRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    alignItems: 'center',
  },
  saveLocal: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveCloud: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveCloudText: {
    color: COLORS.card,
  },
})

export default Day1NamingScreen
