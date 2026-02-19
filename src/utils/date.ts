/**
 * Format date to Indonesian locale
 * @param date - Date object or string
 * @param format - Format type ('full', 'short', 'time')
 */
export const formatDate = (date: Date | string, format: 'full' | 'short' | 'time' = 'full'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
  }[format];

  return dateObj.toLocaleDateString('id-ID', options);
};

/**
 * Format time to HH:mm format
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(dateObj, 'short')} ${formatTime(dateObj)}`;
};

/**
 * Get greeting based on current time
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) {
    return 'Selamat Pagi';
  } else if (hour >= 11 && hour < 15) {
    return 'Selamat Siang';
  } else if (hour >= 15 && hour < 18) {
    return 'Selamat Sore';
  } else {
    return 'Selamat Malam';
  }
};

/**
 * Parse time string (HH:mm) to minutes
 */
export const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Calculate difference in minutes between two times
 */
export const diffInMinutes = (time1: string, time2: string): number => {
  const minutes1 = parseTime(time1);
  const minutes2 = parseTime(time2);
  return minutes2 - minutes1;
};

/**
 * Check if current time is before given time
 */
export const isBeforeTime = (currentTime: string, targetTime: string): boolean => {
  return parseTime(currentTime) < parseTime(targetTime);
};

/**
 * Check if current time is after given time
 */
export const isAfterTime = (currentTime: string, targetTime: string): boolean => {
  return parseTime(currentTime) > parseTime(targetTime);
};

/**
 * Get current time in HH:mm format
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Add days to date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Get start of day
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours} jam ${mins > 0 ? mins + ' menit' : ''}`;
  }
  return `${mins} menit`;
};
