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