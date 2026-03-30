import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { TYPOGRAPHY, COLORS } from '@/constants/theme';

interface ZenTypographyProps extends TextProps {
  variant?: 'regular' | 'medium' | 'semibold' | 'bold';
  size?: keyof typeof TYPOGRAPHY.fontSize;
  color?: keyof typeof COLORS | string;
  type?: 'sans' | 'serif';
  align?: 'left' | 'center' | 'right';
  italic?: boolean;
}

/**
 * ZenTypography: A typography component that ensures poetic serif and functional sans feels.
 * Strictly controls line-height and letter-spacing for readability.
 */
export const ZenTypography: React.FC<ZenTypographyProps> = ({
  variant = 'regular',
  size = 'base',
  color = 'text',
  type = 'sans',
  align = 'left',
  italic = false,
  style,
  children,
  ...rest
}) => {
  const textColor = (COLORS[color as keyof typeof COLORS] as string) || color;

  const textStyle: TextStyle = {
    fontFamily: type === 'serif' ? TYPOGRAPHY.fontFamily.serif : TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize[size],
    lineHeight: TYPOGRAPHY.lineHeight[size],
    fontWeight: TYPOGRAPHY.fontWeight[variant],
    letterSpacing: type === 'serif' ? TYPOGRAPHY.letterSpacing.normal : TYPOGRAPHY.letterSpacing.tight,
    color: textColor,
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
  };

  return (
    <Text style={[styles.base, textStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
