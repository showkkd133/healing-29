// Design system tokens for the Healing Journey app

export const COLORS = {
  primary: '#7C9CB4',       // Mist blue — calm, trustworthy
  secondary: '#F4D3D3',     // Dawn pink — warmth, tenderness
  accent: '#F4B942',        // Amber yellow — energy, hope
  background: '#FAF8F5',    // Paper white — soft, non-clinical
  text: '#2C2C2C',          // Near black — readable, gentle
  textSecondary: '#8E8E93', // System gray
  textTertiary: '#C7C7CC',  // Light gray for hints
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  card: '#FFFFFF',
  white: '#FFFFFF',
  border: '#E5E5EA',
  borderLight: '#E8E4DF',       // Warm gray — softer locked-cell border
  overlay: 'rgba(0,0,0,0.4)',
  // Stage-specific accent colors
  stageEmergency: '#E8A0BF',
  stageRebuild: '#A0C4E8',
  stageEnergy: '#F4B942',
  stageDeepHealing: '#9B8EC4',
  stageReview: '#7C9CB4',
  stageDisillusion: '#C4A08E',
  stageDesensitize: '#8EC4B0',
  stageReorganize: '#E8C4A0',
  stageAwakening: '#A0E8C4',
  stageRestart: '#F4D3D3',
  // Mood spectrum colors (score 1-10, despair → joyful)
  mood1: '#4A4A6A',   // deep indigo — despair
  mood2: '#6B5B7B',   // muted purple — heavy
  mood3: '#7C6B8A',   // dusty violet — sadness
  mood4: '#8E8EA0',   // grey lavender — low
  mood5: '#9BAFBA',   // overcast blue — neutral-low
  mood6: '#A0C4E8',   // soft blue — neutral
  mood7: '#B5D4A0',   // sage green — hopeful
  mood8: '#D4E8A0',   // lime — content
  mood9: '#F4D78E',   // warm gold — happy
  mood10: '#F4B942',  // amber — joyful
  // Semantic background variants
  backgroundMuted: '#F0F0F0',    // Neutral muted — old/faded content
  backgroundPositive: '#EBF5EB', // Soft green — positive/new content
  // Shadow color
  shadow: '#000000',
} as const

export const TYPOGRAPHY = {
  // Font families — will resolve to system fonts on each platform
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    serif: 'Georgia',
  },
  // Font sizes following an 8pt modular scale
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },
  // Line heights proportional to font sizes
  lineHeight: {
    xs: 16,
    sm: 18,
    base: 22,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 42,
    '4xl': 48,
  },
  // Font weights (numeric for cross-platform consistency)
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const

// Layout constants
export const LAYOUT = {
  screenPaddingHorizontal: SPACING.lg,
  cardPadding: SPACING.lg,
  headerHeight: 56,
  tabBarHeight: 80,
  maxContentWidth: 480,
} as const
