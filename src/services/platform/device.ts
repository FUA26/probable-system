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