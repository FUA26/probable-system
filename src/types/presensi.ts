// Attendance submit data
export interface AttendanceSubmitData {
  lat: string;
  long: string;
  jenis: string;
  status: string;
  keterangan: string;
  foto: string;
}

// Attendance submit response
export interface AttendanceSubmitResponse {
  ok: boolean;
  queued: boolean;
  queue_id: string;
  tgl: string;
  jenis: string;
  aksi: string;
  waktu: string;
  lokasi: string;
  foto: string;
  terlambat: string;
  pulang_awal: string;
}

// Attendance record
export interface AttendanceRecord {
  tgl: string;
  masuk: string | null;
  keluar: string | null;
  status: string;
  terlambat: number;
  pulang_awal: number;
  is_late: boolean | null;
  is_early: boolean | null;
  jadwal_masuk: string;
  jadwal_keluar: string;
  foto: string | null;
  foto2: string | null;
  lokasi: string;
  lokasi_keluar: string | null;
  verifikasi: string;
  skpd: number;
  id_shift: number;
  keterangan: string | null;
}

// Attendance history response
export interface AttendanceHistoryResponse {
  ok: boolean;
  range: string;
  count: number;
  data: AttendanceRecord[];
}

// Today's status
export interface TodayStatus {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'WFO' | 'WFH' | 'PDL' | string;
  isLate: boolean;
  lateMinutes: number;
  isEarly: boolean;
  earlyMinutes: number;
}

// Office location
export interface OfficeLocation {
  lat: number;
  lng: number;
  radius: number;
  name: string;
}
