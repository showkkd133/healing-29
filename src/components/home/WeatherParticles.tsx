import { useMemo } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withDelay, Easing,
} from 'react-native-reanimated'
import { COLORS } from '@/constants/theme'

interface WeatherParticlesProps {
  moodScore: number // 1-10, 0 means no data
}

type WeatherType = 'storm' | 'cloudy' | 'clearing' | 'sunny' | 'rainbow'

interface ParticleConfig {
  size: number; x: number; y: number; color: string
  duration: number; delay: number; dx: number; dy: number
  opacity: number; borderRadius: number; rotation: number
}

const getWeatherType = (mood: number): WeatherType => {
  if (mood <= 2) return 'storm'
  if (mood <= 4) return 'cloudy'
  if (mood <= 6) return 'clearing'
  if (mood <= 8) return 'sunny'
  return 'rainbow'
}

const getWeatherColors = (mood: number) => {
  if (mood <= 2) return { bg: '#E8EDF2', particle: COLORS.mood2 }
  if (mood <= 4) return { bg: '#EDF0F5', particle: COLORS.mood4 }
  if (mood <= 6) return { bg: '#F0F4F7', particle: COLORS.mood6 }
  if (mood <= 8) return { bg: '#F8F6F0', particle: COLORS.mood8 }
  return { bg: '#FAF8F5', particle: COLORS.mood10 }
}

const RAINBOW = [COLORS.mood6, COLORS.mood7, COLORS.mood8, COLORS.mood9, COLORS.mood10]

const rand = (min: number, max: number) => min + Math.random() * (max - min)

// Build particle configs per weather type
const generateParticles = (
  weather: WeatherType, color: string, w: number, h: number,
): ParticleConfig[] =>
  Array.from({ length: 10 }, (_, i) => {
    const base = { x: rand(0, w), y: rand(0, h), delay: i * 300, rotation: 0 }
    switch (weather) {
      case 'storm': return {
        ...base, size: 2, color, duration: rand(800, 1200),
        dx: rand(-100, -60), dy: h, borderRadius: 1,
        opacity: rand(0.5, 0.8), rotation: -20, y: -20,
      }
      case 'cloudy': return {
        ...base, size: rand(30, 60), color, duration: rand(6000, 10000),
        dx: rand(40, 70), dy: 0, borderRadius: 20, opacity: rand(0.12, 0.22),
      }
      case 'clearing': return {
        ...base, size: rand(6, 14), color, duration: rand(4000, 7000),
        dx: 0, dy: rand(20, 35), borderRadius: 3,
        opacity: rand(0.15, 0.3), y: rand(0, h * 0.5),
      }
      case 'sunny': return {
        ...base, size: rand(4, 10), color, duration: rand(5000, 8000),
        dx: rand(-10, 10), dy: -rand(60, 100), borderRadius: 9999,
        opacity: rand(0.25, 0.5),
      }
      default: return { // rainbow
        ...base, size: rand(6, 16), color: RAINBOW[i % RAINBOW.length],
        duration: rand(5000, 9000), dx: rand(-15, 15), dy: rand(-20, 20),
        borderRadius: 9999, opacity: rand(0.2, 0.4),
      }
    }
  })

// Single animated particle driven by reanimated shared values
const Particle = ({ config: c }: { config: ParticleConfig }) => {
  const tx = useSharedValue(0)
  const ty = useSharedValue(0)
  const timing = { duration: c.duration, easing: Easing.linear }

  tx.value = withDelay(c.delay, withRepeat(withTiming(c.dx, timing), -1, true))
  ty.value = withDelay(c.delay, withRepeat(withTiming(c.dy, timing), -1, c.dy <= 0))

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${c.rotation}deg` },
    ],
  }))

  return (
    <Animated.View
      style={[{
        position: 'absolute', left: c.x, top: c.y,
        width: c.size, height: c.rotation !== 0 ? c.size * 4 : c.size,
        borderRadius: c.borderRadius, backgroundColor: c.color, opacity: c.opacity,
      }, style]}
    />
  )
}

const WeatherParticles = ({ moodScore }: WeatherParticlesProps) => {
  const { width, height } = useWindowDimensions()
  const weather = moodScore === 0 ? 'clearing' : getWeatherType(moodScore)
  const mood = moodScore === 0 ? 5 : moodScore
  const { bg, particle } = getWeatherColors(mood)

  const particles = useMemo(
    () => generateParticles(weather, particle, width, height),
    [weather, particle, width, height],
  )

  return (
    <Animated.View pointerEvents="none" style={[styles.root, { backgroundColor: bg }]}>
      {particles.map((cfg, i) => (
        <Particle key={`${weather}-${i}`} config={cfg} />
      ))}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
})

export default WeatherParticles
