import { StyleSheet, Dimensions } from 'react-native'
import {
  COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS,
} from '@/constants/theme'

// Chart layout constants
export const CHART_WIDTH = Dimensions.get('window').width - SPACING.lg * 4
export const CHART_HEIGHT = 180
export const CHART_PADDING = { top: 24, bottom: 28, left: 28, right: 16 }

// Distinct card accent colors for the 3 stats cards
export const STATS_CARD_COLORS = [
  { bg: '#F0F6FA', accent: COLORS.primary },      // mist blue family
  { bg: '#FDF5F0', accent: COLORS.accent },        // amber family
  { bg: '#F5F0FA', accent: '#9B8EC4' },            // purple family
] as const

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['5xl'],
  },

  // Celebration header — gradient from dawn pink to background
  celebrationContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FDF5F5',
    opacity: 0.6,
    borderRadius: BORDER_RADIUS['2xl'],
  },
  celebrationEmoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  celebrationTitle: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  celebrationSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
  // Decorative gold line below subtitle
  goldLine: {
    width: 48,
    height: 2.5,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.lg,
    opacity: 0.8,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  statsCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingTop: 0,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  // Colored top stripe for each stats card
  statsCardStripe: {
    height: 3,
    width: '100%',
    marginBottom: SPACING.md,
  },
  statsValue: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  // Chart — with card background
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING['2xl'],
    ...SHADOWS.md,
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
    ...SHADOWS.md,
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

  // Encouragement — serif, larger, with quotation marks
  encouragementContainer: {
    backgroundColor: 'rgba(124, 156, 180, 0.08)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING['3xl'],
  },
  encouragementText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.fontSize.md * 1.8,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.fontFamily.serif,
  },

  // Action buttons — swapped: export is ghost, home is primary
  actionContainer: {
    gap: SPACING.md,
  },
  // Ghost button for export
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  ghostButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  // Primary filled button for home
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: '#FFFFFF',
  },

  // Footer signature
  footerSignature: {
    marginTop: SPACING['2xl'],
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  footerSignatureText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
})
