import React, { useMemo, useState, useEffect } from 'react'
import {
  View, Text, ScrollView, Pressable, FlatList, Alert,
} from 'react-native'
import Animated, {
  FadeIn, useSharedValue, useAnimatedStyle, withSpring,
  withDelay,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Polyline, Text as SvgText, Line } from 'react-native-svg'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES, getBadgeById } from '@/constants/badges'
import { exportAllData } from '@/services/dataExport'
import { IconButterfly, IconExport } from '@/components/icons'
import { COLORS } from '@/constants/theme'
import {
  styles, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING,
} from '@/components/summary/styles'

const MAX_VISIBLE_BADGES = 8

// Stagger delay between animated sections (ms)
const STAGGER_DELAY = 100

// Encouragement copy keyed by trend direction
const ENCOURAGEMENT: Record<string, string> = {
  improving: '从第 1 天的风暴，到今天的彩虹。你比想象中更坚强。',
  stable: '你一步一步走过了 29 天，保持了内心的平稳。这本身就是一种力量。',
  declining: '即使情绪起伏不定，你依然坚持走完了全程。勇气不是没有恐惧，而是带着恐惧继续前行。',
}

// -- Sub-components --

function CelebrationHeader() {
  return (
    <View style={styles.celebrationContainer}>
      <View style={styles.celebrationIcon}>
        <IconButterfly size={48} color={COLORS.accent} />
      </View>
      <Text style={styles.celebrationTitle}>你做到了</Text>
      <Text style={styles.celebrationSubtitle}>29 天疗愈之旅，圆满完成</Text>
    </View>
  )
}

// Single stat item — number + label
function StatsItem({
  value, label,
}: {
  readonly value: string
  readonly label: string
}) {
  return (
    <View style={styles.statsItem}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  )
}

function StatsRow({
  completedDays, streakDays, badgeCount,
}: {
  readonly completedDays: number
  readonly streakDays: number
  readonly badgeCount: number
}) {
  return (
    <View style={styles.statsRow}>
      <StatsItem value={`${completedDays}`} label="天" />
      <View style={styles.statsDivider} />
      <StatsItem value={`${streakDays}`} label="天连续" />
      <View style={styles.statsDivider} />
      <StatsItem value={`${badgeCount}`} label="枚徽章" />
    </View>
  )
}

// Animated data point that scales in when it first appears
function AnimatedDataPoint({
  cx, cy, isEndpoint, color, delay,
}: {
  readonly cx: number
  readonly cy: number
  readonly isEndpoint: boolean
  readonly color: string
  readonly delay: number
}) {
  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 180 }))
  }, [delay, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: cx - (isEndpoint ? 5 : 3),
    top: cy - (isEndpoint ? 5 : 3),
    width: isEndpoint ? 10 : 6,
    height: isEndpoint ? 10 : 6,
    borderRadius: isEndpoint ? 5 : 3,
    backgroundColor: color,
    borderWidth: isEndpoint ? 1.5 : 0,
    borderColor: '#FFFFFF',
    transform: [{ scale: scale.value }],
  }))

  return <Animated.View style={animatedStyle} />
}

// Total animation duration for the chart drawing (ms)
const CHART_DRAW_DURATION = 2000
// Delay before chart animation starts (ms)
const CHART_DRAW_DELAY = 1000

