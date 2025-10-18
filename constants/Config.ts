export const TASK_TITLE_MIN_LENGTH = 1;
export const TASK_TITLE_MAX_LENGTH = 120;
export const TASK_DESCRIPTION_MIN_LENGTH = 0;
export const TASK_DESCRIPTION_MAX_LENGTH = 500;

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;

export const STORAGE_KEYS = {
  THEME_PREFERENCE: '@c1-tm/theme-preference',
  USER_PREFERENCES: '@c1-tm/preferences',
} as const;
