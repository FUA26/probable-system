// Attendance submit data
export interface AttendanceSubmitData {
  latitude: number;
  longitude: number;
  address: string;
  foto: string;
  deviceId: string;
}

// Attendance submit response
export interface AttendanceSubmitResponse {
  ok: boolean;
  message: string;
  data?: {
    id: number;
    waktu: string;
    jenis: string;
    lokasi: string;
    status: string;
  };
}

// Attendance record
export interface AttendanceRecord {
  id: number;
  nip: string;
  tanggal: string;
  waktu: string;
  jenis: string;
  lokasi: string;
  latitude: number;
  longitude: number;
  foto: string;
  status: string;
  deviceId: string;
  createdAt: string;
}

// Attendance history response
export interface AttendanceHistoryResponse {
  ok: boolean;
  data: AttendanceRecord[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Today's status
export interface TodayStatus {
  sudahAbsenMasuk: boolean;
  sudahAbsenPulang: boolean;
  jamMasuk?: string;
  jamPulang?: string;
  shift?: string;
}
