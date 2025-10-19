import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon: ReactNode;
  accessibilityLabel: string;
  bottom?: number;
  right?: number;
}

export const FloatingActionButton = ({
  onPress,
  icon,
  accessibilityLabel,
  bottom = 24,
  right = 24,
}: FloatingActionButtonProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: palette.primary,
          opacity: pressed ? 0.85 : 1,
          shadowColor: palette.text,
          bottom: bottom + insets.bottom,
          right: right + insets.right,
        },
      ]}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});

export default FloatingActionButton;
