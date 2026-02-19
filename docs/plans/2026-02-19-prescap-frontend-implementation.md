# Prescap Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete mobile attendance web application with Android APK and iOS PWA support, featuring login, check-in/out with geolocation and camera, history, and profile management.

**Architecture:** Single React 19 + TypeScript codebase using React Router for navigation, Context API for state management, Tailwind CSS for styling, and platform adapters (Capacitor for Android, browser APIs for iOS PWA). App communicates with existing backend API at `http://localhost:4000/api/v1`.

**Tech Stack:** React 19, TypeScript, Vite, React Router v6, Tailwind CSS, Axios, Capacitor 6 (Android only), React Hook Form, react-hot-toast, date-fns, vite-plugin-pwa

---

## Phase 1: Project Foundation

### Task 1: Install Core Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install React Router**

```bash
npm install react-router-dom
```

Expected: Dependencies added to package.json and node_modules

**Step 2: Install Tailwind CSS and dependencies**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: `tailwind.config.js` and `postcss.config.js` created

**Step 3: Install additional dependencies**

```bash
# HTTP client
npm install axios

# Forms
npm install react-hook-form

# Icons
npm install react-icons

# Toast notifications
npm install react-hot-toast

# Date utilities
npm install date-fns

# PWA plugin
npm install -D vite-plugin-pwa
```

Expected: All packages installed

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: install core dependencies (router, http, forms, icons, toast, date, pwa)"
```

---

### Task 2: Configure Tailwind CSS

**Files:**
- Modify: `tailwind.config.js`
- Modify: `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Update Tailwind config**

Open `tailwind.config.js` and replace content with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

**Step 2: Update PostCSS config**

Open `postcss.config.js` and ensure it contains:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 3: Add Tailwind directives to index.css**

