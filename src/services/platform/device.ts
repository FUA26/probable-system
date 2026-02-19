import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { secureStorage } from '../storage/storage';

const DEVICE_ID_STORAGE_KEY = 'device_id';

/**
 * Generate or retrieve device ID
 */
export async function getDeviceId(): Promise<string> {
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
    // Generates a UUID-like string for web
    try {
      const info = await Device.getId();
      deviceId = info.identifier;
    } catch (e) {
      // Fallback for web if Device plugin fails or not supported (though it should work on web too)
      deviceId = crypto.randomUUID();
    }
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