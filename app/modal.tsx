import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/common/Button';
import ResponsiveContainer from '@/components/common/ResponsiveContainer';
import Colors from '@/constants/Colors';
import { SPACING } from '@/constants/Layout';
import { useTheme } from '@/hooks/useTheme';

export default function ModalScreen() {
  const { theme, toggleTheme } = useTheme();
  const palette = Colors[theme];
  const displayTheme = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['bottom']}>
      <ResponsiveContainer outerStyle={styles.outer} style={styles.inner}>
        <View style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}
          accessibilityLabel="Quick actions panel">
          <Text style={[styles.title, { color: palette.text }]}>Quick actions</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Adjust preferences and shortcuts for your workspace.</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Appearance</Text>
            <Text style={[styles.sectionDescription, { color: palette.textMuted }]}>Current theme: <Text style={{ fontWeight: '600', color: palette.text }}>{displayTheme}</Text></Text>
            <Button label="Toggle theme" onPress={toggleTheme} variant="secondary" fullWidth />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Coming soon</Text>
            <Text style={[styles.sectionDescription, { color: palette.textMuted }]}>We're planning additional quick actions to help you configure your task list faster.</Text>
          </View>
        </View>
      </ResponsiveContainer>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
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
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
