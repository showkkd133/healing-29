import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { SchedulableTriggerInputTypes } from 'expo-notifications'

// Skip notification setup on web (not supported)
if (Platform.OS !== 'web') {
// Configure foreground notification behaviour
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.DEFAULT,
  }),
})
} // end Platform.OS !== 'web'

// Request notification permissions, returns true when granted
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  return finalStatus === 'granted'
}

// Schedule a daily reminder at the given hour:minute
export async function scheduleDailyReminder(
  hour: number,
  minute: number = 0,
): Promise<string | null> {
  await cancelDailyReminder()

  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return null

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '今日疗愈任务',
        body: '新的一天，新的开始。花几分钟完成今天的任务吧。',
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    })

    return id
  } catch (error) {
    console.error('Failed to schedule daily reminder:', error)
    return null
  }
}

// Cancel all scheduled notifications
export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return
  await Notifications.cancelAllScheduledNotificationsAsync()
}

// Return all currently scheduled notifications (useful for debugging)
export async function getScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync()
}
