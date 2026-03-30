// Design system tokens for the Healing Journey app

export const COLORS = {
  primary: '#8A9A9E',       // Muted sage blue — calm, steady
  secondary: '#D9C5B2',     // Sand beige — warmth, grounded
  accent: '#C5A377',        // Muted gold — hope, sunlight
  background: '#FAF9F6',    // Bone white — natural paper texture feel
  text: '#3A3A3A',          // Soft charcoal — readable but less harsh than black
  textSecondary: '#7A7A7A', // Muted stone gray
  textTertiary: '#BDBDBD',  // Light mist gray
  success: '#92A68A',       // Moss green
  warning: '#D4A373',       // Ochre
  error: '#C97C7C',         // Dusty rose/red
  card: '#FDFDFB',          // Almost white, very subtle lift
  white: '#FFFFFF',
  border: '#E8E4E1',        // Very soft earth border
  borderLight: '#F2EFED',   // Faded border
  overlay: 'rgba(58, 58, 58, 0.2)', // Softer overlay
  
  // Stage-specific accent colors (Muted versions)
  stageEmergency: '#D4B2B2',
  stageRebuild: '#B2C2D4',
  stageEnergy: '#D4C2B2',
  stageDeepHealing: '#B2B2D4',
  stageReview: '#B2D4D4',
  stageDisillusion: '#D4C2B2',
  stageDesensitize: '#B2D4C2',
  stageReorganize: '#D4D4B2',
  stageAwakening: '#C2D4B2',
  stageRestart: '#D4B2C2',

  // Mood spectrum colors (Zen transition)
  mood1: '#4A4E54',   // deep slate
  mood2: '#5E646B',   
  mood3: '#727A82',   
  mood4: '#879099',   
  mood5: '#9BA6B0',   
  mood6: '#AAB3BA',   
  mood7: '#B9C0C4',   
  mood8: '#C8CDCE',   
  mood9: '#D7D9D8',   
  mood10: '#E6E6E2',  

  backgroundMuted: '#F5F2EF',
  backgroundPositive: '#F0F2EE',
  shadow: 'rgba(0, 0, 0, 0.04)', // Extremely subtle shadows
  
  primaryLight: '#F1F4F5',
  secondaryLight: '#F7F4F1',
  accentLight: '#F7F5F0',
  textMuted: '#D1D1D1',
  divider: '#F2EFED',
} as const

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    serif: 'Georgia', // Primary for literary feel
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 22,
    xl: 26,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  lineHeight: {
    xs: 18,
    sm: 22,
    base: 26,
    md: 30,
    lg: 34,
    xl: 38,
    '2xl': 44,
    '3xl': 52,
    '4xl': 60,
  },
  fontWeight: {
    regular: '300' as const, // Thinner weights for Zen feel
    medium: '400' as const,
    semibold: '500' as const,
    bold: '600' as const,
  },
  letterSpacing: {
    tight: -0.2,
    normal: 0.5, // Wider default spacing
    wide: 1.2,
    wider: 2.5,
  },
} as const

export const SPACING = {
  /** 2px */
  '2xs': 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  '2xl': 24,
  /** 32px */
  '3xl': 32,
  /** 40px */
  '4xl': 40,
  /** 48px */
  '5xl': 48,
  /** 64px */
  '6xl': 64,
} as const

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const

export const SHADOWS = {
  sm: {
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  xl: {
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#C5A377',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  soft: {
    shadowColor: '#8A9A9E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
} as const

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 450,
    slow: 800,
    slower: 1500, // For breathing effects
    breath: 3000, // Very slow for background elements
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  spring: {
    gentle: { damping: 20, stiffness: 90 },
    bouncy: { damping: 12, stiffness: 150 },
    slow: { damping: 30, stiffness: 50 },
  }
} as const

// Layout constants
export const LAYOUT = {
  screenPaddingHorizontal: SPACING.lg,
  cardPadding: SPACING.lg,
  headerHeight: 56,
  tabBarHeight: 80,
  maxContentWidth: 480,
} as const

export const GRADIENTS = {
  primary: ['#7C9CB4', '#6688A0'],         // Mist blue gradient
  accent: ['#F4B942', '#E8A830'],           // Amber gradient
  warm: ['#F4D3D3', '#FAF8F5'],             // Dawn pink to paper white
  healing: ['#7C9CB4', '#F4B942'],          // Primary to accent
  card: ['#FFFFFF', '#FAFAFA'],             // Subtle card gradient
  hero: ['#FAF8F5', '#F0ECE6'],             // Hero section
} as const

export const DECORATIVE = {
  lineWidth: {
    thin: 1,
    regular: 2,
    thick: 3,
    accent: 4,
  },
  pillPadding: {
    horizontal: 12,
    vertical: 4,
  },
} as const
