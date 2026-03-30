import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '@/constants/theme';

interface ZenCardProps extends ViewProps {
  variant?: 'paper' | 'glass' | 'floating';
  padding?: keyof typeof SPACING | number;
  borderRadius?: number;
  elevation?: keyof typeof SHADOWS;
  noBorder?: boolean;
}

/**
 * ZenCard: A container component with a warm paper feel and soft diffusion.
 * Features ultra-thin borders and breathable padding.
 */
export const ZenCard: React.FC<ZenCardProps> = ({
  variant = 'paper',
  padding = 'lg',
  borderRadius = 32,
  elevation = 'soft',
  noBorder = false,
  style,
  children,
  ...rest
}) => {
  const cardPadding = typeof padding === 'number' ? padding : SPACING[padding];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1,
          ...SHADOWS.md,
        };
      case 'floating':
        return {
          backgroundColor: '#FFFFFF',
          borderColor: 'transparent',
          borderWidth: 0,
          ...SHADOWS.xl,
        };
      default: // paper
        return {
          backgroundColor: '#FDFCF9',
          borderColor: COLORS.border,
          borderWidth: 0.5,
          ...SHADOWS.soft,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: borderRadius,
    padding: cardPadding,
    ...getVariantStyles(),
    ...(noBorder && { borderWidth: 0 }),
    ...(elevation && SHADOWS[elevation]),
  };

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});
