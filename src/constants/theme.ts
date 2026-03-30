// Design system tokens for the Healing Journey app

export const COLORS = {
  primary: '#748C94',       // Deep sage — calm, steady
  primaryLight: '#A7BBC2',
  secondary: '#C7B198',     // Warm mud — grounded
  secondaryLight: '#DFD3C3',
  accent: '#B08968',        // Earthy wood — tactile, warm
  accentLight: '#E6CCB2',
  background: '#F7F5F2',    // Warm paper — natural, breathable
  text: '#2D3436',          // Dark charcoal — readable and modern
  textSecondary: '#636E72', // Slate gray — softer secondary text
  textTertiary: '#B2BEC3',  // Light mist — for metadata
  success: '#829460',       // Deep moss
  warning: '#E9B384',       // Muted orange
  error: '#AF7E7E',         // Dusty rose
  card: '#FFFFFF',          
  white: '#FFFFFF',
  border: '#E8E4E1',        
  borderLight: '#F2EFED',   
  overlay: 'rgba(45, 52, 54, 0.15)', 
  
  // Stage-specific accent colors (More sophisticated)
  stageEmergency: '#E9B3B3', // Soft coral
  stageRebuild: '#B3C8E9',   // Misty blue
  stageEnergy: '#E9D7B3',    // Sunlit sand
  stageDeepHealing: '#C8B3E9', // Soft lavender
  stageReview: '#B3E9E9',    // Pale teal
  stageDisillusion: '#E9C8B3', // Clay
  stageDesensitize: '#B3E9C8', // Sea foam
  stageReorganize: '#DCE9B3', // Sprout
  stageAwakening: '#CBE9B3', // Pale lime
  stageRestart: '#E9B3D7',   // Petal pink

  // Mood spectrum (Fluid transitions)
  mood1: '#4B5D67',   
  mood2: '#5F717B',   
  mood3: '#73858F',   
  mood4: '#8799A3',   
  mood5: '#9BADB7',   
  mood6: '#AFC1CB',   
  mood7: '#C3D5DF',   
  mood8: '#D7E9F3',   
  mood9: '#EBFDFF',   
  mood10: '#FFFFFF',  

  backgroundMuted: '#F2EFED',
  backgroundPositive: '#F0F2EE',
  shadow: 'rgba(0, 0, 0, 0.05)', 
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
  primary: ['#748C94', '#4B5D67'],
  healing: ['#A7BBC2', '#F7F5F2'],         // Main background soft gradient
  dawn: ['#F6D5F7', '#FBE9D7'],            // Soft morning feel
  peace: ['#B3C8E9', '#EBFDFF'],           // Calm sky
  nature: ['#CBE9B3', '#F7F5F2'],          // Fresh grass
  warmth: ['#E9D7B3', '#FBFAF8'],          // Gentle sunlight
  card: ['#FFFFFF', '#FDFDFB'],
  button: ['#748C94', '#8A9A9E'],
  hero: ['#F7F5F2', '#E8E4E1'],
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
