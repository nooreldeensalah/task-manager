import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

export interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const LoadingIndicator = ({ size = 'large', fullScreen = false }: LoadingIndicatorProps) => {
  const { theme } = useTheme();
  const palette = Colors[theme];

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={palette.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});

export default LoadingIndicator;
