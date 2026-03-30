import * as Sharing from 'expo-sharing'
import { Platform } from 'react-native'
import { File, Paths } from 'expo-file-system'
import { useUserStore } from '@/stores/userStore'
import { useEmotionStore } from '@/stores/emotionStore'
import { useJourneyStore } from '@/stores/journeyStore'
import { useBadgeStore } from '@/stores/badgeStore'

// Collect all store data into a serializable object
const collectData = () => ({
  exportedAt: new Date().toISOString(),
  version: '1.0.0',
  user: {
    userId: useUserStore.getState().userId,
    currentDay: useUserStore.getState().currentDay,
    streakDays: useUserStore.getState().streakDays,
    createdAt: useUserStore.getState().createdAt,
  },
  emotions: useEmotionStore.getState().records,
  journey: useJourneyStore.getState().dailyLogs,
  badges: useBadgeStore.getState().earnedBadges,
})

export const exportAllData = async (): Promise<void> => {
  const jsonString = JSON.stringify(collectData(), null, 2)

  // Web fallback: download via blob
  if (Platform.OS === 'web') {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `healing-29-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    return
  }

  // Native: write to document directory using expo-file-system v19 API
  const fileName = `healing-29-export-${new Date().toISOString().slice(0, 10)}.json`
  const file = new File(Paths.document, fileName)
  file.create({ overwrite: true })
  file.write(jsonString)

  const isAvailable = await Sharing.isAvailableAsync()
  if (isAvailable) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: '导出疗愈数据',
    })
  }
}
