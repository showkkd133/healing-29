import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'
import { Feather } from '@expo/vector-icons'
import { COLORS, SPACING } from '@/constants/theme'
import { ZenButton } from '../ui/ZenButton'
import { ZenTypography } from '../ui/ZenTypography'

interface Day4SealedViewProps {
  readonly itemCount: number
  readonly sealDate: string
  readonly onComplete: () => void
}

/**
 * Day4SealedView: Shown after items are sealed into the virtual box.
 * Refined with vector icons and standardized Zen components.
 */
const Day4SealedView = React.memo(function Day4SealedView({
  itemCount,
  sealDate,
  onComplete,
}: Day4SealedViewProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Animated.View entering={ZoomIn.delay(200).duration(500)} style={styles.iconContainer}>
          <Feather name="lock" size={64} color={COLORS.primary} />
        </Animated.View>
        
        <ZenTypography variant="bold" size="xl" color="text" style={styles.title}>
          已封存
        </ZenTypography>
        
        <ZenTypography variant="medium" size="base" color="textSecondary" align="center" style={styles.info}>
          {itemCount} 件物品已收好{'\n'}封存至 {sealDate}
        </ZenTypography>
        
        <ZenButton
          title="完成今日练习"
          variant="primary"
          size="md"
          onPress={onComplete}
          style={styles.button}
        />
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['3xl'],
  },
  iconContainer: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundPositive,
    borderRadius: 100,
  },
  title: {
    marginBottom: SPACING.md,
  },
  info: {
    lineHeight: 26,
    marginBottom: SPACING['4xl'],
  },
  button: {
    minWidth: 180,
  },
})

export default Day4SealedView
