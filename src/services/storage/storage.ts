// Capacitor types (optional, only available when packages are installed)
// @ts-ignore - Capacitor is optional
let Capacitor: any = null;
// @ts-ignore - Preferences is optional
let Preferences: any = null;

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
    const prefsModule = require('@capacitor/preferences');
    if (prefsModule && prefsModule.Preferences) {
      Preferences = prefsModule.Preferences;
    }
  }
} catch (e) {
  // Capacitor not installed, running in web-only mode
}

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Capacitor && Capacitor.isNativePlatform() && Preferences) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Capacitor && Capacitor.isNativePlatform() && Preferences) {
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Capacitor && Capacitor.isNativePlatform() && Preferences) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  },

  async clear(): Promise<void> {
    if (Capacitor && Capacitor.isNativePlatform() && Preferences) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  },
};