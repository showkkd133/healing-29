import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
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
  const typeInfo = WISH_TYPES.find((t) => t.id === selectedType)
  const dateStr = formatDate()

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(600)} style={styles.certificate}>
        <Text style={styles.certTitle}>自我礼物证书</Text>
        <View style={styles.certDivider} />
        <Text style={styles.certEmoji}>{typeInfo?.emoji ?? '🎁'}</Text>
        <Text style={styles.certWish}>{wish}</Text>
        <Text style={styles.certDate}>{dateStr}</Text>
        <View style={styles.certDivider} />
        <Text style={styles.certFooter}>致 勇敢的自己</Text>
      </Animated.View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>完成</Text>
      </TouchableOpacity>
    </ScrollView>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['5xl'],
  },
  certificate: {
    backgroundColor: '#FBF8F1',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['3xl'],
    alignItems: 'center',
    marginTop: SPACING.xl,
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  certTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 2,
  },
  certDivider: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.accent,
    marginVertical: SPACING.xl,
  },
  certEmoji: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  certWish: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: SPACING.lg,
  },
  certDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  certFooter: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  primaryButton: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day26Certificate
