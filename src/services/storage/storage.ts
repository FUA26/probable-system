// Capacitor will be available only when packages are installed
let Capacitor: any;
try {
  Capacitor = require('@capacitor/core').Capacitor;
} catch (e) {
  Capacitor = null;
}

let Preferences: any;
try {
  Preferences = require('@capacitor/preferences').Preferences;
} catch (e) {
  Preferences = null;
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