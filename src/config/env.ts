export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  debug: import.meta.env.VITE_DEBUG === 'true',
  validNip: import.meta.env.VITE_VALID_NIP,
};
