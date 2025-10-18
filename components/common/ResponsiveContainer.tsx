import type { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';

import { CONTAINER_MAX_WIDTH, getResponsivePadding } from '@/constants/Layout';

export interface ResponsiveContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  outerStyle?: StyleProp<ViewStyle>;
}

const ResponsiveContainer = ({ children, style, outerStyle }: ResponsiveContainerProps) => {
  const { width } = useWindowDimensions();
  const horizontalPadding = getResponsivePadding(width);
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={[
        styles.outer,
        { paddingHorizontal: horizontalPadding },
        isWeb ? styles.webOuter : undefined,
        outerStyle,
      ]}
    >
      <View style={[styles.inner, isWeb ? styles.innerWeb : undefined, style]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  webOuter: {
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  innerWeb: {
    maxWidth: CONTAINER_MAX_WIDTH,
    width: '100%',
  },
});

export default ResponsiveContainer;
