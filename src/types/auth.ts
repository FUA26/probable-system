// User profile from backend
export interface UserProfile {
  idtbPegawai: number;
  nipBaru: string;
  idelektronik: number;
  namaPegawai: string;
  jabatan: string;
  skpd: string;
  opd: string;
  shift: number;
  idKantor: number;
  device_id: string;
}

// Login request
export interface LoginRequest {
  nip: string;
  device_id: string;
}

// Login response
export interface LoginResponse {
  token: string;
  user: UserProfile;
  shift: ShiftInfo;
  lokasiKantor: OfficeLocation;
}

// Token check response
export interface TokenCheckResponse {
  active: boolean;
  exp: number;
  expISO: string;
  now: number;
  remainingSeconds: number;
  user: {
    idtbPegawai: number;
    skpd: string;
  };
}

// Shift info
export interface ShiftInfo {
  id_shift: number;
  today: ShiftSchedule;
  detail: ShiftSchedule[];
}

export interface ShiftSchedule {
  id_shift: number;
  hari: number;
  jam_masuk: string;
  jam_keluar: string;
}

// Office location
export interface OfficeLocation {
  id: number;
  nama_lokasi: string;
  lat: string;
  lng: string;
  radius: number;
}
