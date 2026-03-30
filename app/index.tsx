import { useState, useCallback, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  FadeIn,
  FadeInDown,
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
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, GRADIENTS } from '@/constants/theme'
import { getStageByDay } from '@/constants/stages'
import { DAILY_QUOTES } from '@/constants/quotes'
import WelcomeOverlay from '@/components/home/WelcomeOverlay'
import WeatherParticles from '@/components/home/WeatherParticles'
import { IconBadge, IconSettings } from '@/components/icons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TOTAL_DAYS = 29
const JOURNEY_EXPANDED_HEIGHT = 450

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { userId, currentDay, initUser } = useUserStore()
  const scoreHistory = useEmotionStore((s) => s.getScoreHistory())
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const completedDays = Object.keys(dailyLogs).map(Number)

  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)

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
        { duration: 500 },
      )
      return next
    })
  }, [journeyHeight])

  const handleDismissWelcome = () => {
    initUser()
  }

  const buttonScale = useSharedValue(1)
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 300 })
  }, [buttonScale])

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [buttonScale])

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.healing as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <WeatherParticles moodScore={avgMood} />
      
      {/* Dynamic Animated Blobs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BreathingView 
          duration={8000} 
          range={[1, 1.3]} 
          style={[styles.blob, styles.blob1]} 
        />
        <BreathingView 
          duration={10000} 
          range={[1, 1.5]} 
          style={[styles.blob, styles.blob2]} 
        />
        <BreathingView 
          duration={12000} 
          range={[1, 1.2]} 
          style={[styles.blob, styles.blob3]} 
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('/badges')}
            style={styles.iconButton}
          >
            <IconBadge size={22} color={COLORS.textSecondary} />
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
            <IconSettings size={22} color={COLORS.textSecondary} />
          </Pressable>
        </View>

        {/* Main Title Section */}
        <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.titleSection}>
          <Text style={styles.appTitle}>29天疗愈</Text>
          <View style={styles.stageChip}>
            <Text style={styles.dayLabel}>第 {currentDay} 天</Text>
            <View style={styles.dot} />
            <Text style={styles.stageLabel}>{stage?.name}</Text>
          </View>
        </Animated.View>

        {/* Quote Section - The Heart of the UI */}
        <Animated.View entering={FadeIn.delay(400).duration(1200)} style={styles.quoteCard}>
          <View style={styles.quoteMarksContainer}>
            <Text style={styles.quoteMark}>“</Text>
          </View>
          <Text style={styles.dailyQuote}>
            {DAILY_QUOTES[currentDay - 1] ?? ''}
          </Text>
          <View style={[styles.quoteMarksContainer, { alignItems: 'flex-end' }]}>
            <Text style={styles.quoteMark}>”</Text>
          </View>
        </Animated.View>

        {/* Action Area */}
        <View style={styles.actionSection}>
          <Animated.View entering={FadeInDown.delay(800).duration(800).springify()} style={animatedButtonStyle}>
            <Link href={`/day/${currentDay}`} asChild>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <LinearGradient
                  colors={GRADIENTS.primary as any}
                  style={styles.mainButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.mainButtonText}>开始练习</Text>
                </LinearGradient>
              </Pressable>
            </Link>
          </Animated.View>
        </View>

        {/* Journey Map Section */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(800)}
          style={styles.journeySection}
        >
          <Pressable onPress={toggleJourney} style={styles.journeyToggle}>
            <View style={styles.journeyToggleLine} />
            <Text style={styles.journeyToggleText}>
              {journeyExpanded ? '隐于当下' : '见证旅程'}
            </Text>
          </Pressable>
          
          <Animated.View style={animatedJourneyStyle}>
            <View style={styles.journeyMapContainer}>
              <JourneyMap
                currentDay={currentDay}
                completedDays={completedDays}
                onDayPress={(day) => router.push(`/day/${day}`)}
                justCompletedDay={justCompleted}
              />
            </View>
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
    backgroundColor: COLORS.background,
  },
  blob: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.15,
  },
  blob1: {
    width: 300,
    height: 300,
    top: -50,
    left: -50,
    backgroundColor: COLORS.stageRebuild,
  },
  blob2: {
    width: 400,
    height: 400,
    bottom: '20%',
    right: -100,
    backgroundColor: COLORS.stageEnergy,
  },
  blob3: {
    width: 250,
    height: 250,
    top: '30%',
    left: '10%',
    backgroundColor: COLORS.stageDesensitize,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['6xl'],
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  titleSection: {
    marginTop: SPACING['4xl'],
    alignItems: 'center',
    gap: SPACING.md,
  },
  appTitle: {
    fontSize: 36,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    letterSpacing: 6,
    fontWeight: '300',
  },
  stageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dayLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.textTertiary,
    marginHorizontal: SPACING.sm,
  },
  stageLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  quoteCard: {
    marginVertical: SPACING['6xl'],
    paddingHorizontal: SPACING['2xl'],
    alignItems: 'center',
  },
  quoteMarksContainer: {
    width: '100%',
    height: 30,
  },
  quoteMark: {
    fontSize: 48,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.primaryLight,
    opacity: 0.5,
  },
  dailyQuote: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.serif,
    color: COLORS.text,
    lineHeight: 44,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: SPACING.md,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: SPACING['6xl'],
  },
  mainButton: {
    paddingHorizontal: SPACING['5xl'],
    paddingVertical: SPACING.lg,
    borderRadius: 40,
    ...SHADOWS.md,
  },
  mainButtonText: {
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 4,
    fontWeight: '500',
  },
  journeySection: {
    width: '100%',
    alignItems: 'center',
  },
  journeyToggle: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  journeyToggleLine: {
    width: 30,
    height: 1,
    backgroundColor: COLORS.textTertiary,
    marginBottom: SPACING.sm,
    opacity: 0.4,
  },
  journeyToggleText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  journeyMapContainer: {
    width: SCREEN_WIDTH - SPACING.xl * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
})
