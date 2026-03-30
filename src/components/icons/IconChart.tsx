import React from 'react'
import Svg, { Line } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props { size?: number; color?: string }

// Bar-chart icon with rounded strokes
const IconChart = ({ size = 24, color = COLORS.text }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1={18} y1={20} x2={18} y2={10} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1={12} y1={20} x2={12} y2={4} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1={6} y1={20} x2={6} y2={14} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export default IconChart
