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
