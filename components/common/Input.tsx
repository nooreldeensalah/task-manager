import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import Colors from '@/constants/Colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string | null;
  maxLength?: number;
  showCounter?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ label, helperText, errorText, style, maxLength, value, showCounter = false, ...rest }, ref) => {
    const { theme } = useTheme();
    const palette = Colors[theme];
    const hasError = Boolean(errorText);
    const counter = typeof maxLength === 'number' && typeof value === 'string' ? `${value.length}/${maxLength}` : undefined;

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: palette.text }]}>{label}</Text>}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: hasError ? palette.danger : palette.border,
              backgroundColor: palette.surfaceElevated,
            },
          ]}>
          <TextInput
            ref={ref}
            style={[styles.input, { color: palette.text }, style]}
            placeholderTextColor={palette.textMuted}
            maxLength={maxLength}
            value={value}
            {...rest}
          />
        </View>
        <View style={styles.footerRow}>
          {hasError ? (
            <Text accessibilityLiveRegion="polite" style={[styles.errorText, { color: palette.danger }]}>
              {errorText}
            </Text>
          ) : helperText ? (
            <Text style={[styles.helperText, { color: palette.textMuted }]}>{helperText}</Text>
          ) : null}
          {showCounter && counter && (
            <Text style={[styles.counter, { color: palette.textMuted }]}>{counter}</Text>
          )}
        </View>
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  inputWrapper: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md - SPACING.xs,
    paddingVertical: SPACING.smPlus,
  },
  input: {
    ...TYPOGRAPHY.body,
    padding: 0,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: TYPOGRAPHY.caption.lineHeight + SPACING.xxs,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
  },
  counter: {
    ...TYPOGRAPHY.caption,
  },
});

export default Input;