Open `src/index.css` and replace all content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}
```

**Step 4: Test Tailwind is working**

Start dev server:

```bash
npm run dev
```

Expected: Vite dev server starts without errors

**Step 5: Commit**

```bash
git add tailwind.config.js postcss.config.js src/index.css
git commit -m "feat: configure Tailwind CSS with custom theme"
```

---

### Task 3: Configure Vite with PWA Plugin

**Files:**
- Modify: `vite.config.ts`
- Create: `public/manifest.json`

**Step 1: Update Vite config**

Open `vite.config.ts` and replace with:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'splash.png'],
      manifest: {
        name: 'Prescap - Presensi Pegawai',
        short_name: 'Prescap',
        description: 'Aplikasi presensi pegawai',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

**Step 2: Create PWA manifest**

Create `public/manifest.json`:

```json
{
  "name": "Prescap - Presensi Pegawai",
  "short_name": "Prescap",
  "description": "Aplikasi presensi pegawai",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Step 3: Create icons directory**

```bash
mkdir -p public/icons
```

Note: Icon files will be added later. For now, placeholder files can be used.

**Step 4: Update index.html with iOS meta tags**

Open `index.html` and add iOS meta tags in `<head>`:

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Prescap">
<link rel="apple-touch-icon" href="icons/icon-192x192.png">
```

**Step 5: Test build**

```bash
npm run build
```

Expected: Build completes successfully with PWA manifest

**Step 6: Commit**

```bash
git add vite.config.ts public/manifest.json public/icons index.html
git commit -m "feat: configure PWA with Vite plugin and manifest"
```

---

### Task 4: Create Project Structure

**Files:**
- Create: `src/types/api.ts`
- Create: `src/types/auth.ts`
- Create: `src/types/presensi.ts`
- Create: `src/config/env.ts`
- Create: `src/config/development.ts`
- Create: `src/utils/constants.ts`
- Create: `src/utils/validation.ts`
- Create: `src/utils/date.ts`
- Create: `.env.development`
- Create: `.env.production`

**Step 1: Create TypeScript types for API**

Create `src/types/api.ts`:

```typescript
// API Response wrapper
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Error response
export interface ApiError {
  error: string;
  message?: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

**Step 2: Create auth types**

Create `src/types/auth.ts`:

```typescript
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
```

**Step 3: Create presensi types**

Create `src/types/presensi.ts`:

```typescript
// Attendance submission
export interface AttendanceSubmitData {
  lat: string;
  long: string;
  jenis: '' | 'WFH' | 'PDL'; // empty = WFO
  status: '0' | '1'; // 0 = keluar, 1 = masuk
  keterangan?: string;
  foto?: string;
}

// Attendance submission response
export interface AttendanceSubmitResponse {
  ok: boolean;
  queued: boolean;
  queue_id: string;
  tgl: string;
  jenis: string;
  aksi: 'masuk' | 'keluar';
  waktu: string;
  lokasi: string;
  foto: string | null;
  terlambat?: number;
  pulang_awal?: number;
}

// Attendance history record
export interface AttendanceRecord {
  tgl: string;
  masuk: string | null;
  keluar: string | null;
  status: 'WFO' | 'WFH' | 'PDL';
  terlambat: number;
  pulang_awal: number;
  is_late: boolean;
  is_early: boolean;
  jadwal_masuk: string;
  jadwal_keluar: string;
  foto: string | null;
  foto2: string | null;
  lokasi: string;
  lokasi_keluar: string;
  verifikasi: string;
  skpd: string;
  id_shift: number;
  keterangan: string | null;
}

// History response
export interface AttendanceHistoryResponse {
  ok: boolean;
  range: {
    start: string;
    end: string;
  };
  count: number;
  data: AttendanceRecord[];
}

// Today's attendance status
export interface TodayStatus {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'WFO' | 'WFH' | 'PDL';
  isLate: boolean;
  lateMinutes: number;
  isEarly: boolean;
  earlyMinutes: number;
}
```

**Step 4: Create environment config**

Create `src/config/env.ts`:

```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  debug: import.meta.env.VITE_DEBUG === 'true',
  deviceId: import.meta.env.VITE_DEVICE_ID,
  validNip: import.meta.env.VITE_VALID_NIP,
};
```

**Step 5: Create development config**

Create `src/config/development.ts`:

```typescript
// ⚠️ IMPORTANT: FOR DEVELOPMENT ONLY
export const DEV_CONFIG = {
  // Valid NIP for testing
  VALID_NIP: '199506262024211024',

  // Hardcoded device ID for development
  DEVICE_ID: '12345',

  // Development API URL
  API_URL: 'http://localhost:4000',

  // Enable debug mode
  DEBUG: true,
};
```

**Step 6: Create constants**

Create `src/utils/constants.ts`:

```typescript
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
```

**Step 7: Create validation utilities**

Create `src/utils/validation.ts`:

```typescript
// Validate NIP format (18 digits)
export const validateNIP = (nip: string): boolean => {
  const nipRegex = /^\d{18}$/;
  return nipRegex.test(nip);
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Validate latitude
export const isValidLatitude = (lat: string): boolean => {
  const num = parseFloat(lat);
  return num >= -90 && num <= 90;
};

// Validate longitude
export const isValidLongitude = (lng: string): boolean => {
  const num = parseFloat(lng);
  return num >= -180 && num <= 180;
};
```

**Step 8: Create date utilities**

Create `src/utils/date.ts`:

```typescript
import { format, formatDistanceToNow, isToday, parse } from 'date-fns';
import { id } from 'date-fns/locale';

// Format date to Indonesian locale
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd MMMM yyyy', { locale: id });
};

// Format time
export const formatTime = (time: string): string => {
  return time.substring(0, 5); // HH:MM
};

// Format date and time
export const formatDateTime = (dateTime: string): string => {
  const d = new Date(dateTime);
  return format(d, 'dd MMMM yyyy, HH:mm', { locale: id });
};

// Get greeting based on time
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

// Parse time string (HH:MM:SS) to Date
export const parseTime = (timeString: string): Date => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0, 0);
  return date;
};

// Calculate difference in minutes
export const diffInMinutes = (date1: Date, date2: Date): number => {
  return Math.floor((date1.getTime() - date2.getTime()) / 60000);
};
```

**Step 9: Create environment files**

Create `.env.development`:

```bash
VITE_API_URL=http://localhost:4000
VITE_DEVICE_ID=12345
VITE_VALID_NIP=199506262024211024
VITE_DEBUG=true
```

Create `.env.production`:

```bash
VITE_API_URL=https://api.prescap.com
VITE_DEBUG=false
```

**Step 10: Commit**

```bash
git add src/types src/config src/utils .env.development .env.production
git commit -m "feat: create project structure with types, config, and utilities"
```

---

## Phase 2: Authentication System

### Task 5: Create Storage Service

**Files:**
- Create: `src/services/storage/storage.ts`

**Step 1: Create storage service**

Create `src/services/storage/storage.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  },

  async clear(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  },
};
```

**Step 2: Commit**

```bash
git add src/services/storage/storage.ts
git commit -m "feat: create secure storage service with platform abstraction"
```

---

### Task 6: Create API Client

**Files:**
- Create: `src/services/api/base.ts`

**Step 1: Create API client with interceptors**

Create `src/services/api/base.ts`:

```typescript
import axios, { AxiosError, AxiosInstance } from 'axios';
import { secureStorage } from '../storage/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await secureStorage.removeItem('auth_token');
      await secureStorage.removeItem('user_profile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Step 2: Commit**

```bash
git add src/services/api/base.ts
git commit -m "feat: create API client with auth interceptors"
```

---

### Task 7: Create Auth API Service

**Files:**
- Create: `src/services/api/auth.ts`

**Step 1: Create auth API endpoints**

Create `src/services/api/auth.ts`:

```typescript
import apiClient from './base';
import { LoginRequest, LoginResponse, TokenCheckResponse, UserProfile } from '../../types/auth';

export const authAPI = {
  /**
   * Login with NIP and device ID
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ profile: UserProfile }> {
    const response = await apiClient.get<{ profile: UserProfile }>('/auth/me');
    return response.data;
  },

  /**
   * Check token validity
   */
  async checkToken(): Promise<TokenCheckResponse> {
    const response = await apiClient.get<TokenCheckResponse>('/auth/check');
    return response.data;
  },

  /**
   * Logout (stateless, client-side only)
   */
  async logout(): Promise<{ ok: boolean }> {
    const response = await apiClient.post<{ ok: boolean }>('/auth/logout');
    return response.data;
  },
};
```

**Step 2: Commit**

```bash
git add src/services/api/auth.ts
git commit -m "feat: create auth API service endpoints"
```

---

### Task 8: Create Device ID Generator

**Files:**
- Create: `src/services/platform/device.ts`

**Step 1: Create device service**

Create `src/services/platform/device.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { secureStorage } from '../storage/storage';
import { DEV_CONFIG } from '../../config/development';

const DEVICE_ID_STORAGE_KEY = 'device_id';

/**
 * Generate or retrieve device ID
 * In development, uses hardcoded value from DEV_CONFIG
 */
export async function getDeviceId(): Promise<string> {
  // Check if running in development mode
  const isDev = import.meta.env.DEV;

  if (isDev && DEV_CONFIG.DEVICE_ID) {
    // Use hardcoded device ID in development
    return DEV_CONFIG.DEVICE_ID;
  }

  // Check if device ID already exists in storage
  const existingId = await secureStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  // Generate new device ID
  let deviceId: string;

  if (Capacitor.isNativePlatform()) {
    // Use Capacitor Device API on native
    const info = await Device.getId();
    deviceId = info.identifier;
  } else {
    // Generate unique ID for web
    deviceId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Store for future use
  await secureStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);

  return deviceId;
}

/**
 * Get platform information
 */
export async function getPlatform(): Promise<'web' | 'android' | 'ios'> {
  if (!Capacitor.isNativePlatform()) {
    return 'web';
  }

  const platform = await Capacitor.getPlatform();
  if (platform === 'android') return 'android';
  if (platform === 'ios') return 'ios';
  return 'web';
}
```

**Step 2: Commit**

```bash
git add src/services/platform/device.ts
git commit -m "feat: create device ID generator with platform detection"
```

---

### Task 9: Create AuthContext

**Files:**
- Create: `src/contexts/AuthContext.tsx`

**Step 1: Create AuthContext provider**

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api/auth';
import { secureStorage } from '../services/storage/storage';
import { getDeviceId, getPlatform } from '../services/platform/device';
import { UserProfile } from '../types/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  deviceId: string;
  platform: 'web' | 'android' | 'ios';
  login: (nip: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [platform, setPlatform] = useState<'web' | 'android' | 'ios'>('web');

  // Initialize: check if user is already authenticated
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get device ID
        const id = await getDeviceId();
        setDeviceId(id);

        // Get platform
        const plat = await getPlatform();
        setPlatform(plat);

        // Check for existing token
        const storedToken = await secureStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);

          // Validate token with backend
          try {
            const checkResult = await authAPI.checkToken();
            if (checkResult.active) {
              // Token is valid, fetch user profile
              const profileData = await authAPI.getProfile();
              setUser(profileData.profile);
            } else {
              // Token expired
              await secureStorage.removeItem('auth_token');
              setToken(null);
            }
          } catch (error) {
            // Token validation failed
            await secureStorage.removeItem('auth_token');
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (nip: string) => {
    try {
      const response = await authAPI.login({ nip, device_id: deviceId });

      // Store token
      await secureStorage.setItem('auth_token', response.token);
      setToken(response.token);

      // Store user data
      setUser(response.user);
      await secureStorage.setItem('user_profile', JSON.stringify(response.user));

      toast.success('Login berhasil');
    } catch (error: any) {
      const errorCode = error.response?.data?.error;

      if (errorCode === 'nip_and_device_id_are_required') {
        toast.error('NIP dan Device ID harus diisi');
      } else if (errorCode === 'invalid_credentials') {
        toast.error('NIP tidak ditemukan');
      } else if (errorCode === 'invalid_device') {
        toast.error('Perangkat tidak terdaftar');
      } else {
        toast.error('Login gagal. Silakan coba lagi');
      }

      throw error;
    }
  }, [deviceId]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await secureStorage.removeItem('auth_token');
      await secureStorage.removeItem('user_profile');
      setToken(null);
      setUser(null);
      toast.success('Logout berhasil');
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const checkResult = await authAPI.checkToken();
      return checkResult.active;
    } catch (error) {
      return false;
    }
  }, []);

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoading,
    user,
    deviceId,
    platform,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Step 2: Commit**

```bash
git add src/contexts/AuthContext.tsx
git commit -m "feat: create AuthContext with login/logout/checkAuth"
```

---

### Task 10: Create UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/LoadingSpinner.tsx`

**Step 1: Create Button component**

Create `src/components/ui/Button.tsx`:

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
```

**Step 2: Create Input component**

Create `src/components/ui/Input.tsx`:

```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

**Step 3: Create Card component**

Create `src/components/ui/Card.tsx`:

```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md p-4';
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

**Step 4: Create Badge component**

Create `src/components/ui/Badge.tsx`:

```typescript
import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gray',
  children,
  className = '',
}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
```

**Step 5: Create LoadingSpinner component**

Create `src/components/ui/LoadingSpinner.tsx`:

```typescript
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} text-primary-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};
```

**Step 6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: create base UI components (Button, Input, Card, Badge, LoadingSpinner)"
```