function MoodChart({ data }: { readonly data: ReadonlyArray<{ day: number; score: number }> }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [animationDone, setAnimationDone] = useState(false)

  const points = useMemo(() => {
    if (data.length === 0) return []
    const plotW = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
    const plotH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom
    return data.map((d) => ({
      x: CHART_PADDING.left + ((d.day - 1) / 28) * plotW,
      y: CHART_PADDING.top + plotH - ((d.score - 1) / 9) * plotH,
      score: d.score,
    }))
  }, [data])

  // Progressive reveal: show one more point at each tick
  useEffect(() => {
    if (points.length === 0) return

    // Start with the first point visible after delay
    const startTimer = setTimeout(() => {
      setVisibleCount(1)

      if (points.length <= 1) {
        setAnimationDone(true)
        return
      }

      const intervalMs = CHART_DRAW_DURATION / (points.length - 1)
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          const next = prev + 1
          if (next >= points.length) {
            clearInterval(interval)
            setAnimationDone(true)
            return points.length
          }
          return next
        })
      }, intervalMs)

      // Cleanup interval on unmount
      return () => clearInterval(interval)
    }, CHART_DRAW_DELAY)

    return () => clearTimeout(startTimer)
  }, [points.length])

  if (data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>情绪变化曲线</Text>
        <Text style={styles.emptyText}>暂无情绪数据</Text>
      </View>
    )
  }

  const visiblePoints = points.slice(0, visibleCount)
  const polyline = visiblePoints.map((p) => `${p.x},${p.y}`).join(' ')

  const first = points[0]
  const last = points[points.length - 1]

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>成长轨迹回放</Text>
      <View>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Axis labels — always visible */}
          <SvgText
            x={CHART_PADDING.left}
            y={CHART_HEIGHT - 4}
            fontSize={10}
            fill={COLORS.textTertiary}
            textAnchor="start"
          >
            Day 1
          </SvgText>
          <SvgText
            x={CHART_WIDTH - CHART_PADDING.right}
            y={CHART_HEIGHT - 4}
            fontSize={10}
            fill={COLORS.textTertiary}
            textAnchor="end"
          >
            Day 29
          </SvgText>

          {/* Baseline grid line */}
          <Line
            x1={CHART_PADDING.left}
            y1={CHART_HEIGHT - CHART_PADDING.bottom}
            x2={CHART_WIDTH - CHART_PADDING.right}
            y2={CHART_HEIGHT - CHART_PADDING.bottom}
            stroke={COLORS.border}
            strokeWidth={0.5}
          />

          {/* Animated polyline — only rendered points so far */}
          {visiblePoints.length >= 2 && (
            <Polyline
              points={polyline}
              fill="none"
              stroke={COLORS.primary}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Endpoint labels — appear after animation completes */}
          {animationDone && (
            <>
              <SvgText
                x={first.x + 8}
                y={first.y - 8}
                fontSize={11}
                fill={COLORS.textSecondary}
                textAnchor="start"
              >
                起点 {first.score}
              </SvgText>
              <SvgText
                x={last.x - 8}
                y={last.y - 8}
                fontSize={11}
                fill={COLORS.textSecondary}
                textAnchor="end"
              >
                终点 {last.score}
              </SvgText>
            </>
          )}
        </Svg>

        {/* Animated data point circles (overlaid via absolute positioning) */}
        {visiblePoints.map((p, i) => {
          const isFirst = i === 0
          const isLast = i === points.length - 1 && animationDone
          const isEndpoint = isFirst || isLast
          const color = isFirst
            ? COLORS.secondary
            : isLast
              ? COLORS.accent
              : COLORS.primary
          return (
            <AnimatedDataPoint
              key={`pt-${data[i].day}`}
              cx={p.x}
              cy={p.y}
              isEndpoint={isEndpoint}
              color={color}
              delay={0}
            />
          )
        })}
      </View>

      {/* Journey arrow label — fades in after drawing completes */}
      {animationDone && (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.journeyArrowContainer}
        >
          <Text style={styles.journeyArrowText}>
            起点 → 终点
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

function BadgeItem({ emoji, name }: { readonly emoji: string; readonly name: string }) {
  return (
    <View style={styles.badgeItem}>
      <Text style={styles.badgeEmoji}>{emoji}</Text>
      <Text style={styles.badgeName} numberOfLines={1}>{name}</Text>
    </View>
  )
}

function BadgeList({ earnedBadges }: { readonly earnedBadges: ReadonlyArray<{ badgeId: string }> }) {
  const router = useRouter()

  const visibleBadges = useMemo(() => {
    const resolved = earnedBadges.map((eb) => {
      const badge = getBadgeById(eb.badgeId)
      const fallback = BADGES.find((b) => b.id === eb.badgeId)
      return badge ?? fallback
    }).filter(Boolean) as ReadonlyArray<{ icon: string; name: string; id: string }>
    return resolved.slice(0, MAX_VISIBLE_BADGES)
  }, [earnedBadges])

  const overflow = earnedBadges.length - MAX_VISIBLE_BADGES

  if (earnedBadges.length === 0) return null

  return (
    <View style={styles.badgeSection}>
      <Text style={styles.sectionTitle}>获得的徽章</Text>
      <FlatList
        horizontal
        data={visibleBadges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BadgeItem emoji={item.icon} name={item.name} />}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={
          overflow > 0 ? (
            <Pressable style={styles.badgeOverflow} onPress={() => router.push('/badges')}>
              <Text style={styles.badgeOverflowText}>+{overflow}</Text>
            </Pressable>
          ) : null
        }
        contentContainerStyle={styles.badgeListContent}
      />
    </View>
  )
}

function EncouragementBlock({ direction }: { readonly direction: string }) {
  const text = ENCOURAGEMENT[direction] ?? ENCOURAGEMENT.improving
  return (
    <View style={styles.encouragementContainer}>
      <Text style={styles.encouragementText}>{text}</Text>
    </View>
  )
}

function ActionButtons({ onExport, onGoHome }: { readonly onExport: () => void; readonly onGoHome: () => void }) {
  return (
    <View style={styles.actionContainer}>
      {/* Primary button on top */}
      <Pressable style={styles.primaryButton} onPress={onGoHome}>
        <Text style={styles.primaryButtonText}>返回首页</Text>
      </Pressable>
      {/* Ghost button below */}
      <Pressable style={styles.ghostButton} onPress={onExport}>
        <IconExport size={18} color={COLORS.primary} />
        <Text style={styles.ghostButtonText}>导出旅程报告</Text>
      </Pressable>
    </View>
  )
}

// -- Main screen --

export default function SummaryScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const streakDays = useUserStore((s) => s.streakDays)
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const earnedBadges = useBadgeStore((s) => s.earnedBadges)
  const getScoreHistory = useEmotionStore((s) => s.getScoreHistory)
  const calculateTrend = useEmotionStore((s) => s.calculateTrend)

  const completedDays = Object.keys(dailyLogs).length
  const scoreHistory = useMemo(() => getScoreHistory(), [getScoreHistory])
  const trend = useMemo(() => calculateTrend(), [calculateTrend])

  const handleExport = async () => {
    try {
      await exportAllData()
    } catch (error) {
      Alert.alert('导出失败', '请稍后重试')
    }
  }

  const handleGoHome = () => {
    router.replace('/')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Celebration */}
        <Animated.View entering={FadeIn.duration(300)}>
          <CelebrationHeader />
        </Animated.View>
        {/* Stats */}
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY).duration(300)}>
          <StatsRow completedDays={completedDays} streakDays={streakDays} badgeCount={earnedBadges.length} />
        </Animated.View>
        {/* Mood chart */}
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 2).duration(300)}>
          <MoodChart data={scoreHistory} />
        </Animated.View>
        {/* Badge list */}
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 3).duration(300)}>
          <BadgeList earnedBadges={earnedBadges} />
        </Animated.View>
        {/* Encouragement */}
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 4).duration(300)}>
          <EncouragementBlock direction={trend.direction} />
        </Animated.View>
        {/* Actions */}
        <Animated.View entering={FadeIn.delay(STAGGER_DELAY * 5).duration(300)}>
          <ActionButtons onExport={handleExport} onGoHome={handleGoHome} />
        </Animated.View>
      </ScrollView>
    </View>
  )
}
