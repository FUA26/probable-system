export const DEV_CONFIG = {
  // Mock user for development
  mockUser: {
    nip: '199506262024211024',
    nama: 'Developer Test',
    email: 'dev@prescap.com',
    jabatan: 'Developer',
    departemen: 'IT',
    kantor: 'Kantor Pusat',
  },

  // Mock shift data
  mockShift: {
    shift: '1',
    namaShift: 'Pagi',
    jamMasuk: '08:00',
    jamPulang: '17:00',
  },

  // Mock office location
  mockOffice: {
    id: 1,
    nama: 'Kantor Pusat',
    alamat: 'Jl. protokol No. 123',
    latitude: -6.200000,
    longitude: 106.816666,
    radius: 100,
  },

  // Feature flags
  features: {
    enableMockApi: false,
    enableDebugLogs: true,
    skipAuth: false,
  },

  // Time limits (in minutes)
  timeLimits: {
    lateTolerance: 15,
    earlyLeave: 30,
  },
};
