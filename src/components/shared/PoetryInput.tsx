import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, Animated } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';

interface PoetryInputProps extends TextInputProps {
  style?: any;
}

export default function PoetryInput({ style, ...props }: PoetryInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [focusAnim] = useState(new Animated.Value(0));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    if (props.onBlur) props.onBlur(e);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.accent],
  });

  const borderBottomWidth = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const opacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Animated.View style={[
      styles.container, 
      { borderBottomColor: borderColor, borderBottomWidth, opacity }
    ]}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={COLORS.textTertiary}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  input: {
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    minHeight: 40,
  },
});