---

### Task 11: Create LoginPage

**Files:**
- Create: `src/pages/LoginPage.tsx`

**Step 1: Create login page**

Create `src/pages/LoginPage.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { DEV_CONFIG } from '../config/development';
import { validateNIP } from '../utils/validation';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, deviceId, platform, isAuthenticated } = useAuth();
  const [nip, setNip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDev = import.meta.env.DEV;

  // Pre-fill NIP in development mode
  useEffect(() => {
    if (isDev && DEV_CONFIG.VALID_NIP) {
      setNip(DEV_CONFIG.VALID_NIP);
    }
  }, [isDev]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!nip) {
      setError('NIP harus diisi');
      return;
    }

    if (!validateNIP(nip)) {
      setError('Format NIP tidak valid (18 digit angka)');
      return;
    }

    setIsLoading(true);

    try {
      await login(nip);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.error === 'invalid_credentials') {
        setError('NIP tidak ditemukan');
      } else if (err.response?.data?.error === 'invalid_device') {
        setError('Perangkat tidak terdaftar');
      } else {
        setError('Login gagal. Silakan coba lagi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Prescap</h1>
          <p className="text-gray-600 mt-1">Presensi Pegawai</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            {isDev && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Mode Pengembangan:</strong>
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  NIP: {DEV_CONFIG.VALID_NIP}
                </p>
                <p className="text-xs text-yellow-700">
                  Device ID: {deviceId}
                </p>
              </div>
            )}

            <Input
              label="Nomor Induk Pegawai (NIP)"
              type="text"
              inputMode="numeric"
              placeholder="Masukkan 18 digit NIP"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              error={error}
              maxLength={18}
              autoFocus
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device ID
              </label>
              <input
                type="text"
                value={deviceId}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                ID perangkat terdeteksi secara otomatis
              </p>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Platform:</strong> {platform.toUpperCase()}
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!nip}
            >
              Masuk
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Silakan login menggunakan NIP dan perangkat terdaftar
        </p>
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add src/pages/LoginPage.tsx
git commit -m "feat: create login page with NIP validation and dev mode support"
```

---

### Task 12: Set up React Router

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/layout/MainLayout.tsx`

**Step 1: Update main.tsx to include Toaster and Router**

Open `src/main.tsx` and replace with:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 2: Update App.tsx with routing**

Open `src/App.tsx` and replace with:

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
```

Note: This will cause errors until we create the placeholder pages. Let's create them next.

**Step 3: Create placeholder pages**

