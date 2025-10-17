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

export type ThemeName = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeName;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const getSystemTheme = (): ThemeName => (Appearance.getColorScheme() ?? 'light') as ThemeName;

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const resolvedTheme: ThemeName = useMemo(() => {
    if (preference === 'system') {
      return (systemTheme ?? getSystemTheme()) as ThemeName;
    }

    return preference;
  }, [preference, systemTheme]);

  const handleSetPreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
  }, []);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      preference,
      setPreference: handleSetPreference,
    }),
    [resolvedTheme, preference, handleSetPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
