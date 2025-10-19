import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { SPACING } from '@/constants/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export interface AppHeaderProps {
  showBackButton?: boolean;
}

const AppHeader = ({ showBackButton = false }: AppHeaderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const palette = Colors[theme];

  // Determine if we should show back button based on route
  const isDetailPage = (segments as string[]).includes('task') && segments.length > 1;
  const shouldShowBack = showBackButton || isDetailPage;
  const title = isDetailPage ? 'Task Details' : 'Tasks';

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background, borderBottomColor: palette.border }]}>
      <View style={styles.inner}>
        <View style={styles.leftSection}>
          {shouldShowBack ? (
            <Pressable
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={palette.text} />
            </Pressable>
          ) : null}
          <View style={styles.headerText}>
            {!isDetailPage && <Text style={[styles.title, { color: palette.text }]}>{title}</Text>}
            {user?.email && !shouldShowBack ? (
              <Text style={[styles.subtitle, { color: palette.textMuted }]} numberOfLines={1}>
                {user.email}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.rightSection}>
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={theme === 'dark' ? 'white-balance-sunny' : 'weather-night'}
              size={24}
              color={palette.text}
            />
          </Pressable>
          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons name="logout" size={24} color={palette.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    ...(Platform.OS === 'web' ? {
      position: 'sticky' as any,
      top: 0,
      zIndex: 100,
    } : {}),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.smPlus,
    gap: SPACING.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexShrink: 1,
  },
  headerText: {
    gap: 2,
    flexShrink: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: 8,
  },
});

export default AppHeader;
