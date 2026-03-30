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
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import CategoryPicker, {
  createEmptyEvidences,
  type Category,
  type Evidence,
} from './Day14CategoryPicker'
import ReportView from './Day14ReportView'

// ─── Props ─────────────────────────────────────────────────────────

interface Day14RelationshipAutopsyProps {
  readonly onComplete: (data: {
    readonly mismatches: ReadonlyArray<{ readonly text: string; readonly category: string }>
    readonly learnings: ReadonlyArray<{ readonly text: string; readonly category: string }>
  }) => void
}

// ─── Main component ────────────────────────────────────────────────

const Day14RelationshipAutopsy = React.memo(function Day14RelationshipAutopsy({
  onComplete,
}: Day14RelationshipAutopsyProps) {
  const [mismatches, setMismatches] = useState<readonly Evidence[]>(createEmptyEvidences)
  const [learnings, setLearnings] = useState<readonly Evidence[]>(createEmptyEvidences)
  const [showReport, setShowReport] = useState(false)
  const [completed, setCompleted] = useState(false)

  const hasContent = mismatches.some((e) => e.text.trim().length > 0) ||
    learnings.some((e) => e.text.trim().length > 0)

  // ─── Handlers (immutable updates) ──────────────────────────────

  const updateMismatchText = useCallback((index: number, text: string) => {
    setMismatches((prev) => prev.map((item, i) =>
      i === index ? { ...item, text } : item
    ))
  }, [])

  const updateMismatchCategory = useCallback((index: number, category: Category) => {
    setMismatches((prev) => prev.map((item, i) =>
      i === index ? { ...item, category } : item
    ))
  }, [])

  const updateLearningText = useCallback((index: number, text: string) => {
    setLearnings((prev) => prev.map((item, i) =>
      i === index ? { ...item, text } : item
    ))
  }, [])

  const updateLearningCategory = useCallback((index: number, category: Category) => {
    setLearnings((prev) => prev.map((item, i) =>
      i === index ? { ...item, category } : item
    ))
  }, [])

  const handleGenerateReport = useCallback(async () => {
    setShowReport(true)
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch {
      // Haptics not available
    }
  }, [])

  const handleComplete = useCallback(async () => {
    setCompleted(true)
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Haptics not available
    }
    onComplete({
      mismatches: mismatches
        .filter((e) => e.text.trim().length > 0)
        .map((e) => ({ text: e.text, category: e.category })),
      learnings: learnings
        .filter((e) => e.text.trim().length > 0)
        .map((e) => ({ text: e.text, category: e.category })),
    })
  }, [mismatches, learnings, onComplete])

  const handleBackToEdit = useCallback(() => {
    setShowReport(false)
  }, [])

  // ─── Render: completed ────────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>📋</Text>
          <Text style={styles.completedText}>
            报告已归档，案件结案
          </Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: report view ──────────────────────────────────────

  if (showReport) {
    return (
      <View style={styles.container}>
        <ReportView mismatches={mismatches} learnings={learnings} />

        <View style={styles.reportActions}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>返回编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>保存报告</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // ─── Render: main (dual column input) ─────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Guidance */}
        <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.guidanceText}>
          这不是找错，是找不适合的证据
        </Animated.Text>

        {/* Left column: Mismatches */}
        <Animated.View entering={FadeInLeft.delay(400).duration(500)}>
          <Text style={styles.columnTitle}>不适合的证据</Text>
          {mismatches.map((item, index) => (
            <View key={`m-${index}`} style={styles.evidenceCard}>
              <TextInput
                style={styles.evidenceInput}
                value={item.text}
                onChangeText={(text) => updateMismatchText(index, text)}
                placeholder={`证据 ${index + 1}…`}
                placeholderTextColor={COLORS.textTertiary}
                multiline
                maxLength={200}
              />
              <CategoryPicker
                value={item.category}
                onChange={(cat) => updateMismatchCategory(index, cat)}
              />
            </View>
          ))}
        </Animated.View>

        {/* Right column: Learnings */}
        <Animated.View entering={FadeInRight.delay(600).duration(500)}>
          <Text style={styles.columnTitle}>关于自己的发现</Text>
          {learnings.map((item, index) => (
            <View key={`l-${index}`} style={styles.evidenceCard}>
              <TextInput
                style={styles.evidenceInput}
                value={item.text}
                onChangeText={(text) => updateLearningText(index, text)}
                placeholder={`发现 ${index + 1}…`}
                placeholderTextColor={COLORS.textTertiary}
                multiline
                maxLength={200}
              />
              <CategoryPicker
                value={item.category}
                onChange={(cat) => updateLearningCategory(index, cat)}
              />
            </View>
          ))}
        </Animated.View>

        {/* Generate report button */}
        <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.generateWrapper}>
          <TouchableOpacity
            style={[styles.generateButton, !hasContent && styles.generateButtonDisabled]}
            onPress={handleGenerateReport}
            disabled={!hasContent}
            activeOpacity={0.8}
          >
            <Text style={[styles.generateButtonText, !hasContent && styles.generateButtonTextDisabled]}>
              生成报告
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  guidanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: SPACING['3xl'],
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
  },
  evidenceCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  evidenceInput: {
    minHeight: 48,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  generateWrapper: {
    marginTop: SPACING['3xl'],
    alignItems: 'center',
  },
  generateButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['4xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.stageDeepHealing,
    ...SHADOWS.md,
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  generateButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
  reportActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.card,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day14RelationshipAutopsy
