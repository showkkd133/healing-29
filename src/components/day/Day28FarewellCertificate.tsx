import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { ELEMENTS } from './Day28FarewellConstants'

// ─── Props ─────────────────────────────────────────────────────────

interface Day28FarewellCertificateProps {
  readonly method: string
  readonly selectedElement: string | null
  readonly itemDesc: string
  readonly farewellWords: string
  readonly onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────

const Day28FarewellCertificate = React.memo(function Day28FarewellCertificate({
  method,
  selectedElement,
  itemDesc,
  farewellWords,
  onComplete,
}: Day28FarewellCertificateProps) {
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  const elementInfo = ELEMENTS.find((e) => e.id === selectedElement)

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(600)} style={styles.certificate}>
        <Text style={styles.title}>告别证书</Text>
        <View style={styles.divider} />
        {method === 'virtual' && (
          <Text style={styles.element}>
            释放方式：{elementInfo?.emoji ?? ''} {elementInfo?.label ?? ''}
          </Text>
        )}
        {method === 'reality' && (
          <Text style={styles.element}>释放方式：现实告别</Text>
        )}
        <Text style={styles.item}>{itemDesc}</Text>
        <Text style={styles.words}>「{farewellWords}」</Text>
        <Text style={styles.date}>{dateStr}</Text>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={onComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>完成告别</Text>
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
    borderColor: COLORS.stageDeepHealing,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 2,
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.stageDeepHealing,
    marginVertical: SPACING.xl,
  },
  element: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  item: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.lg,
  },
  words: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  button: {
    marginTop: SPACING['3xl'],
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
  },
})

export default Day28FarewellCertificate
