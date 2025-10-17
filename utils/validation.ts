import { TASK_DESCRIPTION_MAX_LENGTH, TASK_DESCRIPTION_MIN_LENGTH } from '@/constants/Config';

export const normalizeDescription = (value: string): string => value.trim().replace(/\s+/g, ' ');

export const enforceDescriptionLimit = (value: string): string =>
  value.slice(0, TASK_DESCRIPTION_MAX_LENGTH);

export const validateTaskDescription = (value: string): string | null => {
  const normalized = normalizeDescription(value);

  if (normalized.length < TASK_DESCRIPTION_MIN_LENGTH) {
    return 'Task description cannot be empty.';
  }

  if (normalized.length > TASK_DESCRIPTION_MAX_LENGTH) {
    return `Task description must be ${TASK_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return null;
};

export const isTaskDescriptionValid = (value: string): boolean => validateTaskDescription(value) === null;
