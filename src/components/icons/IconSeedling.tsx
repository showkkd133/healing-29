import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props { size?: number; color?: string }

// Seedling / sprout icon — growth metaphor
const IconSeedling = ({ size = 24, color = COLORS.text }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22V12"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M7 12s0-5 5-5 5 5 5 5"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M4 8s0-6 8-6c0 4-2 6-4 6"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M20 8s0-6-8-6c0 4 2 6 4 6"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
)

export default IconSeedling
