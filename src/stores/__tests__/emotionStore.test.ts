import { describe, it, expect, beforeEach } from 'bun:test'
import { useEmotionStore } from '../emotionStore'

describe('emotionStore', () => {
  beforeEach(() => {
    useEmotionStore.setState({ records: [] })
  })

  it('should record emotion', () => {
    const { recordEmotion } = useEmotionStore.getState()
    recordEmotion(1, 5, ['sadness'])
    const records = useEmotionStore.getState().records
    expect(records).toHaveLength(1)
    expect(records[0].score).toBe(5)
  })

  it('should replace existing record for same day', () => {
    const { recordEmotion } = useEmotionStore.getState()
    recordEmotion(1, 3, ['sadness'])
    recordEmotion(1, 7, ['hope'])
    const records = useEmotionStore.getState().records
    expect(records).toHaveLength(1)
    expect(records[0].score).toBe(7)
  })

  it('should calculate trend', () => {
    const { recordEmotion, calculateTrend } = useEmotionStore.getState()
    recordEmotion(1, 3, [])
    recordEmotion(2, 5, [])
    recordEmotion(3, 7, [])
    const trend = calculateTrend()
    expect(trend.direction).toBe('improving')
  })
})
