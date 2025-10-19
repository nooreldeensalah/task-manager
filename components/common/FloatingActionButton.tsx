import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon: ReactNode;
  accessibilityLabel: string;
}

export const FloatingActionButton = ({
  onPress,
  icon,
  accessibilityLabel,
}: FloatingActionButtonProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];

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
        },
      ]}
    >
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    // No elevation/shadows for a flatter look
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});

export default FloatingActionButton;
