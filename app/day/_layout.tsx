import { Stack } from 'expo-router'
import { COLORS } from '@/constants/theme'

// Day pages stack layout with transparent header and back button
export default function DayLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitle: '',
        headerTintColor: COLORS.primary,
        headerBackTitle: '返回',
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
        animationDuration: 200,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    />
  )
}