Create `src/pages/HomePage.tsx`:

```typescript
import React from 'react';

export const HomePage: React.FC = () => {
  return <div className="p-4">Home Page - Coming Soon</div>;
};
```

Create `src/pages/HistoryPage.tsx`:

```typescript
import React from 'react';

export const HistoryPage: React.FC = () => {
  return <div className="p-4">History Page - Coming Soon</div>;
};
```

Create `src/pages/ProfilePage.tsx`:

```typescript
import React from 'react';

export const ProfilePage: React.FC = () => {
  return <div className="p-4">Profile Page - Coming Soon</div>;
};
```

**Step 4: Test the app**

```bash
npm run dev
```

Expected: App starts, shows login page, can login with dev credentials

**Step 5: Commit**

```bash
git add src/main.tsx src/App.tsx src/pages/HomePage.tsx src/pages/HistoryPage.tsx src/pages/ProfilePage.tsx
git commit -m "feat: set up React Router with protected routes and authentication flow"
```

---

## Phase 3: Core Pages Implementation

### Task 13: Create Bottom Navigation

**Files:**
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/MainLayout.tsx`

**Step 1: Create BottomNav component**

Create `src/components/layout/BottomNav.tsx`:

```typescript
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaClock, FaUser } from 'react-icons/fa';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Beranda', icon: <FaHome size={20} /> },
  { path: '/history', label: 'Riwayat', icon: <FaClock size={20} /> },
  { path: '/profile', label: 'Profil', icon: <FaUser size={20} /> },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className={isActive ? 'text-primary-600' : 'text-gray-600'}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

**Step 2: Create Header component**

Create `src/components/layout/Header.tsx`:

```typescript
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-primary-600 text-white px-4 py-4 sticky top-0 z-40">
      <div className="max-w-lg mx-auto">
        {title ? (
          <h1 className="text-xl font-bold">{title}</h1>
        ) : (
          <div>
            <p className="text-sm text-primary-100">
              Selamat datang,
            </p>
            <h1 className="text-xl font-bold">
              {user?.namaPegawai || 'Pegawai'}
            </h1>
          </div>
        )}
      </div>
    </header>
  );
};
```

**Step 3: Create MainLayout component**

Create `src/components/layout/MainLayout.tsx`:

```typescript
import React from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={title} />
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
```

**Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: create MainLayout with BottomNav and Header components"
```

---

### Task 14: Create Platform Adapters (Geolocation & Camera)

**Files:**
- Create: `src/services/platform/geolocation.ts`
- Create: `src/services/platform/camera.ts`

**Step 1: Create geolocation service**

Create `src/services/platform/geolocation.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Geolocation as CapacitorGeolocation } from '@capacitor/geolocation';
import toast from 'react-hot-toast';

export interface LocationData {
  lat: string;
  lng: string;
  accuracy: number;
}

/**
 * Get current device location
 * Uses Capacitor plugin on native, browser API on web
 */
export async function getCurrentLocation(): Promise<LocationData> {
  const isCapacitor = Capacitor.isNativePlatform();

  try {
    if (isCapacitor) {
      // Use Capacitor Geolocation plugin
      const result = await CapacitorGeolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      return {
        lat: result.coords.latitude.toString(),
        lng: result.coords.longitude.toString(),
        accuracy: result.coords.accuracy || 0,
      };
    } else {
      // Use Browser Geolocation API
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation tidak didukung di browser ini'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString(),
              accuracy: position.coords.accuracy || 0,
            });
          },
          (error) => {
            handleLocationError(error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    }
  } catch (error: any) {
    handleLocationError(error);
    throw error;
  }
}

/**
 * Handle geolocation errors
 */
function handleLocationError(error: GeolocationPositionError | any): void {
  if (error.code === error.PERMISSION_DENIED) {
    toast.error('Izin lokasi dibutuhkan. Silakan aktifkan di pengaturan.');
  } else if (error.code === error.POSITION_UNAVAILABLE) {
    toast.error('Lokasi tidak dapat ditemukan. Pastikan GPS aktif.');
  } else if (error.code === error.TIMEOUT) {
    toast.error('Waktu habis mendeteksi lokasi. Silakan coba lagi.');
  } else {
    toast.error('Gagal mendapatkan lokasi. Coba lagi.');
  }
}

/**
 * Calculate distance between two coordinates (in meters)
 */
