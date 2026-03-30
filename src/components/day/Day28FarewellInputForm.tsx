import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import {
  METHOD_OPTIONS,
  ELEMENTS,
  DEFAULT_FAREWELL,
  SAFETY_GUIDE,
} from './Day28FarewellConstants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day28FarewellInputFormProps {
  readonly method: string | null
  readonly selectedElement: string | null
  readonly itemDesc: string
  readonly farewellWords: string
  readonly onMethodChange: (method: string) => void
  readonly onElementChange: (element: string) => void
  readonly onItemDescChange: (text: string) => void
  readonly onFarewellWordsChange: (text: string) => void
  readonly onRelease: () => void
  readonly canRelease: boolean
}

// ─── Component ─────────────────────────────────────────────────────

const Day28FarewellInputForm = React.memo(function Day28FarewellInputForm({
  method,
  selectedElement,
  itemDesc,
  farewellWords,
  onMethodChange,
  onElementChange,
  onItemDescChange,
  onFarewellWordsChange,
  onRelease,
  canRelease,
}: Day28FarewellInputFormProps) {
  const [safetyConfirmed, setSafetyConfirmed] = useState(false)

  // Derived release state that accounts for safety confirmation
  const isReleasable = method === 'reality'
    ? canRelease && safetyConfirmed
    : canRelease

  const handleSelectMethod = useCallback(async (methodId: string) => {
    onMethodChange(methodId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [onMethodChange])

  const handleSelectElement = useCallback(async (elementId: string) => {
    onElementChange(elementId)
    try {
      await Haptics.selectionAsync()
    } catch {
      // Haptics not available
    }
  }, [onElementChange])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.Text entering={FadeIn.delay(200).duration(500)} style={styles.guidanceText}>
          象征性告别
        </Animated.Text>

        {/* Method selection */}
        <Animated.View entering={FadeIn.delay(400).duration(400)}>
          <Text style={styles.sectionLabel}>选择告别方式</Text>
          <View style={styles.methodRow}>
            {METHOD_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.methodButton, method === opt.id && styles.methodButtonActive]}
                onPress={() => handleSelectMethod(opt.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.methodEmoji}>{opt.emoji}</Text>
                <Text
                  style={[styles.methodLabel, method === opt.id && styles.methodLabelActive]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Virtual mode: element selection */}
        {method === 'virtual' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>选择释放元素</Text>
            <View style={styles.elementRow}>
              {ELEMENTS.map((el) => (
                <TouchableOpacity
                  key={el.id}
                  style={[
                    styles.elementButton,
                    { backgroundColor: selectedElement === el.id ? el.color : COLORS.card },
                    selectedElement === el.id && styles.elementButtonActive,
                  ]}
                  onPress={() => handleSelectElement(el.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.elementEmoji}>{el.emoji}</Text>
                  <Text style={styles.elementLabel}>{el.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Reality mode: safety guide */}
        {method === 'reality' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={styles.safetyCard}>
              <Text style={styles.safetyText}>{SAFETY_GUIDE}</Text>
            </View>

            {/* Photo record button */}
            <TouchableOpacity style={styles.photoButton} activeOpacity={0.7}>
              <Text style={styles.photoEmoji}>📷</Text>
              <Text style={styles.photoText}>拍照记录</Text>
            </TouchableOpacity>

            {/* Safety confirmation */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setSafetyConfirmed((prev) => !prev)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, safetyConfirmed && styles.checkboxChecked]}>
                {safetyConfirmed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>我确认在安全环境中进行</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Item description */}
        {method !== null && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.sectionLabel}>你要告别的是什么？</Text>
            <TextInput
              style={styles.textInput}
              value={itemDesc}
              onChangeText={onItemDescChange}
              placeholder="描述你要告别的事物..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

            {/* Farewell words */}
            <Text style={styles.sectionLabel}>告别语</Text>
            <TextInput
              style={styles.textInput}
              value={farewellWords}
              onChangeText={onFarewellWordsChange}
              placeholder={DEFAULT_FAREWELL}
              placeholderTextColor={COLORS.textTertiary}
              maxLength={200}
            />
          </Animated.View>
        )}

        {/* Release button */}
        <TouchableOpacity
          style={[styles.releaseButton, !isReleasable && styles.releaseButtonDisabled]}
          onPress={onRelease}
          disabled={!isReleasable}
          activeOpacity={0.8}
        >
          <Text style={[styles.releaseButtonText, !isReleasable && styles.releaseButtonTextDisabled]}>
            {method === 'virtual' ? '释放' : '完成告别'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  guidanceText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: SPACING['3xl'],
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },

  // Method selection
  methodRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  methodButton: {
    flex: 1,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  methodButtonActive: {
    borderColor: COLORS.primary,
  },
  methodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  methodLabelActive: {
    color: COLORS.primary,
  },

  // Element selection
  elementRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  elementButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elementButtonActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  elementEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  elementLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },

  // Safety
  safetyCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  safetyText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  photoButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  photoEmoji: {
    fontSize: 20,
  },
  photoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.card,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.text,
  },

  // Text input
  textInput: {
    minHeight: 60,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
    ...SHADOWS.sm,
  },

  // Release button
  releaseButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.stageDeepHealing,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  releaseButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  releaseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.card,
  },
  releaseButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
})

export default Day28FarewellInputForm
