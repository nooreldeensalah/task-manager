import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_DESCRIPTION_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from '@/constants/Config';

const normalizeWhitespace = (value: string): string => value.trim().replace(/\s+/g, ' ');

export const normalizeTitle = (value: string): string => normalizeWhitespace(value);

export const normalizeDescription = (value: string): string => normalizeWhitespace(value);

export const validateTaskTitle = (value: string): string | null => {
  const normalized = normalizeTitle(value);

  if (normalized.length < TASK_TITLE_MIN_LENGTH) {
    return 'Task title cannot be empty.';
  }

  if (normalized.length > TASK_TITLE_MAX_LENGTH) {
    return `Task title must be ${TASK_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  return null;
};

export const enforceDescriptionLimit = (value: string): string =>
  value.slice(0, TASK_DESCRIPTION_MAX_LENGTH);

export const validateTaskDescription = (value: string): string | null => {
  const normalized = normalizeDescription(value);

  if (normalized.length === 0) {
    return null;
  }

  if (normalized.length < TASK_DESCRIPTION_MIN_LENGTH) {
    if (TASK_DESCRIPTION_MIN_LENGTH <= 1) {
      return 'Task description must include at least one character when provided.';
    }

    return `Task description must be at least ${TASK_DESCRIPTION_MIN_LENGTH} characters when provided.`;
  }

  if (normalized.length > TASK_DESCRIPTION_MAX_LENGTH) {
    return `Task description must be ${TASK_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  return null;
};

export const isTaskDescriptionValid = (value: string): boolean => validateTaskDescription(value) === null;

export const isTaskTitleValid = (value: string): boolean => validateTaskTitle(value) === null;
