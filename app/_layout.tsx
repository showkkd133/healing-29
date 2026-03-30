import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import BadgeToast from '@/components/shared/BadgeToast'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { useUserStore } from '@/stores/userStore'
import { scheduleDailyReminder } from '@/services/notifications'
import { initEncryption } from '@/utils/storage'
import { COLORS } from '@/constants/theme'

// Keep splash screen visible until store hydration completes
SplashScreen.preventAutoHideAsync()

// Root layout with global Stack navigation and SafeAreaProvider
export default function RootLayout() {
  const hasHydrated = useUserStore((s) => s._hasHydrated)
  const notificationTime = useUserStore((s) => s.notificationTime)

  // Initialize encryption key before store hydration reads/writes
  useEffect(() => {
    initEncryption()
  }, [])

  // Hide splash screen once store is hydrated
  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync()
    }
  }, [hasHydrated])

  // Schedule daily reminder based on user preference
  useEffect(() => {
    if (notificationTime && notificationTime !== 'off') {
      const [hourStr, minuteStr] = notificationTime.split(':')
      const hour = parseInt(hourStr, 10)
      const minute = parseInt(minuteStr, 10)
      scheduleDailyReminder(hour, minute)
    }
  }, [notificationTime])

  // Don't render until store hydration is complete
  if (!hasHydrated) return null

  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { 
            backgroundColor: COLORS.background,
          },
          headerShadowVisible: false,
          headerTintColor: COLORS.text,
          headerTitleStyle: { 
            fontWeight: '600',
            color: COLORS.text,
          },
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'fade_from_bottom',
          animationDuration: 250,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="day"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="summary"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="badges"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="settings/index"
          options={{ headerShown: false }}
        />
      </Stack>
      <BadgeToast />
    </SafeAreaProvider>
    </ErrorBoundary>
  )
}
