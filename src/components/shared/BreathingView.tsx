import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { ANIMATION } from '@/constants/theme';

interface BreathingViewProps {
  children?: React.ReactNode;
  duration?: number;
  /** Scale range [min, max] */
  range?: [number, number];
  /** Opacity range [min, max] */
  opacityRange?: [number, number];
  style?: any;
}

/**
 * A wrapper that applies a very subtle, slow scale/opacity pulse (breathing effect).
 * Designed for background elements or focal points that should feel "alive".
 */
export function BreathingView({ 
  children, 
  duration = ANIMATION.duration.breath, 
  range = [1, 1.03],
  opacityRange = [0.8, 1],
  style 
}: BreathingViewProps) {
  const scale = useSharedValue(range[0]);
  const opacity = useSharedValue(opacityRange[1]);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(range[1], {
        duration,
        easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
      }),
      -1,
      true
    );
    
    opacity.value = withRepeat(
      withTiming(opacityRange[0], {
        duration,
        easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
      }),
      -1,
      true
    );
  }, [duration, range, opacityRange, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export default BreathingView;
