import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props { size?: number; color?: string }

// Pencil/pen icon with rounded strokes
const IconPen = ({ size = 24, color = COLORS.text }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M15 5l4 4"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
)

export default IconPen
