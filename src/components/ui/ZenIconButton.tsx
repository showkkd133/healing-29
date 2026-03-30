import React from 'react';
import { StyleSheet, Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '@/constants/theme';
import { useHaptic } from '@/hooks/useHaptic';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type IconProvider = 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';

interface ZenIconButtonProps extends Omit<PressableProps, 'style'> {
  icon: string;
  provider?: IconProvider;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  hasShadow?: boolean;
}

/**
 * ZenIconButton: A circular icon button with elegant animations and haptics.
 * Perfect for mode switchers, close buttons, and secondary actions.
 */
export const ZenIconButton: React.FC<ZenIconButtonProps> = ({
  icon,
  provider = 'Feather',
  size = 44,
  iconSize,
  color = COLORS.primary,
  backgroundColor = COLORS.card,
  onPress,
  style,
  hasShadow = false,
  disabled,
  ...rest
}) => {
  const haptic = useHaptic();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.92, { damping: 20, stiffness: 300 });
    haptic.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const renderIcon = () => {
    const finalIconSize = iconSize || size * 0.5;
    
    switch (provider) {
      case 'Ionicons':
        return <Ionicons name={icon as any} size={finalIconSize} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={icon as any} size={finalIconSize} color={color} />;
      default:
        return <Feather name={icon as any} size={finalIconSize} color={color} />;
    }
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        hasShadow && SHADOWS.md,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {renderIcon()}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});
