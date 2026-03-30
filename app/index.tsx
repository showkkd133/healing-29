import { useState, useCallback, useEffect, useRef } from 'react'
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
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { JourneyMap } from '@/components/shared/JourneyMap'
import { BreathingView } from '@/components/shared/BreathingView'
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme'
import { getStageByDay } from '@/constants/stages'
import { DAILY_QUOTES } from '@/constants/quotes'
import WelcomeOverlay from '@/components/home/WelcomeOverlay'
import WeatherParticles from '@/components/home/WeatherParticles'
import { IconBadge, IconSettings } from '@/components/icons'

const TOTAL_DAYS = 29

// Max height for the expanded journey map content
const JOURNEY_EXPANDED_HEIGHT = 450

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { userId, currentDay, initUser } = useUserStore()
  const scoreHistory = useEmotionStore((s) => s.getScoreHistory())
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const completedDays = Object.keys(dailyLogs).map(Number)

  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)

  // Detect newly completed day and trigger ripple animation
  const [justCompleted, setJustCompleted] = useState<number | undefined>()
  const prevCompletedCountRef = useRef(completedDays.length)

  useEffect(() => {
    if (completedDays.length > prevCompletedCountRef.current) {
      const newest = Math.max(...completedDays)
      setJustCompleted(newest)
      const timer = setTimeout(() => setJustCompleted(undefined), 1500)
      return () => clearTimeout(timer)
    }
    prevCompletedCountRef.current = completedDays.length
  }, [completedDays])

  const isFirstTime = userId === null
  const moods = scoreHistory.length > 0
    ? scoreHistory.map((h) => h.score as number)
    : []

  const avgMood = moods.length > 0
    ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length)
    : 0

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
        { duration: 400 },
      )
      return next
    })
  }, [journeyHeight])

  const handleDismissWelcome = () => {
    initUser()
  }

  // Animated press scale for the start button
  const buttonScale = useSharedValue(1)

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.98, { damping: 15, stiffness: 200 })
  }, [buttonScale])

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 200 })
  }, [buttonScale])

  return (
    <View style={styles.container}>
      <WeatherParticles moodScore={avgMood} />
      
      {/* Decorative breathing element in background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BreathingView 
          duration={5000} 
          range={[0.8, 1.2]} 
          style={styles.backgroundPulse} 
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — minimal icons */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('/badges')}
            style={styles.iconButton}
          >
            <IconBadge size={20} color={COLORS.textTertiary} />
            {earnedCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{earnedCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.iconButton}
          >
            <IconSettings size={20} color={COLORS.textTertiary} />
          </Pressable>
        </View>

        {/* Main Title - Large Serif */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.titleSection}>
          <Text style={styles.appTitle}>29天疗愈</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Stage & Day Info */}
        {stage && (
          <Animated.View
            entering={FadeIn.delay(300).duration(600)}
            style={styles.stageSection}
          >
            <Text style={styles.dayText}>第 {currentDay} 天</Text>
            <Text style={styles.stageName}>{stage.name}</Text>
          </Animated.View>
        )}

        {/* Daily Quote — Focal point */}
        <Animated.View entering={FadeIn.delay(600).duration(1000)} style={styles.quoteSection}>
          <Text style={styles.dailyQuote}>
            {DAILY_QUOTES[currentDay - 1] ?? ''}
          </Text>
        </Animated.View>

        {/* Action Area */}
        <View style={styles.actionSection}>
          <Animated.View entering={FadeIn.delay(900).duration(600)} style={animatedButtonStyle}>
            <Link href={`/day/${currentDay}`} asChild>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.zenButton}
              >
                <Text style={styles.zenButtonText}>开始练习</Text>
              </Pressable>
            </Link>
          </Animated.View>
        </View>

        {/* Simplified Journey Map */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(600)}
          style={styles.journeySection}
        >
          <Pressable onPress={toggleJourney} style={styles.journeyToggle}>
            <Text style={styles.journeyToggleText}>
              {journeyExpanded ? '隐于当下' : '见证旅程'}
            </Text>
          </Pressable>
          
          <Animated.View style={animatedJourneyStyle}>
            <JourneyMap
              currentDay={currentDay}
              completedDays={completedDays}
              onDayPress={(day) => router.push(`/day/${day}`)}
              justCompletedDay={justCompleted}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {isFirstTime && <WelcomeOverlay onStart={handleDismissWelcome} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundPulse: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    height: '60%',
    borderRadius: 200,
    backgroundColor: COLORS.primary,
    opacity: 0.03,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING['4xl'],
    paddingBottom: SPACING['6xl'],
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCount: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.textTertiary,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '700',
  },
  titleSection: {
    marginTop: SPACING['6xl'],
    marginBottom: SPACING['4xl'],
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    letterSpacing: 4,
  },
  titleUnderline: {
    width: 20,
    height: 1,
    backgroundColor: COLORS.textTertiary,
    marginTop: SPACING.md,
    opacity: 0.3,
  },
  stageSection: {
    alignItems: 'center',
    marginBottom: SPACING['5xl'],
  },
  dayText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  stageName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
  quoteSection: {
    marginVertical: SPACING['6xl'],
    paddingHorizontal: SPACING.xl,
  },
  dailyQuote: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    lineHeight: 40,
    textAlign: 'center',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  actionSection: {
    marginTop: SPACING['4xl'],
    marginBottom: SPACING['6xl'],
  },
  zenButton: {
    paddingHorizontal: SPACING['4xl'],
    paddingVertical: SPACING.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.textTertiary,
    borderRadius: 30,
  },
  zenButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    letterSpacing: 2,
    fontWeight: '300',
  },
  journeySection: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING['4xl'],
  },
  journeyToggle: {
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
  },
  journeyToggleText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    letterSpacing: 1,
  },
})
