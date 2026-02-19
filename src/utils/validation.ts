/**
 * Validate NIP format
 * NIP should be 18 digits
 */
export const validateNIP = (nip: string): boolean => {
  const nipPattern = /^\d{18}$/;
  return nipPattern.test(nip);
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate latitude coordinate
 */
export const isValidLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

/**
 * Validate longitude coordinate
 */
export const isValidLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};

/**
 * Validate coordinates
 */
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return isValidLatitude(lat) && isValidLongitude(lng);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate device ID
 */
export const validateDeviceId = (deviceId: string): boolean => {
  return deviceId.length > 0 && deviceId.length <= 100;
};

/**
 * Validate token format (JWT)
 */
export const isValidToken = (token: string): boolean => {
  return token.split('.').length === 3;
};

/**
 * Check if string is empty or only whitespace
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Validate required fields
 */
export const validateRequired = (fields: Record<string, any>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || (typeof value === 'string' && isEmpty(value))) {
      errors.push(`${key} is required`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
