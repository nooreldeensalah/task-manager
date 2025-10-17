const DEFAULT_LOCALE = typeof Intl !== 'undefined' ? undefined : 'en-US';
const HAS_RELATIVE_TIME_FORMAT =
  typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function';

const getIntlDateTimeFormatter = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(DEFAULT_LOCALE, options);

const coerceToDate = (value: Date | string | number | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string => {
  const date = coerceToDate(value);
  if (!date) {
    return '';
  }

  return getIntlDateTimeFormatter(options).format(date);
};

export const formatDateTime = (
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
): string => {
  const date = coerceToDate(value);
  if (!date) {
    return '';
  }

  return getIntlDateTimeFormatter(options).format(date);
};

export const formatRelativeTime = (value: Date | string | number): string => {
  const date = coerceToDate(value);
  if (!date) {
    return '';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (Math.abs(diffMinutes) < 1) {
    return 'Just now';
  }

  if (!HAS_RELATIVE_TIME_FORMAT) {
    if (Math.abs(diffMinutes) < 60) {
      const suffix = diffMinutes > 0 ? 'ago' : 'from now';
      return `${Math.abs(diffMinutes)} min ${suffix}`;
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      const suffix = diffHours > 0 ? 'ago' : 'from now';
      return `${Math.abs(diffHours)} hr ${suffix}`;
    }

    const diffDays = Math.round(diffHours / 24);
    const suffix = diffDays > 0 ? 'ago' : 'from now';
    return `${Math.abs(diffDays)} day ${suffix}`;
  }

  const rtf = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(-diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(-diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return rtf.format(-diffDays, 'day');
};

export const pad = (value: number): string => value.toString().padStart(2, '0');

export const formatDateInput = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatTimeInput = (date: Date): string => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const roundToMinute = (date: Date): Date => {
  const next = new Date(date);
  next.setSeconds(0, 0);
  return next;
};
