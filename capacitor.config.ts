import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prescap.app',
  appName: 'Presensi App',
  webDir: 'dist',
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
  },
};

export default config;
