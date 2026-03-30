// NOTE: Not currently imported by any component — candidate for integration or removal
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { COLORS } from '../../constants/theme'

interface SafeScreenProps {
  children: React.ReactNode
  style?: ViewStyle
}

// Safe area screen wrapper with background color and status bar configuration
const SafeScreen = React.memo(function SafeScreen({
  children,
  style,
}: SafeScreenProps) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar style="dark" />
      {children}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
})

export default SafeScreen
