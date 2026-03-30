import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '@/constants/theme';

interface ZenCardProps extends ViewProps {
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
  padding = 'lg',
  borderRadius = 32,
  elevation = 'soft',
  noBorder = false,
  style,
  children,
  ...rest
}) => {
  const cardPadding = typeof padding === 'number' ? padding : SPACING[padding];

  const cardStyle: ViewStyle = {
    backgroundColor: '#FDFCF9', // Warm paper background
    borderRadius: borderRadius,
    padding: cardPadding,
    borderWidth: noBorder ? 0 : 0.5,
    borderColor: COLORS.border,
    ...SHADOWS[elevation],
  };

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});
