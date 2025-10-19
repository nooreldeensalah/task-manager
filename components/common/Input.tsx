import { forwardRef, useMemo } from 'react';
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
    const styles = useStyles(palette);
    const hasError = Boolean(errorText);
    const counter = typeof maxLength === 'number' && typeof value === 'string' ? `${value.length}/${maxLength}` : undefined;

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={hasError ? styles.inputWrapperError : styles.inputWrapper}>
          <TextInput
            ref={ref}
            style={[
              styles.input,
              style,
            ]}
            placeholderTextColor={palette.textMuted}
            maxLength={maxLength}
            value={value}
            {...rest}
          />
        </View>
        <View style={styles.footerRow}>
          {hasError ? (
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>
              {errorText}
            </Text>
          ) : helperText ? (
            <Text style={styles.helperText}>{helperText}</Text>
          ) : null}
          {showCounter && counter && (
            <Text style={styles.counter}>{counter}</Text>
          )}
        </View>
      </View>
    );
  },
);

const createInputStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
      gap: SPACING.xs,
    },
    label: {
      ...TYPOGRAPHY.bodySmall,
      fontWeight: '600',
      color: palette.text,
    },
    inputWrapper: {
      borderRadius: RADIUS.md,
      borderWidth: 1,
      paddingHorizontal: SPACING.md - SPACING.xs,
      paddingVertical: SPACING.smPlus,
      borderColor: palette.border,
      backgroundColor: palette.surfaceElevated,
    },
    inputWrapperError: {
      borderRadius: RADIUS.md,
      borderWidth: 1,
      paddingHorizontal: SPACING.md - SPACING.xs,
      paddingVertical: SPACING.smPlus,
      borderColor: palette.danger,
      backgroundColor: palette.surfaceElevated,
    },
    input: {
      ...TYPOGRAPHY.body,
      padding: 0,
      color: palette.text,
      outlineWidth: 0,
      outlineColor: 'transparent',
      boxShadow: 'none',
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: TYPOGRAPHY.caption.lineHeight + SPACING.xxs,
    },
    helperText: {
      ...TYPOGRAPHY.caption,
      color: palette.textMuted,
    },
    errorText: {
      ...TYPOGRAPHY.caption,
      color: palette.danger,
    },
    counter: {
      ...TYPOGRAPHY.caption,
      color: palette.textMuted,
    },
  });

const useStyles = (palette: typeof Colors.light) => {
  return useMemo(() => createInputStyles(palette), [palette]);
};

export default Input;
