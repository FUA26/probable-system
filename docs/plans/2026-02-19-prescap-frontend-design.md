# Prescap Frontend Design Document

**Project:** Presensi Pegawai Mobile App (Prescap)
**Date:** 2026-02-19
**Status:** Design Approved
**Author:** AI Assistant + User Collaboration

---

## Executive Summary

Prescap is a mobile-first attendance/absensi web application for employee check-in/check-out with geolocation tracking, camera capture, and shift management. The app will be deployed as:
- **Android APK** via Capacitor (native experience)
- **iOS Web App** via PWA "Add to Home Screen" (no Apple Developer account needed)
- **Single codebase** serving all platforms

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Component Structure](#component-structure)
4. [Data Flow & State Management](#data-flow--state-management)
5. [Platform Adapter Pattern](#platform-adapter-pattern)
6. [Error Handling Strategy](#error-handling-strategy)
7. [Testing Strategy](#testing-strategy)
8. [Development Configuration](#development-configuration)
9. [Security Considerations](#security-considerations)
10. [Deployment Strategy](#deployment-strategy)
11. [Project Structure](#project-structure)
12. [Implementation Phases](#implementation-phases)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Login   │  │   Home   │  │ History  │  │ Profile│  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│       ↓              ↓              ↓             ↓       │
├─────────────────────────────────────────────────────────┤
│                   Navigation & Routing                  │
│              React Router v6 + Bottom Nav                │
├─────────────────────────────────────────────────────────┤
│                     State Management                     │
│              Context API (Auth + App State)              │
├─────────────────────────────────────────────────────────┤
│                   Service Layer (Abstraction)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ API Service │  │ Storage Svc │  │ Platform Adapter│ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                   Platform Layer (Conditional)           │
│         PWA (Browser APIs)     Capacitor (Native)       │
├─────────────────────────────────────────────────────────┤
│                      Backend API                         │
│           http://localhost:4000/api/v1/*                 │
└─────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Platform Adapter Pattern:** Services detect platform and use appropriate APIs
2. **Context API:** Simple, lightweight state management (no Redux needed)
3. **React Router:** Client-side routing with protected routes
4. **Token-based Auth:** JWT stored securely, auto-refresh on expiry
5. **No Offline Queuing:** App requires internet connection, fails gracefully if offline

---

## Technology Stack

### Frontend Core
- **React:** v19.2.0 with TypeScript
- **Build Tool:** Vite v7.3.1
- **Language:** TypeScript ~5.9.3

### Styling
- **CSS Framework:** Tailwind CSS v3
- **Icons:** React Icons (Lucide or Heroicons)

### Routing & Navigation
- **Router:** React Router v6
- **Navigation:** Bottom tab bar (mobile pattern)

### PWA (iOS)
- **Plugin:** vite-plugin-pwa (Workbox)
- **Manifest:** Web App Manifest for "Add to Home Screen"

### Mobile (Android - Capacitor)
- **Core:** @capacitor/core v6
- **Platform:** @capacitor/android
- **Plugins:**
  - @capacitor/geolocation
  - @capacitor/camera
  - @capacitor/device
  - @capacitor/preferences
  - @capacitor/local-notifications

### HTTP & State
- **HTTP Client:** Axios with interceptors
- **State Management:** React Context API
- **Forms:** React Hook Form

### Utilities
- **Date:** date-fns
- **Notifications:** react-hot-toast

---

## Component Structure

### Screen Hierarchy

```
App
├── AuthProvider (Context)
├── Router
│   ├── Public Routes
│   │   └── LoginPage
│   └── Protected Routes
│       ├── MainLayout (with Bottom Navigation)
│       │   ├── HomePage
│       │   │   ├── AttendanceCard
│       │   │   ├── ClockWidget
│       │   │   ├── LocationBadge
│       │   │   └── ActionButtons (Masuk/Keluar)
│       │   ├── HistoryPage
│       │   │   ├── MonthSelector
│       │   │   └── AttendanceList
│       │   │       └── AttendanceCard
│       │   ├── LeavePage (future)
│       │   └── ProfilePage
│       │       └── ProfileCard
```

### Page Components Overview

#### 1. LoginPage
**Purpose:** User authentication with NIP and device ID

**Features:**
- Auto-generate device ID on first visit
- Store device ID in localStorage
- Validate NIP format (18 digits)
- Show loading state during login
- Redirect to home on success
- **Dev mode:** Pre-fill with test credentials

**Components:**
- LoginForm
- NIPInput (with validation)
- DeviceIdDisplay (auto-generated)
- SubmitButton
- ErrorMessage

#### 2. HomePage
**Purpose:** Main attendance check-in/check-out interface

**Features:**
- Real-time clock updates (every second)
- Geolocation auto-fetch on button press
- Camera capture before attendance submit
- Show "terlambat" warning if late
- Disable "Masuk" if already checked in
- Disable "Keluar" if already checked out
- Display current shift info

**Components:**
- Header (Greeting, Date, ProfilePicture)
- ClockWidget (RealtimeClock, ShiftCountdown)
- AttendanceStatusCard (StatusBadge, TimeIn/Out, LocationBadge)
- ActionButtons (MasukButton, CameraCapture, KeluarButton)
- ShiftInfo (TodayShift, NextShift)

#### 3. HistoryPage
**Purpose:** Display attendance history (last 30 days)

**Features:**
- Load last 30 days from API
- Pull-to-refresh
- Month navigation
- Show status icons (on time, late, early)
- Empty state if no data

**Components:**
- Header (Title + Filter)
- MonthSelector (prev/next)
- StatsSummary (TotalPresent, TotalLate, TotalEarly)
- AttendanceList → AttendanceCard (repeated)

#### 4. ProfilePage
**Purpose:** Display user profile and settings

**Features:**
- Display user info from `/api/v1/auth/me`
- Show current shift assignment
- Logout with confirmation dialog
- Clear cached data option
- Show device info (ID, platform)

**Components:**
- ProfileCard (Avatar, EmployeeName, NIP, Position, Agency, ShiftInfo)
- DeviceInfo (DeviceId, AppVersion)
- ActionButtons (LogoutButton, ClearCacheButton)

### Reusable UI Components

```typescript
components/
├── ui/
│   ├── Button (primary, secondary, danger)
│   ├── Input (with error, label)
│   ├── Card
│   ├── Badge
│   ├── Modal
│   ├── LoadingSpinner
│   └── Toast (notifications)
├── layout/
│   ├── BottomNav
│   ├── Header
│   └── Container
└── common/
    ├── LocationBadge
    ├── StatusBadge
    └── TimeDisplay
```

---

## Data Flow & State Management

### Global Contexts

```
┌─────────────────────────────────────────────────────────┐
│                    Global Contexts                       │
│  ┌──────────────────┐      ┌──────────────────┐         │
│  │   AuthContext    │      │   AppContext     │         │
│  │  - token         │      │  - user          │         │
│  │  - isAuthenticated│      │  - shift         │         │
│  │  - deviceInfo    │      │  - location      │         │
│  │  - login/logout  │      │  - todayStatus   │         │
│  └──────────────────┘      └──────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

### AuthContext State

```typescript
interface AuthState {
  // State
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  deviceInfo: {
    deviceId: string;
    platform: 'web' | 'android' | 'ios';
  };
  user: UserProfile | null;

  // Actions
  login: (nip: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
```

**Data Flow:**
1. App starts → check localStorage for token
2. If token exists → validate with `/api/v1/auth/check`
3. If valid → fetch profile with `/api/v1/auth/me`
4. Store in context → redirect to home
5. If invalid → redirect to login

### AppContext State

```typescript
interface AppState {
  // Attendance State
  todayStatus: {
    hasCheckedIn: boolean;
    hasCheckedOut: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: 'WFO' | 'WFH' | 'PDL';
  };

  // Location State
  currentLocation: {
    lat: string;
    lng: string;
    accuracy: number;
  } | null;

  // Shift Info
  shift: {
    id_shift: number;
    today: ShiftSchedule;
    detail: ShiftSchedule[];
  } | null;

  // Actions
  fetchTodayStatus: () => Promise<void>;
  submitAttendance: (type: 'masuk' | 'keluar', data: AttendanceData) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  refreshShift: () => Promise<void>;
}
```

**Data Flow for Attendance Submission:**
```
User clicks "Masuk"
  ↓
AppContext.getCurrentLocation()
  ↓
Platform Adapter (Geolocation API or Capacitor)
  ↓
Show camera capture (optional)
  ↓
User confirms photo
  ↓
API Service.submitAttendance({
  lat, lng, status: "1", jenis, foto
})
  ↓
Show loading state
  ↓
Update todayStatus in context
  ↓
Show success toast
  ↓
Redirect to home
```

### Data Persistence Strategy

| Key | Type | Duration | Purpose |
|-----|------|----------|---------|
| `auth_token` | string | 12 hours | JWT authentication |
| `device_id` | string | forever | Device binding |
| `user_profile` | JSON | 12 hours | User info cache |
| `last_checkin` | JSON | 24 hours | Today's status cache |
| `shift_data` | JSON | 12 hours | Shift schedule cache |

---

## Platform Adapter Pattern

The app uses platform adapters to provide seamless experience across web and native (Capacitor) environments.

### Geolocation Adapter

```typescript
// services/platform/geolocation.ts
export const getLocation = async () => {
  const isCapacitor = Capacitor.isNativePlatform();

  if (isCapacitor) {
    // Use Capacitor Geolocation plugin
    const result = await CapacitorGeolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    return {
      lat: result.coords.latitude.toString(),
      lng: result.coords.longitude.toString(),
      accuracy: result.coords.accuracy,
    };
  } else {
    // Use Browser Geolocation API
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
          accuracy: position.coords.accuracy,
        }),
        reject,
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }
};
```

### Camera Adapter

```typescript
// services/platform/camera.ts
export const capturePhoto = async () => {
  const isCapacitor = Capacitor.isNativePlatform();

  if (isCapacitor) {
    // Use Capacitor Camera plugin
    const result = await CapacitorCamera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    return result.dataUrl; // base64 string
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
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }
      };

      input.oncancel = () => reject(new Error('Camera cancelled'));
      input.click();
    });
  }
};
```

### Storage Adapter

```typescript
// services/storage/storage.ts
export const secureStorage = {
  async setItem(key: string, value: string) {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  },

  async getItem(key: string) {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  },

  async removeItem(key: string) {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  },
};
```

---

## Error Handling Strategy

### Error Categories

1. **Network Errors** - No internet connection
2. **Authentication Errors** - Token expired/invalid (401)
3. **Location Errors** - Permission denied, timeout, unavailable
4. **Camera Errors** - Permission denied, cancelled
5. **Validation Errors** - Invalid inputs, missing fields
6. **Server Errors** - Backend issues (500)

### Error Response Strategy

**No Offline Queuing:** If the app is offline, operations simply fail with clear error messages. No background queuing or sync.

#### Network Errors

```typescript
if (!navigator.onLine) {
  toast.error('Tidak ada koneksi internet. Mohon cek koneksi Anda dan coba lagi.');
  return;
}
toast.error('Gagal terhubung ke server. Silakan coba lagi.');
```

**UI Response:**
- Show toast notification
- Disable action buttons
- Show retry button

#### Authentication Errors

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearAuthData();
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**UI Response:**
- Auto-logout
- Clear context
- Show notification
- Redirect to login

#### Location Errors

```typescript
switch (error.code) {
  case error.PERMISSION_DENIED:
    toast.error('Izin lokasi dibutuhkan untuk presensi. Silakan aktifkan di pengaturan.');
    break;
  case error.POSITION_UNAVAILABLE:
    toast.error('Lokasi tidak dapat ditemukan. Pastikan GPS aktif.');
    break;
  case error.TIMEOUT:
    toast.error('Waktu habis mendeteksi lokasi. Silakan coba lagi.');
    break;
}
```

#### Camera Errors

```typescript
if (error.message === 'Permission denied') {
  toast.error('Izin kamera dibutuhkan. Aktifkan di pengaturan.');
} else if (error.message === 'Camera cancelled') {
  // User cancelled, no error shown
  return;
} else {
  toast.error('Gagal membuka kamera. Silakan coba lagi.');
}
```

#### Validation Errors

```typescript
const errorCode = error.response?.data?.error;

switch (errorCode) {
  case 'nip_and_device_id_are_required':
    toast.error('NIP dan Device ID harus diisi.');
    break;
  case 'invalid_credentials':
    toast.error('NIP tidak ditemukan. Periksa kembali NIP Anda.');
    break;
  case 'invalid_device':
    toast.error('Perangkat tidak terdaftar. Hubungi admin.');
    break;
  case 'lat_long_required':
    toast.error('Lokasi tidak ditemukan. Coba lagi.');
    break;
  case 'keterangan_required_for_PDL':
    toast.error('Keterangan harus diisi untuk PDL.');
    break;
}
```

### Edge Cases

#### Device ID Mismatch
Show confirmation dialog for device reset (if backend allows)

#### Already Checked In/Out
Disable appropriate buttons, show warning toast

#### Outside Office Radius
Show warning with distance, allow user to decide

#### Late Check-in
Show warning toast with late minutes, still allow submission

#### Token Expiry
Silent refresh before expiry, logout if refresh fails

---

## Testing Strategy

### Testing Tools

- **Unit Tests:** Vitest (built-in with Vite)
- **Component Tests:** React Testing Library
- **E2E Tests:** Manual testing for Phase 1

### Critical Test Scenarios

#### Authentication Flow
- Login successfully with valid credentials
- Show error with invalid NIP
- Token expiry handling
- Logout clears all data

#### Geolocation
- Get current location successfully
- Handle permission denied
- Handle timeout
- Handle unavailable location

#### Camera
- Capture photo from camera
- Handle permission denied
- Handle camera cancelled

#### API Integration
- Submit attendance successfully
- Handle network error
- Handle server error

### Manual Testing Checklist

#### Login Page
- [ ] Auto-generate device ID on first visit
- [ ] Device ID persists across refreshes
- [ ] Show error with invalid NIP
- [ ] Redirect to home after successful login
- [ ] Token stored correctly
- [ ] Show loading state

#### Home Page
- [ ] Display current user name correctly
- [ ] Real-time clock updates
- [ ] Geolocation works on button click
- [ ] Show error if location permission denied
- [ ] Camera opens and captures photo
- [ ] Masuk button disabled after check-in
- [ ] Keluar button disabled after check-out
- [ ] Show "terlambat" warning if late

#### History Page
- [ ] Load last 30 days of history
- [ ] Show empty state if no data
- [ ] Display status badges correctly
- [ ] Show late indicators

#### Profile Page
- [ ] Display user info correctly
- [ ] Show shift information
- [ ] Logout clears all data
- [ ] Redirect to login after logout

### Platform-Specific Testing

#### Web Browser
- Test in: Chrome, Firefox, Safari
- Test responsive design (mobile, tablet, desktop)
- Test geolocation permission flow
- Test camera capture

#### Android (Capacitor)
- Test on real Android device or emulator
- Test native camera plugin
- Test native geolocation plugin
- Test app icon and splash screen
- Test back button behavior

#### iOS (PWA)
- Test on real iPhone
- Test "Add to Home Screen" flow
- Test standalone mode (no browser UI)
- Test camera via file input
- Test geolocation via Safari
- Test app icon display

---

## Development Configuration

### Development Credentials

**⚠️ IMPORTANT: FOR DEVELOPMENT ONLY**

```typescript
// config/development.ts
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

### Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:4000
VITE_DEVICE_ID=12345
VITE_VALID_NIP=199506262024211024
VITE_DEBUG=true

# .env.production
VITE_API_URL=https://api.prescap.com
VITE_DEBUG=false
```

### Production Deployment Checklist

Before deploying to production:
- [ ] Remove or disable `DEV_CONFIG` export
- [ ] Remove development helper UI
- [ ] Remove hardcoded NIP pre-fill
- [ ] Change device ID to auto-generated (not hardcoded)
- [ ] Update API URL to production endpoint
- [ ] Disable debug mode
- [ ] Remove all console.log statements

---

## Security Considerations

### Token Storage

- **Android:** Encrypted with Capacitor Preferences
- **Web:** localStorage (not encrypted, but acceptable for PWA)
- **Token expiry:** 12 hours (JWT)

### Device ID Generation

Generate unique ID on first visit using:
```typescript
const deviceId = Date.now().toString(36) + Math.random().toString(36).substring(2);
```

### HTTPS Enforcement

Redirect to HTTPS in production (except localhost)

### Input Validation

- Validate NIP format (18 digits)
- Sanitize user inputs
- Remove HTML tags

### API Key Protection

- Never include API keys in frontend code
- Use environment variables
- Never expose admin keys to client

### Sensitive Data Handling

- Clear sensitive data on logout
- Remove token from memory
- Clear axios interceptors

### Known Limitations

⚠️ **Web/PWA Security Limitations:**
- localStorage is accessible via browser DevTools
- No true secure storage on web
- User can inspect network requests
- Code is visible in browser

**Mitigation:**
- Token expires after 12 hours
- Backend validates every request
- Device binding prevents unauthorized access
- Use HTTPS in production

---

## Deployment Strategy

### Phase 1: Web Deployment (Development)

```bash
npm run build
npm run preview
```

### Phase 2A: Android APK (Capacitor)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize
npx cap init "Prescap" "com.prescap.app" --web-dir=dist

# Add Android
npx cap add android

# Build
npm run build
npx cap sync android

# Open in Android Studio or build APK
npx cap open android
# or
cd android && ./gradlew assembleDebug
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

**Distribution:**
- Share APK file directly
- Or upload to Google Play (requires developer account)

### Phase 2B: iOS PWA (Add to Home Screen)

```bash
npm run build
# Deploy to web server with HTTPS
```

**iOS Installation:**
1. Open Safari on iPhone
2. Navigate to app URL
3. Tap Share → "Add to Home Screen"
4. Tap "Add"

### Build Commands

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "cap:sync": "npm run build && npx cap sync",
  "cap:android": "npm run build && npx cap sync android && npx cap open android",
  "cap:build": "npm run build && npx cap sync android && cd android && ./gradlew assembleDebug"
}
```

---

## Project Structure

```
prescap/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # App icons (multiple sizes)
│   ├── splash.png             # Splash screen
│   └── index.html             # With iOS meta tags
│
├── src/
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Root component
│   ├── index.css              # Global styles + Tailwind
│   │
│   ├── config/
│   │   ├── env.ts             # Environment variables
│   │   └── development.ts     # Dev credentials
│   │
│   ├── types/
│   │   ├── api.ts             # API response types
│   │   ├── auth.ts            # Auth types
│   │   └── presensi.ts        # Attendance types
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── LeavePage.tsx      # Placeholder for future
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   └── common/            # Shared components
│   │
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   │
│   ├── services/              # Business logic
│   │   ├── api/               # API services
│   │   ├── storage/           # Storage abstraction
│   │   └── platform/          # Platform adapters
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useLocation.ts
│   │   ├── useCamera.ts
│   │   └── useToast.ts
│   │
│   └── utils/                 # Helper functions
│       ├── date.ts            # Date formatting
│       ├── validation.ts      # Input validation
│       └── constants.ts       # App constants
│
├── capacitor.config.ts        # Capacitor configuration
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript config
├── package.json
├── .env.development
├── .env.production
└── README.md
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Set up project infrastructure

**Tasks:**
- [ ] Install all dependencies (React, Tailwind, React Router, etc.)
- [ ] Configure Tailwind CSS
- [ ] Set up project structure
- [ ] Configure Vite with PWA plugin
- [ ] Create base UI components (Button, Input, Card, Badge, etc.)
- [ ] Set up React Router
- [ ] Create layout components (BottomNav, Header)
- [ ] Set up TypeScript types

### Phase 2: Authentication (Week 1)

**Tasks:**
- [ ] Implement AuthContext
- [ ] Create API service with Axios
- [ ] Implement login page
- [ ] Add device ID generation
- [ ] Add token storage
- [ ] Implement protected routes
- [ ] Add logout functionality
- [ ] Test login flow with dev credentials

### Phase 3: Core Pages (Week 2)

**Tasks:**
- [ ] Implement AppContext
- [ ] Create HomePage with clock widget
- [ ] Implement geolocation platform adapter
- [ ] Add camera capture platform adapter
- [ ] Create attendance submission flow
- [ ] Implement HistoryPage
- [ ] Implement ProfilePage
- [ ] Add toast notifications
- [ ] Test all user flows

### Phase 4: Styling & Polish (Week 2)

**Tasks:**
- [ ] Match design from screenshots
- [ ] Add loading states
- [ ] Add error states
- [ ] Responsive design testing
- [ ] Add animations/transitions
- [ ] PWA manifest configuration
- [ ] App icons and splash screen
- [ ] Test on multiple devices

### Phase 5: Capacitor Integration (Week 3)

**Tasks:**
- [ ] Install and configure Capacitor
- [ ] Add Android platform
- [ ] Replace browser APIs with Capacitor plugins
- [ ] Test on Android device/emulator
- [ ] Build debug APK
- [ ] Test all features on Android
- [ ] Polish Android-specific features

### Phase 6: iOS PWA & Final Testing (Week 3-4)

**Tasks:**
- [ ] Test "Add to Home Screen" on iOS
- [ ] Ensure PWA manifest is correct
- [ ] Test on iPhone
- [ ] Fix platform-specific issues
- [ ] Final bug fixes
- [ ] Performance optimization
- [ ] Documentation

### Phase 7: Deployment (Week 4)

**Tasks:**
- [ ] Build production APK
- [ ] Deploy web app to server
- [ ] Test production build
- [ ] Create user documentation
- [ ] Prepare distribution

---

## Dependencies Installation

```bash
# Core
npm install react react-dom

# Routing
npm install react-router-dom

# Styling
npm install -D tailwindcss postcss autoprefixer

# PWA
npm install -D vite-plugin-pwa

# Capacitor (Android only)
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/geolocation @capacitor/camera
npm install @capacitor/device @capacitor/preferences
npm install @capacitor/local-notifications

# HTTP Client
npm install axios

# Forms
npm install react-hook-form

# Icons
npm install react-icons

# Toast Notifications
npm install react-hot-toast

# Date Utilities
npm install date-fns
```

---

## API Integration

### Base Configuration

```typescript
// api/base.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 10000,
});

// Request interceptor - add token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Endpoints

**Auth:**
- POST `/api/v1/auth/login` - Login with NIP
- GET `/api/v1/auth/me` - Get user profile
- GET `/api/v1/auth/check` - Check token validity
- POST `/api/v1/auth/logout` - Logout

**Presensi:**
- POST `/api/v1/presensi/submit` - Submit attendance
- GET `/api/v1/presensi/history` - Get attendance history

---

## Design Principles

1. **Mobile-First:** Designed primarily for mobile devices
2. **Platform Agnostic:** Single codebase for web, Android, iOS
3. **Progressive Enhancement:** Works on web, enhanced on native
4. **Fail Gracefully:** Clear error messages, no silent failures
5. **Simple State Management:** Context API, no Redux overhead
6. **Type Safety:** TypeScript throughout
7. **Performance:** Fast load times, minimal bundle size

---

## Success Criteria

### Phase 1 (Web)
- [ ] All pages rendered correctly
- [ ] Login flow working with dev credentials
- [ ] Attendance submission working (geolocation + camera)
- [ ] History page displaying data
- [ ] Responsive design on mobile browsers

### Phase 2A (Android APK)
- [ ] APK builds successfully
- [ ] App installs on Android device
- [ ] All features working as native app
- [ ] Camera and geolocation using native plugins

### Phase 2B (iOS PWA)
- [ ] "Add to Home Screen" works on Safari
- [ ] App opens in standalone mode
- [ ] All features working
- [ ] App icon displayed correctly

---

## Conclusion

This design provides a comprehensive roadmap for building the Prescap attendance application. The hybrid approach of PWA + Capacitor allows us to:
- Deploy to Android as native APK
- Deploy to iOS without Apple Developer account
- Maintain a single codebase
- Provide native-like experience on all platforms

The architecture is simple, maintainable, and scalable for future enhancements.

---

**Document Version:** 1.0
**Last Updated:** 2026-02-19
**Status:** Ready for Implementation
