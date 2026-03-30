// NOTE: Not currently imported by any component — candidate for integration or removal
import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS } from '../../constants/theme'

interface GuidanceTextProps {
  text: string
  delay?: number
}

// Centered guidance text with warm tones and fade-in animation
const GuidanceText = React.memo(function GuidanceText({
  text,
  delay = 300,
}: GuidanceTextProps) {
  return (
    <Animated.Text
      entering={FadeIn.delay(delay).duration(600)}
      style={styles.text}
    >
      {text}
    </Animated.Text>
  )
})

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
})

export default GuidanceText
