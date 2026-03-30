import React from 'react'
import Svg, { Rect, Path } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props { size?: number; color?: string }

// Rounded padlock icon
const IconLock = ({ size = 24, color = COLORS.text }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M8 11V7a4 4 0 0 1 8 0v4"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
)

export default IconLock
