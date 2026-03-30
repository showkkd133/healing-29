import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { COLORS, SPACING } from '@/constants/theme'
import GiftBox from './Day8GiftBox'
import LocationReveal from './Day8LocationReveal'
import type { LocationInfo } from './Day8LocationReveal'

// ─── Props ─────────────────────────────────────────────────────────

interface Day8BlindBoxProps {
  readonly onComplete: (data: {
    readonly location: string
    readonly rating: string
  }) => void
}

// ─── Constants ─────────────────────────────────────────────────────

const LOCATIONS: readonly LocationInfo[] = [
  {
    name: '独立书店',
    distance: '步行约8分钟',
    funFact: '书店的气味含有香草醛，和巧克力的气味成分相同',
  },
  {
    name: '花市',
    distance: '骑行约12分钟',
    funFact: '向日葵幼苗真的会追着太阳转，成熟后固定朝东',
  },
  {
    name: '老城区咖啡馆',
    distance: '步行约15分钟',
    funFact: '咖啡最初是被埃塞俄比亚的山羊发现的——它们吃了咖啡果后异常兴奋',
  },
  {
    name: '河边公园',
    distance: '步行约10分钟',
    funFact: '在自然环境中待20分钟，压力荷尔蒙皮质醇会显著下降',
  },
  {
    name: '复古唱片店',
    distance: '骑行约8分钟',
    funFact: '黑胶唱片的沟槽首尾相连可以绕地球好几圈',
  },
] as const

const COMPLETION_TEXT = '无论结果如何，你完成了对自己的承诺'

// ─── Main component ────────────────────────────────────────────────

const Day8BlindBox = React.memo(function Day8BlindBox({
  onComplete,
}: Day8BlindBoxProps) {
  const [opened, setOpened] = useState(false)
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [completed, setCompleted] = useState(false)

  const handleOpen = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * LOCATIONS.length)
    setLocation(LOCATIONS[randomIndex])
    setOpened(true)
  }, [])

  const handleRatingComplete = useCallback((rating: string) => {
    if (!location) return
    setCompleted(true)
    onComplete({
      location: location.name,
      rating,
    })
  }, [location, onComplete])

  // ─── Render: completed state ─────────────────────────────────────

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.completedContainer}>
          <Text style={styles.completedEmoji}>🤝</Text>
          <Text style={styles.completedText}>{COMPLETION_TEXT}</Text>
        </Animated.View>
      </View>
    )
  }

  // ─── Render: opened state ───────────────────────────────────────

  if (opened && location) {
    return (
      <View style={styles.container}>
        <LocationReveal location={location} onComplete={handleRatingComplete} />
      </View>
    )
  }

  // ─── Render: unopened gift box ──────────────────────────────────

  return (
    <View style={styles.container}>
      <GiftBox onOpen={handleOpen} />
    </View>
  )
})

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: SPACING['3xl'],
  },
})

export default Day8BlindBox
