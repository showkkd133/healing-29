import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Pressable, PressableProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING } from '@/constants/theme';
import { useHaptic } from '@/hooks/useHaptic';
import { ZenTypography } from './ZenTypography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ZenButtonProps extends Omit<PressableProps, 'style'> {
  title?: string;
  variant?: 'primary' | 'ghost' | 'outline' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
}

/**
 * ZenButton: An interactive button with subtle haptics and a soft spring-back animation.
 * Follows the core Zen design principles: rounded corners, gentle gradients, and clarity.
 */
export const ZenButton: React.FC<ZenButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onPress,
  style,
  disabled,
  children,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(variant === 'hero' ? 0.94 : 0.97, { damping: 20, stiffness: 300 });
    haptic.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const renderContent = () => {
    if (children) return children;

    const isHero = variant === 'hero';
    const textVariant = (variant === 'primary' || isHero) ? 'bold' : 'medium';
    const textColor = (variant === 'primary' || isHero) ? 'white' : 'primary';
    const textSize = size === 'sm' ? 'sm' : size === 'md' ? 'base' : size === 'lg' ? 'md' : 'lg';
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 22;
    const colorValue = (variant === 'primary' || isHero) ? COLORS.white : COLORS.primary;

    return (
      <View style={styles.contentRow}>
        {leftIcon && (
          <Feather name={leftIcon} size={iconSize} color={colorValue} style={styles.leftIcon} />
        )}
        <ZenTypography
          variant={textVariant}
          size={textSize}
          color={textColor}
          align="center"
          type={isHero ? 'serif' : 'sans'}
          style={styles.text}
        >
          {title}
        </ZenTypography>
        {rightIcon && (
          <Feather name={rightIcon} size={iconSize} color={colorValue} style={styles.rightIcon} />
        )}
      </View>
    );
  };

  const containerStyles = [
    styles.container,
    styles[size],
    fullWidth && styles.fullWidth,
    variant === 'ghost' && styles.ghost,
    variant === 'outline' && styles.outline,
    variant === 'hero' && styles.hero,
    disabled && styles.disabled,
    style,
  ];

  if (variant === 'primary' || variant === 'hero') {
    const gradientColors = variant === 'hero' 
      ? [COLORS.primary, COLORS.accent] 
      : GRADIENTS.button;

    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        style={[containerStyles, animatedStyle]}
        {...rest}
      >
        <LinearGradient
          colors={gradientColors as unknown as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        />
        {renderContent()}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={[containerStyles, animatedStyle]}
      {...rest}
    >
      {renderContent()}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 40,
  },
  md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING['2xl'],
    minHeight: 52,
  },
  lg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING['3xl'],
    minHeight: 64,
  },
  xl: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING['4xl'],
    minHeight: 84,
    borderRadius: 42,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  gradient: {
    borderRadius: 32,
  },
  ghost: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  hero: {
    borderRadius: 42,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    zIndex: 1,
  },
  leftIcon: {
    marginRight: SPACING.sm,
    zIndex: 1,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
    zIndex: 1,
  },
});

