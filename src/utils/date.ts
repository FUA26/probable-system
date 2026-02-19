/**
 * Format date - simply return the string from backend as-is
 * Or format basic YYYY-MM-DD to readable format
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date || date === '' || date === 'null' || date === '-') {
    return '-';
  }

  const dateMatch = String(date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    // Need to handle month conversion properly (1-indexed input to 0-indexed array)
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
    }
  }

  return String(date);
};

/**
 * Format time - return time string as-is
 */
export const formatTime = (time: string | null | undefined): string => {
  if (!time || time === '' || time === 'null' || time === '-') {
    return '--:--';
  }

  return String(time);
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string, time: string): string => {
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  if (formattedDate === '-' && formattedTime === '--:--') {
    return '-';
  }

  return `${formattedDate} ${formattedTime}`;
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
 * Helper to safely parse date string or Date object
 */
export const parseDateSafe = (date: Date | string): Date | null => {
  if (date instanceof Date) {
    return date;
  }

  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return null;
  }

  return d;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = parseDateSafe(date);

  if (!dateObj) {
    return false;
  }

  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};
