import { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  ScrollView,
  Animated,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '@/stores/userStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { exportAllData } from '@/services/dataExport'
import { IconBack, IconForward } from '@/components/icons'
import { COLORS, TYPOGRAPHY } from '@/constants/theme'
import type { DayNumber, PrivacyLevel } from '@/types'

// Privacy level options mapped to store values
const PRIVACY_LEVELS = [
  { id: 'local' as PrivacyLevel, label: '标准', description: '数据存储在本地设备' },
  { id: 'offline' as PrivacyLevel, label: '严格', description: '数据加密且不允许导出' },
] as const

// Milestone days displayed with labels below dots
const MILESTONES = new Set([7, 14, 21, 29])
const TOTAL_DAYS = 29
const DOT_SPACING = 24

// Pulse animation for the current-day dot
function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.6, duration: 800, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    )
    pulse.start()
    return () => pulse.stop()
  }, [scale, opacity])

  return (
    <Animated.View
      style={[
        tlStyles.pulseRing,
        { transform: [{ scale }], opacity },
      ]}
    />
  )
}

function MiniTimeline({
  currentDay,
  completedDays,
}: {
  readonly currentDay: number
  readonly completedDays: readonly number[]
}) {
  const completedSet = new Set(completedDays)

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={tlStyles.container}>
        {/* Background line */}
        <View style={tlStyles.line} />
        {/* Day dots */}
        {Array.from({ length: TOTAL_DAYS }, (_, i) => {
          const day = i + 1
          const isCompleted = completedSet.has(day)
          const isCurrent = day === currentDay
          const isMilestone = MILESTONES.has(day)

          return (
            <View key={day} style={tlStyles.dotColumn}>
              <View style={tlStyles.dotWrapper}>
                {isCurrent && <PulseDot />}
                <View
                  style={[
                    tlStyles.dot,
                    isCompleted && tlStyles.dotCompleted,
                    isCurrent && tlStyles.dotCurrent,
                    !isCompleted && !isCurrent && tlStyles.dotPending,
                  ]}
                />
              </View>
              {isMilestone && (
                <Text style={tlStyles.milestoneLabel}>Day{day}</Text>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

// Timeline-specific styles
const tlStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 16,
    height: 64,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: 20,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dotColumn: {
    width: DOT_SPACING,
    alignItems: 'center',
  },
  dotWrapper: {
    width: DOT_SPACING,
    height: DOT_SPACING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotCompleted: {
    backgroundColor: COLORS.primary,
  },
  dotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  dotPending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pulseRing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  milestoneLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
})

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Journey statistics
  const { currentDay, streakDays, createdAt } = useUserStore()
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)
  const completedDayCount = Object.keys(dailyLogs).length
  const completedDayList = Object.keys(dailyLogs).map(Number)

  // Format start date
  const formattedStartDate = createdAt
    ? createdAt.slice(0, 10)
    : '\u2014'

  // Read from store
  const notificationTime = useUserStore((s) => s.notificationTime)
  const privacyLevel = useUserStore((s) => s.privacyLevel)
  const updatePreferences = useUserStore((s) => s.updatePreferences)

  // Derive notification state from store
  const notificationHour = notificationTime !== 'off'
    ? parseInt(notificationTime.split(':')[0], 10)
    : 20
  const notificationEnabled = notificationTime !== 'off'

  const handleToggleNotification = (enabled: boolean) => {
    updatePreferences({
      notificationTime: enabled ? `${String(notificationHour || 20).padStart(2, '0')}:00` : 'off',
    })
  }

  const handleTimeChange = (delta: number) => {
    const current = notificationHour
    let next = current + delta
    if (next < 0) next = 23
    if (next > 23) next = 0
    updatePreferences({ notificationTime: `${String(next).padStart(2, '0')}:00` })
  }

  const handlePrivacyChange = (level: PrivacyLevel) => {
    updatePreferences({ privacyLevel: level })
  }

  const handleExportData = async () => {
    try {
      await exportAllData()
    } catch (error) {
      Alert.alert('导出失败', '请稍后重试')
    }
  }

  const handleResetJourney = () => {
    Alert.alert(
      '重置旅程',
      '这将把旅程进度重置为第 1 天，但会保留你的偏好设置。确定要继续吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '重置',
          style: 'destructive',
          onPress: () => {
            // Reset journey progress only, keep preferences
            useUserStore.setState({
              currentDay: 1 as DayNumber,
              streakDays: 0,
            })
            useJourneyStore.setState({ dailyLogs: {}, currentDayData: null, isCompleted: false })
            useEmotionStore.setState({ records: [] })
            Alert.alert('已重置', '旅程已重置为第 1 天。')
          },
        },
      ],
    )
  }

  const handleClearAllData = () => {
    Alert.alert(
      '清除所有数据',
      '这将永久删除所有数据，包括旅程进度、情绪记录和偏好设置。此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear()
              // Reset all stores to initial state
              useUserStore.setState({
                userId: null,
                currentDay: 1 as DayNumber,
                streakDays: 0,
                createdAt: null,
                notificationTime: '20:00',
                privacyLevel: 'local',
              })
              useJourneyStore.setState({ dailyLogs: {}, currentDayData: null, isCompleted: false })
              useEmotionStore.setState({ records: [] })
              useBadgeStore.setState({ earnedBadges: [] })
              Alert.alert('已清除', '所有数据已被删除。')
            } catch (error) {
              Alert.alert('清除失败', '无法清除数据，请稍后重试。')
            }
          },
        },
      ],
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Minimal header: back icon + centered title */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="返回"
        >
          <IconBack size={20} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知设置</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>每日提醒</Text>
                <Text style={styles.rowDescription}>
                  在设定时间提醒你完成当日任务
                </Text>
              </View>
              <Switch
                value={notificationEnabled}
                onValueChange={handleToggleNotification}
                trackColor={{ false: COLORS.border, true: `${COLORS.primary}66` }}
                thumbColor={notificationEnabled ? COLORS.primary : COLORS.textTertiary}
                accessibilityRole="switch"
                accessibilityLabel="每日提醒"
              />
            </View>

            {notificationEnabled && (
              <>
                <View style={styles.divider} />
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>提醒时间</Text>
                  <View style={styles.timePicker}>
                    <Pressable
                      style={styles.timeButton}
                      onPress={() => handleTimeChange(-1)}
                    >
                      <Text style={styles.timeButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.timeValue}>
                      {String(notificationHour).padStart(2, '0')}:00
                    </Text>
                    <Pressable
                      style={styles.timeButton}
                      onPress={() => handleTimeChange(1)}
                    >
                      <Text style={styles.timeButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Privacy settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>隐私设置</Text>
          <View style={styles.card}>
            {PRIVACY_LEVELS.map((level, i) => {
              const isSelected = privacyLevel === level.id
              return (
                <View key={level.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <Pressable
                    style={styles.row}
                    onPress={() => handlePrivacyChange(level.id)}
                  >
                    <View style={styles.radioRow}>
                      <View style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <View style={styles.rowTextContainer}>
                        <Text style={styles.rowLabel}>{level.label}</Text>
                        <Text style={styles.rowDescription}>
                          {level.description}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </View>
              )
            })}
          </View>
        </View>

        {/* Data management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          <View style={styles.card}>
            <Pressable style={styles.listRow} onPress={handleExportData} accessibilityRole="button">
              <Text style={styles.listRowText}>导出我的数据</Text>
              <IconForward size={16} color={COLORS.textTertiary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.listRow} onPress={handleResetJourney}>
              <Text style={styles.listRowText}>重置旅程</Text>
              <IconForward size={16} color={COLORS.textTertiary} />
            </Pressable>
          </View>
        </View>

        {/* Danger zone: plain list rows with error-colored text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>危险操作</Text>
          <View style={styles.card}>
            <Pressable style={styles.listRow} onPress={handleClearAllData}>
              <Text style={styles.dangerText}>清除所有数据</Text>
              <IconForward size={16} color={COLORS.error} />
            </Pressable>
          </View>
        </View>

        {/* Journey statistics as iOS Settings-style list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>旅程统计</Text>
          <View style={styles.card}>
            {([
              ['已完成天数', `${completedDayCount}/29`],
              ['连续打卡', `${streakDays} 天`],
              ['获得徽章', `${earnedCount} 枚`],
              ['开始日期', formattedStartDate],
            ] as const).map(([label, value], i, arr) => (
              <View key={label}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.listRow}>
                  <Text style={styles.listRowText}>{label}</Text>
                  <Text style={styles.listRowValue}>{value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Mini healing timeline */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <MiniTimeline
              currentDay={currentDay}
              completedDays={completedDayList}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <View style={styles.card}>
            {([
              ['应用名称', '29 天疗愈'],
              ['版本', '1.0.0'],
              ['开发者', 'Healing Studio'],
            ] as const).map(([label, value], i) => (
              <View key={label}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.listRow}>
                  <Text style={styles.listRowText}>{label}</Text>
                  <Text style={styles.listRowValue}>{value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Minimal header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  headerSpacer: { width: 40 },

  // Scroll layout
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Section: plain text title, no indicator bar
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
    marginTop: 32,
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  // Card: white bg + border, no shadow
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  // Generic row used for notification and privacy sections
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowTextContainer: { flex: 1, marginRight: 12 },
  rowLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  // Radio layout within a row
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textTertiary,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  // Time picker
  timePicker: { flexDirection: 'row', alignItems: 'center' },
  timeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  timeValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginHorizontal: 16,
    minWidth: 60,
    textAlign: 'center',
  },

  // iOS Settings-style list row: left label, right value/arrow
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
  },
  listRowText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
  },
  listRowValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },

  // Danger text within a plain list row
  dangerText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.error,
  },

  // Shared divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
})