export function calculateDistance(
  lat1: string,
  lon1: string,
  lat2: string,
  lon2: string
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (parseFloat(lat1) * Math.PI) / 180;
  const φ2 = (parseFloat(lat2) * Math.PI) / 180;
  const Δφ = ((parseFloat(lat2) - parseFloat(lat1)) * Math.PI) / 180;
  const Δλ = ((parseFloat(lon2) - parseFloat(lon1)) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

**Step 2: Create camera service**

Create `src/services/platform/camera.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import toast from 'react-hot-toast';

/**
 * Capture photo from camera
 * Uses Capacitor plugin on native, file input on web
 */
export async function capturePhoto(): Promise<string> {
  const isCapacitor = Capacitor.isNativePlatform();

  try {
    if (isCapacitor) {
      // Use Capacitor Camera plugin
      const result = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      return result.dataUrl || '';
    } else {
      // Use file input with capture attribute
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // rear camera

        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
              toast.error('Ukuran foto maksimal 5MB');
              reject(new Error('File too large'));
              return;
            }

            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => {
              toast.error('Gagal membaca foto');
              reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
          } else {
            reject(new Error('Camera cancelled'));
          }
        };

        input.oncancel = () => {
          reject(new Error('Camera cancelled'));
        };

        input.click();
      });
    }
  } catch (error: any) {
    if (error.message === 'User cancelled photos app') {
      throw error; // Don't show toast for cancellation
    }

    toast.error('Gagal membuka kamera. Pastikan izin kamera aktif.');
    throw error;
  }
}
```

**Step 3: Commit**

```bash
git add src/services/platform/geolocation.ts src/services/platform/camera.ts
git commit -m "feat: create platform adapters for geolocation and camera"
```

---

### Task 15: Create Presensi API Service

**Files:**
- Create: `src/services/api/presensi.ts`

**Step 1: Create presensi API endpoints**

Create `src/services/api/presensi.ts`:

```typescript
import apiClient from './base';
import { AttendanceSubmitData, AttendanceSubmitResponse, AttendanceHistoryResponse } from '../../types/presensi';

export const presensiAPI = {
  /**
   * Submit attendance (check-in/check-out)
   */
  async submit(data: FormData): Promise<AttendanceSubmitResponse> {
    const response = await apiClient.post<AttendanceSubmitResponse>('/presensi/submit', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get attendance history (last 30 days)
   */
  async getHistory(): Promise<AttendanceHistoryResponse> {
    const response = await apiClient.get<AttendanceHistoryResponse>('/presensi/history');
    return response.data;
  },
};
```

**Step 2: Commit**

```bash
git add src/services/api/presensi.ts
git commit -m "feat: create presensi API service endpoints"
```

---

### Task 16: Create AppContext

**Files:**
- Create: `src/contexts/AppContext.tsx`

**Step 1: Create AppContext for attendance state**

Create `src/contexts/AppContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { presensiAPI } from '../services/api/presensi';
import { getCurrentLocation, calculateDistance } from '../services/platform/geolocation';
import { capturePhoto } from '../services/platform/camera';
import { TodayStatus, AttendanceRecord, OfficeLocation } from '../types/presensi';
import { parseTime, diffInMinutes } from '../utils/date';
import { toast } from 'react-hot-toast';

interface AppContextType {
  todayStatus: TodayStatus | null;
  officeLocation: OfficeLocation | null;
  currentLocation: { lat: string; lng: string } | null;
  isLoadingLocation: boolean;
  isSubmitting: boolean;
  fetchTodayStatus: () => Promise<void>;
  submitAttendance: (type: 'masuk' | 'keluar', attendanceType: '' | 'WFH' | 'PDL', keterangan?: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null);
  const [officeLocation, setOfficeLocation] = useState<OfficeLocation | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch today's status on mount
  useEffect(() => {
    if (user) {
      // Get office location from user data
      // This would come from the login response
      // For now, we'll set it from shift data
    }
  }, [user]);

  const fetchTodayStatus = useCallback(async () => {
    try {
      const response = await presensiAPI.getHistory();
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = response.data.find((record) => record.tgl === today);

      if (todayRecord) {
        setTodayStatus({
          hasCheckedIn: !!todayRecord.masuk,
          hasCheckedOut: !!todayRecord.keluar,
          checkInTime: todayRecord.masuk,
          checkOutTime: todayRecord.keluar,
          status: todayRecord.status,
          isLate: todayRecord.is_late,
          lateMinutes: todayRecord.terlambat,
          isEarly: todayRecord.is_early,
          earlyMinutes: todayRecord.pulang_awal,
        });
      } else {
        setTodayStatus({
          hasCheckedIn: false,
          hasCheckedOut: false,
          checkInTime: null,
          checkOutTime: null,
          status: 'WFO',
          isLate: false,
          lateMinutes: 0,
          isEarly: false,
          earlyMinutes: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch today status:', error);
    }
  }, []);

  const getCurrentLocationHandler = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setCurrentLocation({ lat: location.lat, lng: location.lng });
      return location;
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const submitAttendance = useCallback(async (
    type: 'masuk' | 'keluar',
    attendanceType: '' | 'WFH' | 'PDL',
    keterangan?: string
  ) => {
    // Validation
    if (type === 'masuk' && todayStatus?.hasCheckedIn) {
      toast.warning('Anda sudah melakukan presensi masuk hari ini');
      return;
    }

    if (type === 'keluar' && !todayStatus?.hasCheckedIn) {
      toast.error('Anda belum melakukan presensi masuk');
      return;
    }

    if (type === 'keluar' && todayStatus?.hasCheckedOut) {
      toast.warning('Anda sudah melakukan presensi keluar');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get location
      const location = await getCurrentLocationHandler();

      // Check if within office radius (for WFO)
      if (attendanceType === '' && officeLocation) {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          officeLocation.lat,
          officeLocation.lng
        );

        if (distance > officeLocation.radius) {
          toast.warning(
            `Anda berada di luar radius kantor (${Math.round(distance)}m). ` +
            `Radius yang diizinkan: ${officeLocation.radius}m`
          );
          // Still allow submission, just warn
        }
      }

      // Capture photo (optional, can be skipped)
      let photoDataUrl: string | undefined;
      try {
        photoDataUrl = await capturePhoto();
      } catch (error: any) {
        if (error.message === 'Camera cancelled' || error.message === 'User cancelled photos app') {
          // User cancelled, proceed without photo
          photoDataUrl = undefined;
        } else {
          throw error;
        }
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('lat', location.lat);
      formData.append('long', location.lng);
      formData.append('jenis', attendanceType);
      formData.append('status', type === 'masuk' ? '1' : '0');

      if (attendanceType === 'PDL' && keterangan) {
        formData.append('keterangan', keterangan);
      }

      if (photoDataUrl) {
        // Convert data URL to blob
        const response = await fetch(photoDataUrl);
        const blob = await response.blob();
        formData.append('foto', blob, 'photo.jpg');
      }

      // Submit
      const result = await presensiAPI.submit(formData);

      toast.success(
        `Presensi ${result.aksi} berhasil! ` +
        (result.terlambat ? `(Terlambat ${result.terlambat} menit)` : '')
      );

      // Refresh today status
      await fetchTodayStatus();
    } catch (error: any) {
      const errorCode = error.response?.data?.error;

      if (errorCode === 'lat_long_required') {
        toast.error('Lokasi tidak ditemukan. Coba lagi');
      } else if (errorCode === 'keterangan_required_for_PDL') {
        toast.error('Keterangan harus diisi untuk PDL');
      } else {
        toast.error('Gagal mengirim presensi. Silakan coba lagi');
      }

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [todayStatus, officeLocation, getCurrentLocationHandler, fetchTodayStatus]);

  const value: AppContextType = {
    todayStatus,
    officeLocation,
    currentLocation,
    isLoadingLocation,
    isSubmitting,
    fetchTodayStatus,
    submitAttendance,
    getCurrentLocation: getCurrentLocationHandler,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

**Step 2: Commit**

```bash
git add src/contexts/AppContext.tsx
git commit -m "feat: create AppContext for attendance state management"
```

---

## Phase 4: UI Components for Home Page

### Task 17: Create Common Components

**Files:**
- Create: `src/components/common/StatusBadge.tsx`
- Create: `src/components/common/LocationBadge.tsx`
- Create: `src/components/common/TimeDisplay.tsx`
- Create: `src/components/common/ClockWidget.tsx`

**Step 1: Create StatusBadge component**

Create `src/components/common/StatusBadge.tsx`:

```typescript
import React from 'react';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: 'WFO' | 'WFH' | 'PDL';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    WFO: 'info' as const,
    WFH: 'warning' as const,
    PDL: 'success' as const,
  };

  const labels = {
    WFO: 'WFO',
    WFH: 'WFH',
    PDL: 'PDL',
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};
```

**Step 2: Create LocationBadge component**

Create `src/components/common/LocationBadge.tsx`:

```typescript
import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface LocationBadgeProps {
  location: string;
  distance?: number; // in meters
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({ location, distance }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaMapMarkerAlt className="text-primary-600" />
      <span>{location}</span>
      {distance !== undefined && (
        <span className="text-xs text-gray-500">
          ({Math.round(distance)}m dari kantor)
        </span>
      )}
    </div>
  );
};
```

**Step 3: Create TimeDisplay component**

Create `src/components/common/TimeDisplay.tsx`:

```typescript
import React from 'react';

interface TimeDisplayProps {
  label: string;
  time: string | null;
  highlight?: boolean;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ label, time, highlight = false }) => {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? 'text-primary-600' : 'text-gray-900'}`}>
        {time || '--:--'}
      </p>
    </div>
  );
};
```

