// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'prescap_token',
  USER: 'prescap_user',
  DEVICE_ID: 'prescap_device_id',
  LAST_CHECK_IN: 'prescap_last_check_in',
  LAST_CHECK_OUT: 'prescap_last_check_out',
  SETTINGS: 'prescap_settings',
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
  ON_TIME_OUT: 'tepat_waktu_pulang',
  UNKNOWN: 'unknown',
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

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    CHECK_TOKEN: '/auth/check-token',
  },
  USER: {
    PROFILE: '/user/profile',
    SHIFT: '/user/shift',
    OFFICE: '/user/kantor',
  },
  ATTENDANCE: {
    SUBMIT: '/presensi/submit',
    HISTORY: '/presensi/history',
    TODAY: '/presensi/today',
    STATUS: '/presensi/status',
  },
  DEVICE: {
    REGISTER: '/device/register',
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'NIP atau perangkat tidak valid',
  TOKEN_EXPIRED: 'Sesi telah berakhir, silakan login kembali',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan',
  LOCATION_REQUIRED: 'Lokasi harus diaktifkan untuk absen',
  CAMERA_REQUIRED: 'Kamera diperlukan untuk mengambil foto',
  PERMISSION_DENIED: 'Izin tidak diberikan',
  ALREADY_CHECKED_IN: 'Anda sudah absen masuk hari ini',
  ALREADY_CHECKED_OUT: 'Anda sudah absen pulang hari ini',
  OUTSIDE_RADIUS: 'Anda berada di luar radius kantor',
  GENERIC: 'Terjadi kesalahan, silakan coba lagi',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CHECK_IN: 'Berhasil absen masuk',
  CHECK_OUT: 'Berhasil absen pulang',
  LOGIN: 'Berhasil login',
  LOGOUT: 'Berhasil logout',
  DEVICE_REGISTERED: 'Perangkat berhasil terdaftar',
} as const;
