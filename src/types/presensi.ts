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
  masuk: string;
  keluar: string;
  status: string;
  terlambat: string;
  pulang_awal: string;
  is_late: boolean;
  is_early: boolean;
  jadwal_masuk: string;
  jadwal_keluar: string;
  foto: string;
  foto2: string;
  lokasi: string;
  lokasi_keluar: string;
  verifikasi: string;
  skpd: string;
  id_shift: number;
  keterangan: string;
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
  checkInTime: string;
  checkOutTime: string;
  status: string;
  isLate: boolean;
  lateMinutes: number;
  isEarly: boolean;
  earlyMinutes: number;
}
