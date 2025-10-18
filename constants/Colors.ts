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
  primary: '#7c3aed', // Vibrant violet for brand-forward actions
  accent: '#f97316', // Warm accent for highlights
  success: '#22c55e',
  warning: '#facc15',
  danger: '#ef4444',
} as const;

export const LIGHT_THEME_COLORS: ThemePalette = {
  primary: BASE_COLORS.primary,
  primaryMuted: '#ede9fe',
  background: '#f8f9ff',
  surface: '#ffffff',
  surfaceElevated: '#eef2ff',
  text: '#111827',
  textMuted: '#6b7280',
  border: '#d6d8eb',
  accent: BASE_COLORS.accent,
  success: BASE_COLORS.success,
  warning: BASE_COLORS.warning,
  danger: BASE_COLORS.danger,
  tint: BASE_COLORS.primary,
  tabIconDefault: '#9ca3af',
  tabIconSelected: BASE_COLORS.primary,
};

export const DARK_THEME_COLORS: ThemePalette = {
  primary: '#a855f7',
  primaryMuted: '#5b21b6',
  background: '#0f172a',
  surface: '#111827',
  surfaceElevated: '#1e2435',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  border: '#30374a',
  accent: BASE_COLORS.accent,
  success: BASE_COLORS.success,
  warning: BASE_COLORS.warning,
  danger: BASE_COLORS.danger,
  tint: BASE_COLORS.primary,
  tabIconDefault: '#6b7280',
  tabIconSelected: BASE_COLORS.primary,
};

export const THEME_COLORS: Record<'light' | 'dark', ThemePalette> = {
  light: LIGHT_THEME_COLORS,
  dark: DARK_THEME_COLORS,
};

export default THEME_COLORS;
