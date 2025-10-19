import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import Colors from '@/constants/Colors';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppThemeProvider>
        <TaskProvider>
          <SafeAreaProvider>
            <RootLayoutNav />
          </SafeAreaProvider>
        </TaskProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const palette = Colors[theme];

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]} edges={['top']}>
        {user && <AppHeader />}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="task/[id]" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
      </SafeAreaView>
    </NavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
