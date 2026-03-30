import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props { size?: number; color?: string }

// Medal/badge icon with circle and ribbons
const IconBadge = ({ size = 24, color = COLORS.text }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={9} r={6} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
)

export default IconBadge
