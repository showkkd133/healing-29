// NOTE: Not currently imported by any component — candidate for integration or removal
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme'
import ProgressBar from './ProgressBar'

interface DayHeaderProps {
  dayNumber: number
  theme: string
  title: string
}

// Top section for each day screen: day counter, progress bar, and theme title
const DayHeader = React.memo(function DayHeader({
  dayNumber,
  theme,
  title,
}: DayHeaderProps) {
  const progress = dayNumber / 29

  return (
    <View style={styles.container}>
      <View style={styles.dayRow}>
        <Text style={styles.dayText}>Day {dayNumber}</Text>
        <Text style={styles.totalText}>/ 29</Text>
      </View>
      <ProgressBar progress={progress} color={COLORS.primary} height={6} />
      <Text style={styles.theme}>{theme}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  dayText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  theme: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
})

export default DayHeader
