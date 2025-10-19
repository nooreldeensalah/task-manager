import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

import type { ThemePreference } from '@/types/preferences';
import { STORAGE_KEYS } from '@/constants/Config';

export type ThemeName = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeName;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): ThemeName => (Appearance.getColorScheme() ?? 'light') as ThemeName;

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let isActive = true;

    const hydratePreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);

        if (!isActive || !stored) {
          return;
        }

        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      } catch (error) {
        console.warn('Failed to load stored theme preference:', error);
      } finally {
        if (isActive) {
          setHydrated(true);
        }
      }
    };

    hydratePreference();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, preference).catch((error) => {
      console.warn('Failed to persist theme preference:', error);
    });
  }, [hydrated, preference]);

  const resolvedTheme: ThemeName = useMemo(() => {
    if (preference === 'system') {
      return (systemTheme ?? getSystemTheme()) as ThemeName;
    }

    return preference;
  }, [preference, systemTheme]);

  const handleSetPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferenceState((currentPreference) => {
      const activeTheme: ThemeName = currentPreference === 'system'
        ? getSystemTheme()
        : currentPreference;

      return activeTheme === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      preference,
      setPreference: handleSetPreference,
      toggleTheme,
    }),
    [resolvedTheme, preference, handleSetPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
