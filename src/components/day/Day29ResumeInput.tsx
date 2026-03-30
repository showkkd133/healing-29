import React from 'react'
import {
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { RESUME_SECTIONS, GUIDANCE_TEXT } from './Day29Types'
import type { ResumeSections, SectionKey } from './Day29Types'
import Day29TagInput from './Day29TagInput'

// ─── Props ────────────────────────────────────────────────────────

interface Day29ResumeInputProps {
  readonly sections: ResumeSections
  readonly currentSectionIndex: number
  readonly onAddTag: (sectionId: string, tag: string) => void
  readonly onRemoveTag: (sectionId: string, index: number) => void
  readonly onNextSection: () => void
}

// ─── Component ────────────────────────────────────────────────────

const Day29ResumeInput = React.memo(function Day29ResumeInput({
  sections,
  currentSectionIndex,
  onAddTag,
  onRemoveTag,
  onNextSection,
}: Day29ResumeInputProps) {
  const currentSection = RESUME_SECTIONS[currentSectionIndex]
  const sectionKey = currentSection.id as SectionKey
  const currentTags = sections[sectionKey]
  const hasTags = currentTags.length > 0

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
          {GUIDANCE_TEXT}
        </Animated.Text>

        {/* Section progress */}
        <Text style={styles.stepIndicator}>
          {currentSectionIndex + 1} / {RESUME_SECTIONS.length}
        </Text>

        {/* Section title */}
        <Animated.Text
          key={currentSection.id}
          entering={FadeIn.duration(300)}
          style={styles.sectionTitle}
        >
          {currentSection.title}
        </Animated.Text>

        {/* Tag input */}
        <Day29TagInput
          tags={currentTags}
          placeholder={currentSection.placeholder}
          onAdd={(tag) => onAddTag(currentSection.id, tag)}
          onRemove={(index) => onRemoveTag(currentSection.id, index)}
        />

        {/* Next button */}
        <TouchableOpacity
          style={[styles.nextButton, !hasTags && styles.nextButtonDisabled]}
          onPress={onNextSection}
          disabled={!hasTags}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.nextButtonText, !hasTags && styles.nextButtonTextDisabled]}
          >
            {currentSectionIndex < RESUME_SECTIONS.length - 1 ? '下一项' : '选择风格'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
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
    marginBottom: SPACING.xl,
  },
  stepIndicator: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  nextButton: {
    marginTop: SPACING.xl,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
  nextButtonTextDisabled: {
    color: COLORS.textTertiary,
  },
})

export default Day29ResumeInput
