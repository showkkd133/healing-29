import { StyleSheet, Dimensions } from 'react-native'
import {
  COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS,
} from '@/constants/theme'

// Chart layout constants
export const CHART_WIDTH = Dimensions.get('window').width - SPACING.lg * 4
export const CHART_HEIGHT = 180
export const CHART_PADDING = { top: 24, bottom: 28, left: 28, right: 16 }

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },

  // Celebration header — clean, no gradient overlay
  celebrationContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
  },
  celebrationIcon: {
    marginBottom: SPACING.md,
  },
  celebrationTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  celebrationSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },

  // Stats row — inline text list, no card backgrounds
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING['2xl'],
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  statsValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING['2xs'],
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },

  // Chart — 1px border, no shadow
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },

  // Journey arrow label shown after chart animation completes
  journeyArrowContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  journeyArrowText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    letterSpacing: 2,
  },

  // Badge section
  badgeSection: {
    marginBottom: SPACING['2xl'],
  },
  badgeListContent: {
    gap: SPACING.md,
  },
  badgeItem: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    width: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  badgeName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  badgeOverflow: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  badgeOverflowText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
  },

  // Encouragement — system font, no quotes, centered
  encouragementContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['3xl'],
  },
  encouragementText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
    textAlign: 'center',
  },

  // Action buttons — vertical stack, primary on top
  actionContainer: {
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: '#FFFFFF',
  },
  ghostButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  ghostButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.primary,
  },
})
