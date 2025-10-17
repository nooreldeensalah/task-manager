export interface ThemePalette {
  primary: string;
  primaryMuted: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

const BASE_COLORS = {
  primary: '#6151ff',
  accent: '#ffb300',
  success: '#2ecc71',
  warning: '#f39c12',
  danger: '#e74c3c',
} as const;

export const LIGHT_THEME_COLORS: ThemePalette = {
  primary: BASE_COLORS.primary,
  primaryMuted: '#e3e0ff',
  background: '#ffffff',
  surface: '#f7f7fb',
  surfaceElevated: '#ffffff',
  text: '#1f2933',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  accent: BASE_COLORS.accent,
  success: BASE_COLORS.success,
  warning: BASE_COLORS.warning,
  danger: BASE_COLORS.danger,
  tint: BASE_COLORS.primary,
  tabIconDefault: '#9ca3af',
  tabIconSelected: BASE_COLORS.primary,
};

export const DARK_THEME_COLORS: ThemePalette = {
  primary: BASE_COLORS.primary,
  primaryMuted: '#3f37c9',
  background: '#0f172a',
  surface: '#111827',
  surfaceElevated: '#1f2937',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  border: '#374151',
  accent: BASE_COLORS.accent,
  success: BASE_COLORS.success,
  warning: BASE_COLORS.warning,
  danger: BASE_COLORS.danger,
  tint: BASE_COLORS.accent,
  tabIconDefault: '#6b7280',
  tabIconSelected: BASE_COLORS.accent,
};

export const THEME_COLORS: Record<'light' | 'dark', ThemePalette> = {
  light: LIGHT_THEME_COLORS,
  dark: DARK_THEME_COLORS,
};

export default THEME_COLORS;
