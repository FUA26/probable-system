// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'prescap_token',
  USER: 'prescap_user',
  DEVICE_ID: 'prescap_device_id',
} as const;

// Attendance types
export const ATTENDANCE_TYPES = {
  CHECK_IN: 'masuk',
  CHECK_OUT: 'pulang',
} as const;

// Attendance status
export const ATTENDANCE_STATUS = {
  ON_TIME: 'tepat_waktu',
  LATE: 'terlambat',
  EARLY: 'pulang_cepat',
} as const;

// Days of week (Indonesian)
export const DAYS_OF_WEEK = {
  SUNDAY: 'Minggu',
  MONDAY: 'Senin',
  TUESDAY: 'Selasa',
  WEDNESDAY: 'Rabu',
  THURSDAY: 'Kamis',
  FRIDAY: 'Jumat',
  SATURDAY: 'Sabtu',
} as const;
