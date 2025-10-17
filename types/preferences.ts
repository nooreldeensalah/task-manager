export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemePreference;
  notificationsEnabled: boolean;
}
