import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prescap.app',
  appName: 'Presensi App',
  webDir: 'dist',
  icon: 'icon.png',  // Use public/icon.png for app icon
  server: {
    androidScheme: 'http',
    allowNavigation: [
      'apipresensidev.malangkab.go.id',
      'presensidev.malangkab.go.id',
      '*'
    ]
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