**Step 4: Create ClockWidget component**

Create `src/components/common/ClockWidget.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const ClockWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center py-6">
      <div className="text-4xl font-bold text-primary-600">
        {format(currentTime, 'HH:mm:ss')}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {format(currentTime, 'EEEE, dd MMMM yyyy', { locale: id })}
      </div>
    </div>
  );
};
```

**Step 5: Commit**

```bash
git add src/components/common/
git commit -m "feat: create common components (StatusBadge, LocationBadge, TimeDisplay, ClockWidget)"
```

---

### Task 18: Create HomePage

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Step 1: Replace HomePage with full implementation**

Open `src/pages/HomePage.tsx` and replace with:

```typescript
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ClockWidget } from '../components/common/ClockWidget';
import { StatusBadge } from '../components/common/StatusBadge';
import { TimeDisplay } from '../components/common/TimeDisplay';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getGreeting } from '../utils/date';
import { FiCheckCircle, FiLogOut, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { todayStatus, submitAttendance, isSubmitting, fetchTodayStatus } = useApp();
  const [attendanceType, setAttendanceType] = useState<'' | 'WFH' | 'PDL'>('');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  const handleMasuk = async () => {
    if (!todayStatus?.hasCheckedIn) {
      // Show type selector first
      setShowTypeSelector(true);
    }
  };

  const handleKeluar = async () => {
    if (todayStatus?.hasCheckedIn && !todayStatus?.hasCheckedOut) {
      try {
        await submitAttendance('keluar', attendanceType);
      } catch (error) {
        // Error already handled in context
      }
    }
  };

  const confirmAttendanceType = async () => {
    setShowTypeSelector(false);
    try {
      await submitAttendance('masuk', attendanceType);
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Greeting */}
        <div>
          <p className="text-gray-600">{getGreeting()},</p>
          <h2 className="text-xl font-bold text-gray-900">
            {user?.namaPegawai || 'Pegawai'}
          </h2>
          <p className="text-sm text-gray-600">{user?.jabatan}</p>
        </div>

        {/* Clock Widget */}
        <Card>
          <ClockWidget />
        </Card>

        {/* Today's Status */}
        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Status Presensi Hari Ini</h3>

            <div className="grid grid-cols-2 gap-4">
              <TimeDisplay
                label="Masuk"
                time={todayStatus?.checkInTime}
                highlight={todayStatus?.hasCheckedIn}
              />
              <TimeDisplay
                label="Keluar"
                time={todayStatus?.checkOutTime}
                highlight={todayStatus?.hasCheckedOut}
              />
            </div>

            {todayStatus?.hasCheckedIn && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <StatusBadge status={todayStatus.status} />
                </div>

                {todayStatus.isLate && (
                  <div className="flex items-center gap-2 mt-2 text-orange-600">
                    <FiMapPin />
                    <span className="text-sm">
                      Terlambat {todayStatus.lateMinutes} menit
                    </span>
                  </div>
                )}

                {todayStatus.isEarly && (
                  <div className="flex items-center gap-2 mt-2 text-orange-600">
                    <FiLogOut />
                    <span className="text-sm">
                      Pulang awal {todayStatus.earlyMinutes} menit
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Attendance Type Selector */}
        {showTypeSelector && (
          <Card className="border-primary-200 bg-primary-50">
            <h3 className="font-semibold text-gray-900 mb-3">Pilih Jenis Presensi</h3>
            <div className="space-y-2">
              <button
                onClick={() => setAttendanceType('')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  attendanceType === ''
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">WFO - Work From Office</div>
                <div className="text-sm text-gray-600">Masuk ke kantor</div>
              </button>

              <button
                onClick={() => setAttendanceType('WFH')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  attendanceType === 'WFH'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">WFH - Work From Home</div>
                <div className="text-sm text-gray-600">Bekerja dari rumah</div>
              </button>

              <button
                onClick={() => setAttendanceType('PDL')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  attendanceType === 'PDL'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">PDL - Perjalanan Dinas Luar</div>
                <div className="text-sm text-gray-600">Dinas luar kota</div>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={confirmAttendanceType}
                disabled={!attendanceType}
                className="flex-1"
              >
                Lanjutkan
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowTypeSelector(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleMasuk}
            disabled={todayStatus?.hasCheckedIn || isSubmitting}
            className="py-4 text-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <FiCheckCircle />
              <span>Masuk</span>
            </div>
          </Button>

          <Button
            onClick={handleKeluar}
            variant={todayStatus?.hasCheckedIn ? 'primary' : 'secondary'}
            disabled={!todayStatus?.hasCheckedIn || todayStatus?.hasCheckedOut || isSubmitting}
            className="py-4 text-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <FiLogOut />
              <span>Keluar</span>
            </div>
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-2">Petunjuk:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Pastikan GPS aktif sebelum presensi</li>
            <li>• Berada dalam radius kantor untuk WFO</li>
            <li>• Foto akan diambil saat presensi</li>
            <li>• Presensi masuk hanya sekali per hari</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
};
```

