import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import { SPACING } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const palette = Colors[theme];

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['bottom']}>
        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
              <Text style={[styles.title, { color: palette.text }]}>We couldn't find that screen</Text>
              <Text style={[styles.description, { color: palette.textMuted }]}>The link might be out of date or the page was removed.</Text>
              <Link href="/" asChild>
                <Button label="Back to tasks" variant="primary" fullWidth />
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  outer: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 600,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.md,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});
