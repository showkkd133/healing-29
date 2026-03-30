import React, { useMemo } from 'react'
import {
  View, Text, ScrollView, Pressable, FlatList, Dimensions, Alert,
} from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Polyline, Circle, Text as SvgText } from 'react-native-svg'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { BADGES, getBadgeById } from '@/constants/badges'
import { exportAllData } from '@/services/dataExport'
import { COLORS, SPACING } from '@/constants/theme'
import {
  styles, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING, STATS_CARD_COLORS,
} from '@/components/summary/styles'

const MAX_VISIBLE_BADGES = 8

// -- Encouragement copy keyed by trend direction --
const ENCOURAGEMENT: Record<string, string> = {
  improving: '从第 1 天的风暴，到今天的彩虹。你比想象中更坚强。',
  stable: '你一步一步走过了 29 天，保持了内心的平稳。这本身就是一种力量。',
  declining: '即使情绪起伏不定，你依然坚持走完了全程。勇气不是没有恐惧，而是带着恐惧继续前行。',
}

// -- Sub-components --

function CelebrationHeader() {
  return (
    <View style={styles.celebrationContainer}>
      <View style={styles.gradientOverlay} />
      <Text style={styles.celebrationEmoji}>🦋</Text>
      <Text style={styles.celebrationTitle}>你做到了</Text>
      <Text style={styles.celebrationSubtitle}>29 天疗愈之旅，圆满完成</Text>
      {/* Decorative gold line */}
      <View style={styles.goldLine} />
    </View>
  )
}

function StatsCard({
  value, label, index,
}: {
  readonly value: string
  readonly label: string
  readonly index: number
}) {
  const colorScheme = STATS_CARD_COLORS[index] ?? STATS_CARD_COLORS[0]
  return (
    <View style={[styles.statsCard, { backgroundColor: colorScheme.bg }]}>
      <View style={[styles.statsCardStripe, { backgroundColor: colorScheme.accent }]} />
      <Text style={[styles.statsValue, { color: colorScheme.accent }]}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  )
}

function StatsRow({
  completedDays, streakDays, badgeCount,
}: {
  readonly completedDays: number; readonly streakDays: number; readonly badgeCount: number
}) {
  return (
    <View style={styles.statsRow}>
      {/* Stagger each stats card individually */}
      <Animated.View entering={FadeIn.delay(200).duration(400).withInitialValues({ transform: [{ translateY: 20 }] })} style={{ flex: 1 }}>
        <StatsCard value={`${completedDays}/29`} label="完成天数" index={0} />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(300).duration(400).withInitialValues({ transform: [{ translateY: 20 }] })} style={{ flex: 1 }}>
        <StatsCard value={`${streakDays}`} label="连续打卡" index={1} />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(400).duration(400).withInitialValues({ transform: [{ translateY: 20 }] })} style={{ flex: 1 }}>
        <StatsCard value={`${badgeCount}`} label="获得徽章" index={2} />
      </Animated.View>
    </View>
  )
}

function MoodChart({ data }: { readonly data: ReadonlyArray<{ day: number; score: number }> }) {
  if (data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>情绪变化曲线</Text>
        <Text style={styles.emptyText}>暂无情绪数据</Text>
      </View>
    )
  }

  const plotW = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const plotH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom

  const points = data.map((d) => ({
    x: CHART_PADDING.left + ((d.day - 1) / 28) * plotW,
    y: CHART_PADDING.top + plotH - ((d.score - 1) / 9) * plotH,
    score: d.score,
  }))

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')
  const first = points[0]
  const last = points[points.length - 1]

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>情绪变化曲线</Text>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Polyline
          points={polyline}
          fill="none"
          stroke={COLORS.primary}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Start point with label */}
        <Circle cx={first.x} cy={first.y} r={5} fill={COLORS.secondary} stroke="#FFFFFF" strokeWidth={1.5} />
        <SvgText x={first.x + 8} y={first.y - 8} fontSize={11} fill={COLORS.textSecondary} textAnchor="start">
          起点 {first.score}
        </SvgText>
        {/* End point with label */}
        <Circle cx={last.x} cy={last.y} r={5} fill={COLORS.accent} stroke="#FFFFFF" strokeWidth={1.5} />
        <SvgText x={last.x - 8} y={last.y - 8} fontSize={11} fill={COLORS.textSecondary} textAnchor="end">
          终点 {last.score}
        </SvgText>
        <SvgText x={CHART_PADDING.left} y={CHART_HEIGHT - 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="start">
          Day 1
        </SvgText>
        <SvgText x={CHART_WIDTH - CHART_PADDING.right} y={CHART_HEIGHT - 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="end">
          Day 29
        </SvgText>
      </Svg>
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
      <Text style={styles.encouragementText}>「{text}」</Text>
    </View>
  )
}

function ActionButtons({ onExport, onGoHome }: { readonly onExport: () => void; readonly onGoHome: () => void }) {
  return (
    <View style={styles.actionContainer}>
      {/* Export uses ghost style */}
      <Pressable style={styles.ghostButton} onPress={onExport}>
        <Text style={styles.ghostButtonText}>导出旅程报告</Text>
      </Pressable>
      {/* Home uses primary filled style */}
      <Pressable style={styles.primaryButton} onPress={onGoHome}>
        <Text style={styles.primaryButtonText}>返回首页</Text>
      </Pressable>
    </View>
  )
}

function FooterSignature() {
  return (
    <View style={styles.footerSignature}>
      <Text style={styles.footerSignatureText}>29天疗愈 × 你的名字</Text>
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
        {/* Celebration section */}
        <Animated.View entering={FadeIn.duration(600)}>
          <CelebrationHeader />
        </Animated.View>
        {/* Stats cards with SlideInUp */}
        <Animated.View entering={SlideInUp.delay(200).duration(400)}>
          <StatsRow completedDays={completedDays} streakDays={streakDays} badgeCount={earnedBadges.length} />
        </Animated.View>
        {/* Mood chart */}
        <Animated.View entering={FadeIn.delay(500).duration(500)}>
          <MoodChart data={scoreHistory} />
        </Animated.View>
        {/* Badge list */}
        <Animated.View entering={FadeIn.delay(700).duration(400)}>
          <BadgeList earnedBadges={earnedBadges} />
        </Animated.View>
        {/* Encouragement text */}
        <Animated.View entering={FadeIn.delay(900).duration(500)}>
          <EncouragementBlock direction={trend.direction} />
        </Animated.View>
        {/* Action buttons */}
        <Animated.View entering={FadeIn.delay(1100).duration(400)}>
          <ActionButtons onExport={handleExport} onGoHome={handleGoHome} />
        </Animated.View>
        {/* Footer signature */}
        <Animated.View entering={FadeIn.delay(1300).duration(400)}>
          <FooterSignature />
        </Animated.View>
      </ScrollView>
    </View>
  )
}
