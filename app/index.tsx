import { useState, useCallback } from 'react'
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
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { JourneyMap } from '@/components/shared/JourneyMap'
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme'
import { getStageByDay } from '@/constants/stages'
import ProgressRing from '@/components/home/ProgressRing'
import MoodTrend from '@/components/home/MoodTrend'
import WelcomeOverlay from '@/components/home/WelcomeOverlay'
import { IconBadge, IconSettings } from '@/components/icons'

const TOTAL_DAYS = 29

// Default moods shown when no emotion data exists yet
const DEFAULT_MOODS: number[] = []

// Encouraging tagline beneath the start button
const ENCOURAGEMENT = '今天，给自己15分钟'

// Max height for the expanded journey map content
const JOURNEY_EXPANDED_HEIGHT = 800

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

  // Journey map collapsible state
  const [journeyExpanded, setJourneyExpanded] = useState(false)
  const journeyHeight = useSharedValue(0)

  const animatedJourneyStyle = useAnimatedStyle(() => ({
    height: journeyHeight.value === 0 ? 0 : journeyHeight.value,
    overflow: 'hidden' as const,
    opacity: journeyHeight.value === 0 ? 0 : 1,
  }))

  const toggleJourney = useCallback(() => {
    setJourneyExpanded((prev) => {
      const next = !prev
      journeyHeight.value = withTiming(
        next ? JOURNEY_EXPANDED_HEIGHT : 0,
        { duration: 300 },
      )
      return next
    })
  }, [journeyHeight])

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — minimal title + icon actions */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>29天疗愈</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/badges')}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`查看徽章画廊，已获得${earnedCount}枚`}
            >
              <IconBadge size={20} color={COLORS.primary} />
              {earnedCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{earnedCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="打开设置"
            >
              <IconSettings size={20} color={COLORS.primary} />
            </Pressable>
          </View>
        </View>

        {/* Progress ring — visual focal point, occupies ~40% of viewport */}
        <Animated.View
          entering={FadeIn.duration(500)}
          style={styles.progressRingWrapper}
        >
          <ProgressRing currentDay={currentDay} totalDays={TOTAL_DAYS} />
        </Animated.View>

        {/* Stage info — centered text with color dot */}
        {stage && (
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.stageInfo}
          >
            <View style={[styles.stageDot, { backgroundColor: stage.color }]} />
            <Text style={styles.stageName}>{stage.name}</Text>
            <Text style={styles.stageDescription}>{stage.description}</Text>
          </Animated.View>
        )}

        {/* CTA button — full width gradient */}
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

        {/* Journey map — collapsible section */}
        <Animated.View
          entering={FadeIn.delay(600).duration(400)}
          style={styles.journeySection}
        >
          <Pressable
            onPress={toggleJourney}
            style={styles.journeyToggle}
            accessibilityRole="button"
            accessibilityLabel={journeyExpanded ? '收起旅程地图' : '展开旅程地图'}
          >
            <Text style={styles.journeyToggleTitle}>旅程地图</Text>
            <Text style={styles.journeyToggleProgress}>
              {completedDays.length}/{TOTAL_DAYS}
            </Text>
          </Pressable>
          <Animated.View style={animatedJourneyStyle}>
            <JourneyMap
              currentDay={currentDay}
              completedDays={completedDays}
              onDayPress={(day) => router.push(`/day/${day}`)}
            />
          </Animated.View>
        </Animated.View>

        {/* Mood trend */}
        {moods.length > 0 && (
          <Animated.View
            entering={FadeIn.delay(800).duration(400)}
            style={styles.moodTrendWrapper}
          >
            <MoodTrend moods={moods} />
          </Animated.View>
        )}
      </ScrollView>

      {/* Welcome overlay for first-time users */}
      {isFirstTime && <WelcomeOverlay onStart={handleDismissWelcome} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    paddingVertical: SPACING.lg,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 156, 180, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButtonPressed: {
    opacity: 0.6,
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
  // Progress ring — generous vertical breathing room
  progressRingWrapper: {
    marginVertical: SPACING['4xl'],
  },
  // Stage info — centered, minimal
  stageInfo: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  stageName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stageDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.base,
    textAlign: 'center',
  },
  // CTA button — full width
  startButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
    letterSpacing: 0.5,
  },
  encouragement: {
    textAlign: 'center',
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING['5xl'],
  },
  // Journey map — collapsible section
  journeySection: {
    marginBottom: SPACING['3xl'],
  },
  journeyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  journeyToggleTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  journeyToggleProgress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  // Mood trend
  moodTrendWrapper: {
    marginTop: SPACING['4xl'],
    marginBottom: SPACING['4xl'],
  },
})
