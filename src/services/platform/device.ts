import { secureStorage } from '../storage/storage';
import { DEV_CONFIG } from '../../config/development';

const DEVICE_ID_STORAGE_KEY = 'device_id';

// Capacitor types (optional, only available when packages are installed)
// @ts-ignore - Capacitor is optional
let Capacitor: any = null;
// @ts-ignore - Device is optional
let Device: any = null;

// Dynamic import wrapper (will be null on web-only)
try {
  // @ts-ignore
  if (typeof require !== 'undefined') {
    // @ts-ignore
    const coreModule = require('@capacitor/core');
    if (coreModule && coreModule.Capacitor) {
      Capacitor = coreModule.Capacitor;
    }
    // @ts-ignore
    const deviceModule = require('@capacitor/device');
    if (deviceModule && deviceModule.Device) {
      Device = deviceModule.Device;
    }
  }
} catch (e) {
  // Capacitor not installed, running in web-only mode
}

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

  if (Capacitor && Capacitor.isNativePlatform() && Device) {
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
  if (!Capacitor || !Capacitor.isNativePlatform()) {
    return 'web';
  }

  const platform = await Capacitor.getPlatform();
  if (platform === 'android') return 'android';
  if (platform === 'ios') return 'ios';
  return 'web';
}