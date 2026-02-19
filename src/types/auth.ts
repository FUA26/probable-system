// User profile
export interface UserProfile {
  nip: string;
  nama: string;
  email?: string;
  jabatan?: string;
  departemen?: string;
  kantor?: string;
  foto?: string;
}

// Login request
export interface LoginRequest {
  nip: string;
  deviceId: string;
}

// Login response
export interface LoginResponse {
  ok: boolean;
  token: string;
  user: UserProfile;
  deviceRegistered?: boolean;
}

// Token check response
export interface TokenCheckResponse {
  ok: boolean;
  valid: boolean;
  user?: UserProfile;
}

// Shift information
export interface ShiftInfo {
  shift: string;
  namaShift: string;
  jamMasuk: string;
  jamPulang: string;
}

// Shift schedule
export interface ShiftSchedule {
  hari: string;
  shift: ShiftInfo;
}

// Office location
export interface OfficeLocation {
  id: number;
  nama: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radius: number;
}
