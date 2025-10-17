export const TASK_TITLE_MIN_LENGTH = 1;
export const TASK_TITLE_MAX_LENGTH = 120;
export const TASK_DESCRIPTION_MIN_LENGTH = 1;
export const TASK_DESCRIPTION_MAX_LENGTH = 500;

export const FIRESTORE_COLLECTIONS = {
  TASKS: 'tasks',
} as const;

export const STORAGE_KEYS = {
  THEME_PREFERENCE: '@c1-task-manager/theme-preference',
  USER_PREFERENCES: '@c1-task-manager/preferences',
} as const;
