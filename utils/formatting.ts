const DEFAULT_LOCALE = typeof Intl !== 'undefined' ? undefined : 'en-US';

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
