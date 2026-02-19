// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  DEVICE_ID: 'device_id',
  USER_PROFILE: 'user_profile',
  TODAY_STATUS: 'today_status',
  SHIFT_DATA: 'shift_data',
} as const;

// Attendance types
export const ATTENDANCE_TYPES = {
  WFO: '',
  WFH: 'WFH',
  PDL: 'PDL',
} as const;

// Attendance status
export const ATTENDANCE_STATUS = {
  MASUK: '1',
  KELUAR: '0',
} as const;

// Days of week (0 = Sunday)
export const DAYS_OF_WEEK = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const;
