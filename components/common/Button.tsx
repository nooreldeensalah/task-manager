import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors, { type ThemePalette } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: PressableProps['style'];
}

const getBackgroundColor = (theme: ThemePalette, variant: ButtonVariant, disabled: boolean) => {
  if (disabled) {
    return theme.primaryMuted;
  }

  switch (variant) {
    case 'secondary':
      return theme.surfaceElevated;
    case 'ghost':
      return 'transparent';
    default:
      return theme.primary;
  }
};

const getTextColor = (theme: ThemePalette, variant: ButtonVariant, disabled: boolean) => {
  if (disabled) {
    return theme.textMuted;
  }

  switch (variant) {
    case 'secondary':
      return theme.text;
    case 'ghost':
      return theme.primary;
    default:
      return theme.background;
  }
};

export const Button = ({
  label,
  variant = 'primary',
  disabled,
  style,
  loading = false,
  icon,
  fullWidth = false,
  ...pressableProps
}: ButtonProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => {
        const { pressed } = state;
        const resolvedStyle =
          typeof style === 'function'
            ? style(state)
            : style;

        return [
          styles.base,
          {
            backgroundColor: getBackgroundColor(palette, variant, Boolean(isDisabled)),
            opacity: pressed && !isDisabled ? 0.85 : 1,
            borderColor: variant === 'ghost' ? palette.primary : 'transparent',
            width: fullWidth ? '100%' : undefined,
          },
          resolvedStyle,
        ];
      }}
      {...pressableProps}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor(palette, variant, Boolean(isDisabled))} />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.label,
                {
                  color: getTextColor(palette, variant, Boolean(isDisabled)),
                },
              ]}>
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 4,
  },
});

export default Button;