**Step 2: Update App.tsx to wrap with AppProvider**

Open `src/App.tsx` and update:

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
```

**Step 3: Test the app**

```bash
npm run dev
```

Expected: Can login, see home page with clock, attendance buttons work

**Step 4: Commit**

```bash
git add src/pages/HomePage.tsx src/App.tsx
git commit -m "feat: implement complete HomePage with attendance submission flow"
```

---

## Phase 5: History and Profile Pages

### Task 19: Create HistoryPage

**Files:**
- Modify: `src/pages/HistoryPage.tsx`

**Step 1: Implement HistoryPage**

Open `src/pages/HistoryPage.tsx` and replace with:

```typescript
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StatusBadge } from '../components/common/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { presensiAPI } from '../services/api/presensi';
import { AttendanceRecord } from '../types/presensi';
import { formatDate, formatTime, parseTime, diffInMinutes } from '../utils/date';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

export const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await presensiAPI.getHistory();
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Riwayat Presensi">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (records.length === 0) {
    return (
      <MainLayout title="Riwayat Presensi">
        <div className="p-4 text-center text-gray-500 py-12">
          <FiCalendar className="mx-auto mb-2 text-4xl" />
          <p>Belum ada riwayat presensi</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Riwayat Presensi">
      <div className="p-4 space-y-3">
        {records.map((record) => (
          <Card key={record.tgl} className="hover:shadow-md transition-shadow">
            <div className="space-y-2">
              {/* Date and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <FiCalendar />
                  <span>{formatDate(record.tgl)}</span>
                </div>
                <StatusBadge status={record.status} />
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <FiClock className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Masuk</p>
                    <p className="text-sm font-medium">
                      {record.masuk ? formatTime(record.masuk) : '--:--'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Keluar</p>
                    <p className="text-sm font-medium">
                      {record.keluar ? formatTime(record.keluar) : '--:--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicators */}
              {(record.is_late || record.is_early || record.keterangan) && (
                <div className="pt-2 border-t">
                  {record.is_late && (
                    <Badge variant="warning" className="mr-2">
                      Terlambat {record.terlambat} menit
                    </Badge>
                  )}
                  {record.is_early && (
                    <Badge variant="warning">
                      Pulang awal {record.pulang_awal} menit
                    </Badge>
                  )}
                  {record.keterangan && (
                    <p className="text-sm text-gray-600 mt-2">
                      Keterangan: {record.keterangan}
                    </p>
                  )}
                </div>
              )}

              {/* Locations */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-xs" />
                  <span>Masuk: {record.lokasi || '-'}</span>
                </div>
                {record.lokasi_keluar && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiMapPin className="text-xs" />
                    <span>Keluar: {record.lokasi_keluar}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary at bottom */}
      <div className="p-4">
        <Card className="bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-2">Ringkasan</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">{records.length}</p>
              <p className="text-xs text-gray-600">Total Hari</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {records.filter(r => r.is_late).length}
              </p>
              <p className="text-xs text-gray-600">Terlambat</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {records.filter(r => r.is_early).length}
              </p>
              <p className="text-xs text-gray-600">Pulang Awal</p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
```

**Step 2: Commit**

```bash
git add src/pages/HistoryPage.tsx
git commit -m "feat: implement HistoryPage with attendance records and summary"
```

---

### Task 20: Create ProfilePage

**Files:**
- Modify: `src/pages/ProfilePage.tsx`

**Step 1: Implement ProfilePage**

Open `src/pages/ProfilePage.tsx` and replace with:

```typescript
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiIdCard, FiMapPin, FiLogOut, FiSmartphone } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, deviceId, platform, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      await logout();
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Hapus cache data? Ini akan menghapus data tersimpan secara lokal.')) {
      try {
        localStorage.clear();
        toast.success('Cache berhasil dihapus');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error('Gagal menghapus cache');
      }
    }
  };

  return (
    <MainLayout title="Profil">
      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.namaPegawai || 'Pegawai'}
              </h2>
              <p className="text-sm text-gray-600">{user?.jabatan}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <InfoRow
              icon={<FiIdCard />}
              label="NIP"
              value={user?.nipBaru || '-'}
            />
            <InfoRow
              icon={<FiIdCard />}
              label="ID Elektronik"
              value={user?.idelektronik ? user.idelektronik.toString() : '-'}
            />
            <InfoRow
              icon={<FiMapPin />}
              label="SKPD"
              value={user?.skpd || user?.opd || '-'}
            />
            <InfoRow
              icon={<FiIdCard />}
              label="Shift"
              value={`Shift ${user?.shift || '-'}`}
            />
          </div>
        </Card>

        {/* Device Info Card */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Informasi Perangkat</h3>
          <div className="space-y-2">
            <InfoRow
              icon={<FiSmartphone />}
              label="Device ID"
              value={deviceId}
            />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Platform</span>
              <Badge variant="info">{platform.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Versi Aplikasi</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClearCache}
          >
            Hapus Cache
          </Button>

          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
          >
            <div className="flex items-center justify-center gap-2">
              <FiLogOut />
              <span>Logout</span>
            </div>
          </Button>
        </div>

        {/* Version Info */}
        <p className="text-center text-xs text-gray-500 pt-4">
          Prescap v1.0.0
        </p>
      </div>
    </MainLayout>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="text-primary-600 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add src/pages/ProfilePage.tsx
git commit -m "feat: implement ProfilePage with user info and logout"
```

---

## Phase 6: Capacitor Integration (Android)

### Task 21: Install Capacitor

**Files:**
- Create: `capacitor.config.ts`

**Step 1: Install Capacitor dependencies**

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/geolocation @capacitor/camera
npm install @capacitor/device @capacitor/preferences
npm install @capacitor/local-notifications
```

Expected: All Capacitor packages installed

**Step 2: Initialize Capacitor**

```bash
npx cap init "Prescap" "com.prescap.app" --web-dir=dist
```

Expected: Creates `capacitor.config.ts`

**Step 3: Create capacitor config**

Create `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prescap.app',
  appName: 'Prescap',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      signingType: 'apksigner',
    },
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#2563eb',
      sound: 'beep.wav',
    },
  },
};

export default config;
```

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml capacitor.config.ts
git commit -m "feat: install and configure Capacitor for Android"
```

---

### Task 22: Add Android Platform and Build

**Files:**
- Create: `android/` (directory created by Capacitor)

**Step 1: Build the web app**

```bash
npm run build
```

Expected: `dist/` directory created with built app

**Step 2: Add Android platform**

```bash
npx cap add android
```

Expected: `android/` directory created

**Step 3: Sync web assets to Android**

```bash
npx cap sync android
```

Expected: Web assets copied to Android project

**Step 4: Open in Android Studio (optional, for building APK)**

```bash
npx cap open android
```

This will open Android Studio where you can build the APK.

Or build directly from command line:

```bash
cd android && ./gradlew assembleDebug
```

Expected: APK created at `android/app/build/outputs/apk/debug/app-debug.apk`

**Step 5: Commit android project**

```bash
git add android/
git commit -m "feat: add Android platform and initial build configuration"
```

---

## Phase 7: Polish and Finalize

### Task 23: Add App Icons and Splash Screen

**Files:**
- Create: `public/icons/icon-72x72.png` through `public/icons/icon-512x512.png`
- Create: `public/splash.png`

**Step 1: Generate app icons**

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Or use ImageMagick:

```bash
# Convert a source icon to multiple sizes
# Assuming you have a source icon at public/icon-source.png (1024x1024)
convert public/icon-source.png -resize 72x72 public/icons/icon-72x72.png
convert public/icon-source.png -resize 96x96 public/icons/icon-96x96.png
convert public/icon-source.png -resize 128x128 public/icons/icon-128x128.png
convert public/icon-source.png -resize 144x144 public/icons/icon-144x144.png
convert public/icon-source.png -resize 152x152 public/icons/icon-152x152.png
convert public/icon-source.png -resize 192x192 public/icons/icon-192x192.png
convert public/icon-source.png -resize 384x384 public/icons/icon-384x384.png
convert public/icon-source.png -resize 512x512 public/icons/icon-512x512.png
```

**Step 2: Create splash screen**

Splash screen should be at least 2732x2732 pixels, with the logo centered in the middle.

**Step 3: Sync icons to Capacitor Android**

```bash
npm run build
npx cap sync android
```

**Step 4: Commit**

```bash
git add public/icons/ public/splash.png
git commit -m "feat: add app icons and splash screen"
```

---

### Task 24: Remove Development Code for Production

**Files:**
- Modify: `src/pages/LoginPage.tsx`
- Modify: `src/config/development.ts`

**Step 1: Update LoginPage to remove dev mode UI**

In `src/pages/LoginPage.tsx`, remove or conditionally render the dev mode box:

```typescript
// Remove this block or wrap in {isDev && process.env.NODE_ENV === 'development' && ...}
{isDev && (
  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    ...
  </div>
)}
```

**Step 2: Update .env.production**

```bash
# Remove dev credentials from production
VITE_API_URL=https://api.prescap.com
VITE_DEBUG=false
# Remove VITE_DEVICE_ID and VITE_VALID_NIP
```

**Step 3: Commit**

```bash
git add src/pages/LoginPage.tsx .env.production
git commit -m "chore: remove development mode UI for production"
```

---

### Task 25: Final Testing and Build

**Files:**
- Test all features
- Build production web app
- Build Android APK

**Step 1: Test web app**

```bash
npm run build
npm run preview
```

Test all flows:
- [ ] Login with valid credentials
- [ ] Check-in with geolocation and camera
- [ ] Check-out
- [ ] View history
- [ ] View profile
- [ ] Logout

**Step 2: Build Android APK**

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

**Step 3: Test Android APK**

Install APK on Android device/emulator and test all features.

**Step 4: Test iOS PWA**

Deploy to web server with HTTPS and test "Add to Home Screen" on iPhone.

**Step 5: Create production commit**

```bash
git add .
git commit -m "chore: prepare for production release"
```

---

## Summary

This implementation plan covers:

✅ **Phase 1:** Project foundation - dependencies, Tailwind, PWA config, project structure
✅ **Phase 2:** Authentication system - storage, API, context, login page
✅ **Phase 3:** Core pages - router, layout, platform adapters
✅ **Phase 4:** Home page - attendance submission with geolocation and camera
✅ **Phase 5:** History and Profile pages
✅ **Phase 6:** Capacitor integration for Android APK
✅ **Phase 7:** Polish - icons, splash screen, production build

**Total Tasks:** 25
**Estimated Time:** 3-4 weeks
**Dependencies:** All specified in tasks

---

## Next Steps

Choose execution approach:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
