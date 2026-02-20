import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { secureStorage } from '../services/storage/storage';
import { presensiAPI } from '../services/api/presensi';
import { getCurrentLocation, calculateDistance } from '../services/platform/geolocation';
import { capturePhoto } from '../services/platform/camera';
import type { TodayStatus, OfficeLocation } from '../types/presensi';
import { toast } from 'react-hot-toast';

interface AppContextType {
  todayStatus: TodayStatus | null;
  officeLocation: OfficeLocation | null;
  currentLocation: { lat: string; lng: string } | null;
  isLoadingLocation: boolean;
  isSubmitting: boolean;
  fetchTodayStatus: () => Promise<void>;
  submitAttendance: (type: 'masuk' | 'keluar', attendanceType: '' | 'WFH' | 'PDL', keterangan?: string) => Promise<void>;
  getCurrentLocation: () => Promise<{ lat: string; lng: string }>;
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
    const loadOfficeLocation = async () => {
      const storedLocation = await secureStorage.getItem('office_location');
      if (storedLocation) {
        try {
          const locationData = JSON.parse(storedLocation);
          // Ensure lat/lng are numbers
          setOfficeLocation({
            lat: Number(locationData.lat),
            lng: Number(locationData.lng),
            radius: Number(locationData.radius),
            name: locationData.nama_lokasi || 'Kantor',
          });
          console.log('[AppContext] Office location loaded:', locationData);
        } catch (e) {
          console.error('Failed to parse office location', e);
        }
      }
    };
    
    if (user) {
      loadOfficeLocation();
    }
  }, [user]);

  const fetchTodayStatus = useCallback(async () => {
    try {
      const response = await presensiAPI.getHistory();
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      console.log('[fetchTodayStatus] today (ISO):', today);
      console.log('[fetchTodayStatus] total records:', response.data.length);
      console.log('[fetchTodayStatus] all record.tgl:', response.data.map((r) => r.tgl));

      const todayRecord = response.data.find((record) => {
        console.log(`[fetchTodayStatus] comparing record.tgl="${record.tgl}" === today="${today}" =>`, record.tgl === today);
        return record.tgl === today;
      });

      console.log('[fetchTodayStatus] todayRecord:', todayRecord ?? 'NOT FOUND');

      if (todayRecord) {
        setTodayStatus({
          hasCheckedIn: !!todayRecord.masuk,
          hasCheckedOut: !!todayRecord.keluar,
          checkInTime: todayRecord.masuk || null,
          checkOutTime: todayRecord.keluar || null,
          status: todayRecord.status,
          isLate: !!todayRecord.is_late,
          lateMinutes: todayRecord.terlambat || 0,
          isEarly: !!todayRecord.is_early,
          earlyMinutes: todayRecord.pulang_awal || 0,
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
      toast('Anda sudah melakukan presensi masuk hari ini', { icon: '⚠️' });
      return;
    }

    if (type === 'keluar' && !todayStatus?.hasCheckedIn) {
      toast.error('Anda belum melakukan presensi masuk');
      return;
    }

    if (type === 'keluar' && todayStatus?.hasCheckedOut) {
      toast('Anda sudah melakukan presensi keluar', { icon: '⚠️' });
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
          String(officeLocation.lat),
          String(officeLocation.lng)
        );

        if (distance > officeLocation.radius) {
          toast(
            `Anda berada di luar radius kantor (${Math.round(distance)}m). ` +
            `Radius yang diizinkan: ${officeLocation.radius}m`,
            { icon: '⚠️' }
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
      
      // DEBUG: Force use office location if available as requested by user
      if (officeLocation) {
        console.log('[submitAttendance] Force using Office Location:', officeLocation);
        formData.append('lat', String(officeLocation.lat));
        formData.append('long', String(officeLocation.lng));
        toast('Info: Menggunakan Lokasi Kantor (Hardcoded)', { icon: '🔧' });
      } else {
        formData.append('lat', location.lat);
        formData.append('long', location.lng);
      }
      
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
