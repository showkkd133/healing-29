import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props { size?: number; color?: string }

// Triangle warning icon with exclamation mark
const IconWarning = ({ size = 24, color = COLORS.text }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M12 9v4"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M12 17h.01"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
)

export default IconWarning
