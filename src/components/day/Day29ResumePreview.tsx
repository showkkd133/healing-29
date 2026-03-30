import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { SlideInUp } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { RESUME_SECTIONS, STYLE_OPTIONS } from './Day29Types'
import type { ResumeSections } from './Day29Types'

// ─── Props ────────────────────────────────────────────────────────

interface Day29ResumePreviewProps {
  readonly sections: ResumeSections
  readonly style: string
}

// ─── Component ────────────────────────────────────────────────────

const Day29ResumePreview = React.memo(function Day29ResumePreview({
  sections,
  style,
}: Day29ResumePreviewProps) {
  const styleInfo = STYLE_OPTIONS.find((s) => s.id === style) ?? STYLE_OPTIONS[0]

  return (
    <Animated.View
      entering={SlideInUp.duration(500)}
      style={[styles.card, { backgroundColor: styleInfo.color }]}
    >
      <Text style={[styles.title, { color: styleInfo.textColor }]}>我的新生简历</Text>
      <View style={styles.divider} />

      {RESUME_SECTIONS.map((section) => {
        const tags = sections[section.id as keyof ResumeSections]
        if (tags.length === 0) return null
        return (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: styleInfo.textColor }]}>
              {section.title}
            </Text>
            <View style={styles.tagWrap}>
              {tags.map((tag, i) => (
                <View key={i} style={[styles.tag, { borderColor: styleInfo.textColor }]}>
                  <Text style={[styles.tagText, { color: styleInfo.textColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      })}
    </Animated.View>
  )
})

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
})

export default Day29ResumePreview
