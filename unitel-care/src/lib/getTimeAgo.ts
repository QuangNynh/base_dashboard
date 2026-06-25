import { isValid } from 'date-fns';
import i18n from '@/i18n'; // path của bạn

const normalizeDate = (date: string) => date.replace(/\.\d{3,}$/, '');

export const getTimeAgo = (date: string | Date): string => {
  const now = new Date();

  const target = typeof date === 'string' ? new Date(normalizeDate(date)) : date;

  if (!isValid(target)) return '';

  const diffMs = now.getTime() - target.getTime();
  if (diffMs < 0) return '';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 5) return i18n.t('time.justNow');

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  const push = (value: number, key: string) => {
    if (value <= 0) return;
    parts.push(i18n.t(`time.${key}`, { count: value }));
  };

  push(days, 'day');
  push(remainingHours, 'hour');
  push(remainingMinutes, 'minute');
  push(remainingSeconds, 'second');

  const result = parts.join(' ');

  return i18n.language === 'en' ? `${result} ${i18n.t('time.ago')}` : result;
};
