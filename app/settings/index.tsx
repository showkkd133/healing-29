import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '@/stores/userStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useBadgeStore } from '@/stores/badgeStore'
import { exportAllData } from '@/services/dataExport'
import { IconBack, IconForward, IconExport, IconReset, IconWarning } from '@/components/icons'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '@/constants/theme'
import type { DayNumber, PrivacyLevel } from '@/types'

// Privacy level options mapped to store values
const PRIVACY_LEVELS = [
  { id: 'local' as PrivacyLevel, label: '标准', description: '数据存储在本地设备' },
  { id: 'offline' as PrivacyLevel, label: '严格', description: '数据加密且不允许导出' },
] as const

// Stats card color schemes for the journey statistics section
const STATS_COLORS = {
  completed: { bg: `${COLORS.primary}14`, text: COLORS.primary },
  streak: { bg: `${COLORS.accent}14`, text: COLORS.accent },
  badges: { bg: `${COLORS.secondary}66`, text: '#C07878' },
  date: { bg: `${COLORS.border}66`, text: COLORS.textSecondary },
} as const

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // Journey statistics
  const { currentDay, streakDays, createdAt } = useUserStore()
  const dailyLogs = useJourneyStore((s) => s.dailyLogs)
  const earnedCount = useBadgeStore((s) => s.earnedBadges.length)
  const completedDays = Object.keys(dailyLogs).length

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
      {/* Header with centered title and subtle bottom border */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="返回"
        >
          <IconBack size={20} color={COLORS.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.headerBorder} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + SPACING['2xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification settings */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>通知设置</Text>
          </View>
          <View style={[styles.card, SHADOWS.sm]}>
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
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>提醒时间</Text>
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
            )}
          </View>
        </View>

        {/* Privacy settings */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>隐私设置</Text>
          </View>
          <View style={[styles.card, SHADOWS.sm]}>
            {PRIVACY_LEVELS.map((level) => {
              const isSelected = privacyLevel === level.id
              return (
                <Pressable
                  key={level.id}
                  style={[styles.privacyRow, isSelected && styles.privacyRowSelected]}
                  onPress={() => handlePrivacyChange(level.id)}
                >
                  <View style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.privacyTextContainer}>
                    <Text style={styles.privacyLabel}>{level.label}</Text>
                    <Text style={styles.privacyDescription}>
                      {level.description}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Data management */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>数据管理</Text>
          </View>
          <View style={[styles.card, SHADOWS.sm]}>
            <Pressable style={styles.actionRow} onPress={handleExportData} accessibilityRole="button">
              <View style={styles.actionWithIcon}>
                <IconExport size={18} color={COLORS.primary} />
                <Text style={styles.actionText}>导出我的数据</Text>
              </View>
              <IconForward size={16} color={COLORS.primary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.actionRow} onPress={handleResetJourney}>
              <View style={styles.actionWithIcon}>
                <IconReset size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>重置旅程</Text>
              </View>
              <IconForward size={16} color={COLORS.primary} />
            </Pressable>
          </View>

          {/* Danger zone: clear all data as a standalone red card */}
          <Pressable style={[styles.dangerCard, SHADOWS.sm]} onPress={handleClearAllData}>
            <View style={styles.dangerCardContent}>
              <IconWarning size={20} color={COLORS.error} />
              <View style={styles.dangerTextContainer}>
                <Text style={styles.dangerTitle}>清除所有数据</Text>
                <Text style={styles.dangerDescription}>永久删除所有数据，不可撤销</Text>
              </View>
            </View>
            <IconForward size={16} color={COLORS.error} />
          </Pressable>
        </View>

        {/* Journey statistics with individual colored stat cards */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>旅程统计</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={[styles.statsCard, { backgroundColor: STATS_COLORS.completed.bg }]}>
              <Text style={[styles.statsNumber, { color: STATS_COLORS.completed.text }]}>
                {completedDays}/{29}
              </Text>
              <Text style={styles.statsLabel}>已完成天数</Text>
            </View>
            <View style={[styles.statsCard, { backgroundColor: STATS_COLORS.streak.bg }]}>
              <Text style={[styles.statsNumber, { color: STATS_COLORS.streak.text }]}>
                {streakDays}天
              </Text>
              <Text style={styles.statsLabel}>连续打卡</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={[styles.statsCard, { backgroundColor: STATS_COLORS.badges.bg }]}>
              <Text style={[styles.statsNumber, { color: STATS_COLORS.badges.text }]}>
                {earnedCount}枚
              </Text>
              <Text style={styles.statsLabel}>获得徽章</Text>
            </View>
            <View style={[styles.statsCard, { backgroundColor: STATS_COLORS.date.bg }]}>
              <Text style={[styles.statsNumber, { color: STATS_COLORS.date.text }]}>
                {formattedStartDate}
              </Text>
              <Text style={styles.statsLabel}>开始日期</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>关于</Text>
          </View>
          <View style={[styles.card, SHADOWS.sm]}>
            {[
              ['应用名称', '29 天疗愈'],
              ['版本', '1.0.0'],
              ['开发者', 'Healing Studio'],
            ].map(([label, value], i, arr) => (
              <View key={label}>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>{label}</Text>
                  <Text style={styles.aboutValue}>{value}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.divider} />}
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
  // Header: centered larger title with translucent back button
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SPACING.lg,
  },
  headerBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // backArrow style removed — replaced by IconBack SVG component
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  headerSpacer: { width: 40 },

  // Scroll layout
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },

  // Section: indicator bar + normal-size title
  section: { marginBottom: SPACING['3xl'] },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
  },

  // Card with soft shadow
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },

  // Notification row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  rowTextContainer: { flex: 1, marginRight: SPACING.md },
  rowLabel: {
    fontSize: TYPOGRAPHY.fontSize.base + 1,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING['2xs'],
  },
  rowDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  // Time picker
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  timeLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
  },
  timePicker: { flexDirection: 'row', alignItems: 'center' },
  timeButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
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
    fontSize: TYPOGRAPHY.fontSize.md + 1,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    minWidth: 60,
    textAlign: 'center',
  },

  // Privacy radio rows
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  privacyRowSelected: {
    backgroundColor: `${COLORS.primary}0A`,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.textTertiary,
    marginRight: SPACING.md,
    marginTop: SPACING['2xs'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  privacyTextContainer: { flex: 1 },
  privacyLabel: {
    fontSize: TYPOGRAPHY.fontSize.base + 1,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING['2xs'],
  },
  privacyDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },

  // Action rows — unified height and alignment
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: SPACING.lg,
  },
  actionWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.base + 1,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },

  // Danger card for "clear all data" — unified row height
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${COLORS.error}0A`,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: `${COLORS.error}20`,
    minHeight: 52,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },
  dangerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  dangerTextContainer: {
    flex: 1,
  },
  dangerTitle: {
    fontSize: TYPOGRAPHY.fontSize.base + 1,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.error,
    marginBottom: SPACING['2xs'],
  },
  dangerDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: `${COLORS.error}99`,
  },
  // dangerArrow style removed — replaced by IconForward SVG component

  // About rows
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  aboutLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
  },
  aboutValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },

  // Journey statistics — individual colored cards
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  statsNumber: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.xs,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
})
