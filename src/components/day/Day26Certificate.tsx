import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ZenButton } from '../ui/ZenButton'
import { ZenTypography } from '../ui/ZenTypography'
import { WISH_TYPES } from './Day26Constants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day26CertificateProps {
  readonly selectedType: string
  readonly wish: string
  readonly onComplete: () => void
}

// ─── Helpers ───────────────────────────────────────────────────────

const formatDate = (): string => {
  const today = new Date()
  return `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
}

// ─── Component ─────────────────────────────────────────────────────

const Day26Certificate = React.memo(function Day26Certificate({
  selectedType,
  wish,
  onComplete,
}: Day26CertificateProps) {
  const dateStr = formatDate()

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(800)} style={styles.certificateContainer}>
        <View style={styles.innerBorder}>
          <ZenTypography variant="bold" size="lg" color="text" align="center" style={styles.certTitle}>
            自我礼物证书
          </ZenTypography>
          
          <View style={styles.certDivider} />
          
          <Animated.View entering={ZoomIn.delay(400).duration(600)} style={styles.iconWrapper}>
            <Feather name="award" size={64} color={COLORS.accent} />
          </Animated.View>

          <ZenTypography variant="bold" size="md" color="primary" align="center" style={styles.certWish}>
            "{wish}"
          </ZenTypography>
          
          <View style={styles.stampedArea}>
            <ZenTypography size="sm" color="textTertiary" style={styles.certDate}>
              颁发日期：{dateStr}
            </ZenTypography>
          </View>
          
          <View style={styles.certDivider} />
          
          <ZenTypography type="serif" variant="medium" size="base" color="textSecondary" align="center">
            致 勇敢而温柔的自己
          </ZenTypography>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(800).duration(400)}>
        <ZenButton
          title="领取奖励并开启新篇章"
          variant="hero"
          size="lg"
          fullWidth
          onPress={onComplete}
          style={styles.primaryButton}
        />
      </Animated.View>
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['6xl'],
    paddingHorizontal: SPACING.xl,
  },
  certificateContainer: {
    backgroundColor: '#FDFBF7',
    borderRadius: BORDER_RADIUS.xl,
    padding: 6, // Outer gap for the double border feel
    marginTop: SPACING.xl,
    ...SHADOWS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  innerBorder: {
    borderWidth: 2,
    borderColor: COLORS.accentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING['2xl'],
    alignItems: 'center',
  },
  certTitle: {
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  certDivider: {
    width: '40%',
    height: 1,
    backgroundColor: COLORS.accentLight,
    marginVertical: SPACING.xl,
  },
  iconWrapper: {
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  certWish: {
    lineHeight: 32,
    marginBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.md,
  },
  stampedArea: {
    marginBottom: SPACING.lg,
    opacity: 0.8,
  },
  certDate: {
    letterSpacing: 1,
  },
  primaryButton: {
    marginTop: SPACING['4xl'],
  },
})

export default Day26Certificate
