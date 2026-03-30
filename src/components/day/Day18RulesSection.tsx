import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'

// ─── Constants ─────────────────────────────────────────────────────

const RULES = [
  { icon: '📱', text: '不发动态' },
  { icon: '🔍', text: '不刷前任' },
  { icon: '📵', text: '减少社交媒体' },
] as const

const GRAYSCALE_GUIDE = 'iOS: 设置 > 辅助功能 > 显示与文字大小 > 颜色滤镜 > 灰度'

// Rules list and grayscale guide displayed during active silence session
const Day18RulesSection = React.memo(function Day18RulesSection() {
  return (
    <>
      {/* Rules */}
      <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.rulesSection}>
        <Text style={styles.sectionTitle}>今日规则</Text>
        {RULES.map((rule, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(300 + index * 150).duration(400)}
            style={styles.ruleCard}
          >
            <Text style={styles.ruleIcon}>{rule.icon}</Text>
            <Text style={styles.ruleText}>{rule.text}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Grayscale guide */}
      <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.guideCard}>
        <Text style={styles.guideTitle}>灰度模式指引</Text>
        <Text style={styles.guideText}>{GRAYSCALE_GUIDE}</Text>
      </Animated.View>
    </>
  )
})

const styles = StyleSheet.create({
  rulesSection: {
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  ruleIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  ruleText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  guideCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.sm,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  guideText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
})

export default Day18RulesSection
