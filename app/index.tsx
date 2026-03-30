import { useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  FadeIn,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { JourneyMap } from '@/components/shared/JourneyMap'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/constants/theme'
import { getStageByDay } from '@/constants/stages'
import ProgressRing from '@/components/home/ProgressRing'
import MoodTrend from '@/components/home/MoodTrend'
import WelcomeOverlay from '@/components/home/WelcomeOverlay'

const TOTAL_DAYS = 29

// Default moods shown when no emotion data exists yet
const DEFAULT_MOODS: number[] = []

// Encouraging tagline beneath the start button
const ENCOURAGEMENT = '今天，给自己15分钟'

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { userId, currentDay, initUser } = useUserStore()
  const scoreHistory = useEmotionStore((s) => s.getScoreHistory())
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const completedDays = Object.keys(dailyLogs).map(Number)

  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)

  const isFirstTime = userId === null
  const moods = scoreHistory.length > 0
    ? scoreHistory.map((h) => h.score as number)
    : DEFAULT_MOODS

  const stage = getStageByDay(currentDay)

  useEffect(() => {
    // Hydration is handled by persist middleware;
    // initUser only runs when userId is still null after hydration.
    if (userId === null) return
  }, [userId])


  const handleDismissWelcome = () => {
    initUser()
  }

  const handleOpenSettings = () => {
    router.push('/settings')
  }

  // Animated press scale for the start button
  const buttonScale = useSharedValue(1)

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 200 })
  }, [buttonScale])

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 200 })
  }, [buttonScale])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top decorative gradient line */}
      <LinearGradient
        colors={[COLORS.primary, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topLine}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>healing journey</Text>
            <Text style={styles.appTitle}>29 天疗愈</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Badge gallery entry */}
            <Pressable
              onPress={() => router.push('/badges')}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={`查看徽章画廊，已获得${earnedCount}枚`}
            >
              <Text style={styles.iconText}>🏅</Text>
              {earnedCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{earnedCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={handleOpenSettings}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="打开设置"
            >
              <Text style={styles.iconText}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Progress ring — staggered entrance */}
        <Animated.View entering={FadeIn.duration(500)}>
          <ProgressRing currentDay={currentDay} totalDays={TOTAL_DAYS} />
        </Animated.View>

        {/* Phase info card — staggered entrance */}
        {stage && (
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.phaseCard}
          >
            <View style={[styles.phaseAccentBar, { backgroundColor: stage.color }]} />
            <View style={styles.phaseCardContent}>
              <Text style={styles.phaseLabel}>{stage.name}</Text>
              <Text style={styles.phaseDescription}>{stage.description}</Text>
            </View>
          </Animated.View>
        )}

        {/* Start button — staggered entrance (fade + slide) + press scale */}
        <Animated.View entering={SlideInUp.delay(400).duration(400).springify()}>
          <Animated.View style={animatedButtonStyle}>
            <Link href={`/day/${currentDay}`} asChild>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                accessibilityRole="button"
                accessibilityLabel="开始今日任务"
              >
                <LinearGradient
                  colors={[COLORS.primary, '#6A8AA2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButton}
                >
                  <Text style={styles.startButtonText}>开始今日任务</Text>
                </LinearGradient>
              </Pressable>
            </Link>
          </Animated.View>
          <Text style={styles.encouragement}>{ENCOURAGEMENT}</Text>
        </Animated.View>

        {/* Journey map — staggered entrance */}
        <Animated.View entering={FadeIn.delay(600).duration(400)}>
          <JourneyMap
            currentDay={currentDay}
            completedDays={completedDays}
            onDayPress={(day) => router.push(`/day/${day}`)}
          />
        </Animated.View>

        {/* Mood trend — staggered entrance */}
        {moods.length > 0 && (
          <Animated.View entering={FadeIn.delay(800).duration(400)}>
            <MoodTrend moods={moods} />
          </Animated.View>
        )}
      </ScrollView>

      {/* Welcome overlay */}
      {isFirstTime && <WelcomeOverlay onStart={handleDismissWelcome} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topLine: {
    height: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['6xl'],
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textTertiary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: SPACING['2xs'],
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconText: {
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  badgeCount: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: COLORS.card,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: 18,
  },
  // Phase info card
  phaseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING['3xl'],
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  phaseAccentBar: {
    width: 4,
  },
  phaseCardContent: {
    flex: 1,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  phaseLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  phaseDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  // Start button
  startButton: {
    borderRadius: BORDER_RADIUS['2xl'],
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  startButtonText: {
    color: COLORS.card,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  encouragement: {
    textAlign: 'center',
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING['4xl'],
  },
})
