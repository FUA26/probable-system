/**
 * Parse date string safely (handles various formats)
 */
const parseDateSafe = (date: Date | string): Date | null => {
  if (!date) return null;

  // If already a Date object, check if valid
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }

  // Handle string formats
  const dateStr = String(date).trim();

  if (!dateStr || dateStr === '' || dateStr === '-' || dateStr === 'null') {
    return null;
  }

  // Try parsing with Date constructor first (handles YYYY-MM-DD, ISO dates, etc.)
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // Try DD/MM/YYYY or DD-MM-YYYY format (common Indonesian format)
  const parts = dateStr.split(/[\s/\-]/);
  if (parts.length === 3) {
    // Check if it's DD/MM/YYYY format
    const [day, month, year] = parts.map(Number);
    if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
      const dateFromParts = new Date(year, month - 1, day);
      if (!isNaN(dateFromParts.getTime())) {
        return dateFromParts;
      }
    }
  }

  // Try time-only format (HH:mm or HH:mm:ss) - use today's date with that time
  const timeMatch = dateStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (timeMatch) {
    const today = new Date();
    today.setHours(
      parseInt(timeMatch[1], 10),
      parseInt(timeMatch[2], 10),
      timeMatch[3] ? parseInt(timeMatch[3], 10) : 0,
      0
    );
    return today;
  }

  return null;
};

/**
 * Format date to Indonesian locale
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = parseDateSafe(date);

  if (!dateObj) {
    return '-';
  }

  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to HH:mm format
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = parseDateSafe(date);

  if (!dateObj) {
    return '--:--';
  }

  return dateObj.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = parseDateSafe(date);

  if (!dateObj) {
    return '-';
  }

  return `${formatDate(dateObj)} ${formatTime(dateObj)}`;
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
