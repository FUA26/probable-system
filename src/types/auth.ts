// User profile
export interface UserProfile {
  idtbPegawai: number;
  nipBaru: string;
  idelektronik: string;
  namaPegawai: string;
  jabatan: string;
  skpd: string;
  opd: string;
  shift: string;
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
  shift: string;
  lokasiKantor: string;
}

// Token check response
export interface TokenCheckResponse {
  active: boolean;
  exp: number;
  expISO: string;
  now: number;
  remainingSeconds: number;
  user: UserProfile;
}

// Shift information
export interface ShiftInfo {
  id_shift: number;
  today: string;
  detail: {
    jam_masuk: string;
    jam_keluar: string;
  };
}

// Shift schedule
export interface ShiftSchedule {
  id_shift: number;
  hari: string;
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
