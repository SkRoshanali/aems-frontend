export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  appName: import.meta.env.VITE_APP_NAME || 'AEMS',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  jwtExpiryMinutes: parseInt(import.meta.env.VITE_JWT_EXPIRY_MINUTES || '30'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
