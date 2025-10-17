export const TASK_DESCRIPTION_MIN_LENGTH = 1;
export const TASK_DESCRIPTION_MAX_LENGTH = 500;

export const FIRESTORE_COLLECTIONS = {
  TASKS: 'tasks',
} as const;

export const STORAGE_KEYS = {
  THEME_PREFERENCE: '@c1-task-manager/theme-preference',
  USER_PREFERENCES: '@c1-task-manager/preferences',
  LAST_SYNC_TIMESTAMP: '@c1-task-manager/last-sync-timestamp',
} as const;

export const OFFLINE = {
  SYNC_DEBOUNCE_MS: 750,
  RETRY_INTERVAL_MS: 5_000,
} as const;
