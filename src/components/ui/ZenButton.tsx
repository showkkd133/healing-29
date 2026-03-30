import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Pressable, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING } from '@/constants/theme';
import { useHaptic } from '@/hooks/useHaptic';
import { ZenTypography } from './ZenTypography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ZenButtonProps extends Omit<PressableProps, 'style'> {
  title?: string;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
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
  ...rest
}) => {
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
    haptic.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const renderContent = () => {
    if (children) return children;

    const textVariant = variant === 'primary' ? 'bold' : 'medium';
    const textColor = variant === 'primary' ? 'white' : 'primary';
    const textSize = size === 'sm' ? 'sm' : size === 'md' ? 'base' : 'md';

    return (
      <ZenTypography
        variant={textVariant}
        size={textSize}
        color={textColor}
        align="center"
        style={styles.text}
      >
        {title}
      </ZenTypography>
    );
  };

  const containerStyles = [
    styles.container,
    styles[size],
    fullWidth && styles.fullWidth,
    variant === 'ghost' && styles.ghost,
    variant === 'outline' && styles.outline,
    disabled && styles.disabled,
    style,
  ];

  if (variant === 'primary') {
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
          colors={GRADIENTS.button as unknown as [string, string, ...string[]]}
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
  disabled: {
    opacity: 0.5,
  },
  text: {
    zIndex: 1,
  },
});
