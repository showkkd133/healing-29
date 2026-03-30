import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '../ui/ZenButton'
import { ZenTypography } from '../ui/ZenTypography'
import { useHaptic } from '@/hooks/useHaptic'

// ─── Constants ─────────────────────────────────────────────────────

const RECORD_METHODS = [
  { key: 'photo', label: '拍照', icon: 'camera' },
  { key: 'voice', label: '录音', icon: 'mic' },
  { key: 'text', label: '文字', icon: 'edit-3' },
] as const

// ─── Props ─────────────────────────────────────────────────────────

interface Day6RecordPhaseProps {
  readonly containerStyle: object
  readonly recordMethod: string | null
  readonly reflection: string
  readonly onRecordMethodChange: (method: string) => void
  readonly onReflectionChange: (text: string) => void
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day6RecordPhase = React.memo(function Day6RecordPhase({
  containerStyle,
  recordMethod,
  reflection,
  onRecordMethodChange,
  onReflectionChange,
  onComplete,
}: Day6RecordPhaseProps) {
  const haptic = useHaptic();

  const handleMethodSelect = (key: string) => {
    haptic.light();
    onRecordMethodChange(key);
  };

  return (
    <View style={containerStyle}>
      <Animated.View entering={FadeIn.duration(500)}>
        <ZenTypography variant="bold" size="xl" color="text" align="center" style={styles.sectionTitle}>
          记录你的体验
        </ZenTypography>
      </Animated.View>

      {/* Record method selection */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.methodRow}>
        {RECORD_METHODS.map((method) => (
          <View key={method.key} style={styles.methodWrapper}>
            <ZenButton
              title={method.label}
              leftIcon={method.icon as any}
              variant={recordMethod === method.key ? 'primary' : 'outline'}
              size="sm"
              onPress={() => handleMethodSelect(method.key)}
            />
          </View>
        ))}
      </Animated.View>

      {/* Reflection input */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)}>
        <TextInput
          style={styles.reflectionInput}
          value={reflection}
          onChangeText={onReflectionChange}
          placeholder="记录一下感受..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          textAlignVertical="top"
          maxLength={500}
        />
      </Animated.View>

      {/* Complete button */}
      {recordMethod && (
        <Animated.View entering={FadeIn.duration(300)}>
          <ZenButton
            title="完成记录"
            variant="primary"
            size="md"
            onPress={onComplete}
            style={styles.primaryButton}
          />
        </Animated.View>
      )}
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: SPACING['2xl'],
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  methodWrapper: {
    flex: 1,
    maxWidth: 110,
  },
  reflectionInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 140,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: SPACING['3xl'],
    ...SHADOWS.md,
  },
  primaryButton: {
    alignSelf: 'center',
    minWidth: 160,
  },
})

export default Day6RecordPhase
