import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { ANIMATION } from '@/constants/theme';

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: any;
}

/**
 * A wrapper that slowly fades in its children with a configurable delay.
 * Supports the "Zen" aesthetic with smooth, slow transitions.
 */
export default function FadeInView({ 
  children, 
  duration = ANIMATION.duration.slow, 
  delay = 0,
  style 
}: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Using soft easing
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );
  }, [delay, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
