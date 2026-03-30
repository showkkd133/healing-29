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

const TOTAL_DAYS = 29

// Default moods shown when no emotion data exists yet
const DEFAULT_MOODS: number[] = []

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>29 天疗愈</Text>
          <View style={styles.headerActions}>
            {/* Badge gallery entry */}
            <Pressable
              onPress={() => router.push('/badges')}
              style={styles.badgeButton}
              accessibilityRole="button"
              accessibilityLabel={`查看徽章画廊，已获得${earnedCount}枚`}
            >
              <Text style={styles.badgeIcon}>🏅</Text>
              {earnedCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{earnedCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={handleOpenSettings}
              style={styles.settingsButton}
              accessibilityRole="button"
              accessibilityLabel="打开设置"
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Progress ring — staggered entrance */}
        <Animated.View entering={FadeIn.duration(500)}>
          <ProgressRing currentDay={currentDay} totalDays={TOTAL_DAYS} />
        </Animated.View>

        {/* Phase info — staggered entrance */}
        <Animated.View
          entering={FadeIn.delay(200).duration(400)}
          style={styles.phaseContainer}
        >
          <Text style={styles.phaseLabel}>{stage?.name ?? ''}</Text>
          <Text style={styles.phaseDescription}>{stage?.description ?? ''}</Text>
        </Animated.View>

        {/* Start button — staggered entrance (fade + slide) + press scale */}
        <Animated.View entering={SlideInUp.delay(400).duration(400).springify()}>
          <Animated.View style={animatedButtonStyle}>
            <Link href={`/day/${currentDay}`} asChild>
              <Pressable
                style={styles.startButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                accessibilityRole="button"
                accessibilityLabel="开始今日任务"
              >
                <Text style={styles.startButtonText}>开始今日任务</Text>
              </Pressable>
            </Link>
          </Animated.View>
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
  scrollContent: {
    paddingHorizontal: SPACING['2xl'],
    paddingBottom: SPACING['4xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  badgeButton: {
    padding: SPACING.sm,
    position: 'relative',
  },
  badgeIcon: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  badgeCount: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  settingsButton: {
    padding: SPACING.sm,
  },
  settingsIcon: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  // Phase info
  phaseContainer: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  phaseLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
    marginBottom: SPACING.xs,
  },
  phaseName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  phaseDescription: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  // Start button
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
startButtonText: {
    color: COLORS.card,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
})
