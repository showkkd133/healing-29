import React from 'react';
import { Pressable, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION, COLORS, SHADOWS, BORDER_RADIUS } from '@/constants/theme';
import { useHaptic } from '@/hooks/useHaptic';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RippleButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle;
  hapticIntensity?: 'light' | 'medium' | 'heavy' | 'success' | 'error';
  glow?: boolean;
}

/**
 * A replacement for Pressable that provides a soft scale-down and haptic feedback on press,
 * with a very subtle glow effect. Designed for the Zen aesthetic.
 */
export default function RippleButton({ 
  children, 
  style, 
  containerStyle,
  hapticIntensity = 'light',
  glow = false,
  onPress,
  ...props 
}: RippleButtonProps) {
  const haptics = useHaptic();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, ANIMATION.spring.gentle);
    glowOpacity.value = withTiming(1, { duration: ANIMATION.duration.fast });
    haptics[hapticIntensity]();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring.gentle);
    glowOpacity.value = withTiming(0, { duration: ANIMATION.duration.normal });
  };

  return (
    <AnimatedPressable
      {...props}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, containerStyle, animatedStyle]}
    >
      {glow && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFillObject, 
            styles.glow, 
            glowStyle
          ]} 
        />
      )}
      <Animated.View style={style}>
        {children}
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.md,
  },
  glow: {
    backgroundColor: COLORS.accentLight,
    ...SHADOWS.glow,
  },
});
