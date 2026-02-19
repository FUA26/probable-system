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
export const isValidLatitude = (lat: string): boolean => {
  const latNum = parseFloat(lat);
  return !isNaN(latNum) && latNum >= -90 && latNum <= 90;
};

/**
 * Validate longitude coordinate
 */
export const isValidLongitude = (lng: string): boolean => {
  const lngNum = parseFloat(lng);
  return !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180;
};
