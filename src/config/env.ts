import Constants from 'expo-constants';

export const ENV_CONFIG = {
  // API Keys - önce process.env'den, sonra Constants.expoConfig.extra'dan al
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.googleMapsApiKey || '',
  // OPENAI_API_KEY removed - now handled by backend
  
  // Supabase
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '',
  
  // Backend URLs
  API_BASE_URL: process.env.EXPO_PUBLIC_APP_ENV === 'production' 
    ? process.env.EXPO_PUBLIC_API_BASE_URL_PROD 
    : process.env.EXPO_PUBLIC_API_BASE_URL_DEV,
  
  // App Configuration
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  IS_DEV: process.env.EXPO_PUBLIC_APP_ENV !== 'production',
  IS_PROD: process.env.EXPO_PUBLIC_APP_ENV === 'production',
  
  // Location Configuration
  DEFAULT_LOCATION: {
    latitude: parseFloat(process.env.EXPO_PUBLIC_DEFAULT_LOCATION_LAT || '41.0082'),
    longitude: parseFloat(process.env.EXPO_PUBLIC_DEFAULT_LOCATION_LNG || '28.9784'),
  },
  DEFAULT_SEARCH_RADIUS: parseInt(process.env.EXPO_PUBLIC_DEFAULT_SEARCH_RADIUS || '5000'),
};

// Debug environment variables (only in development)
if (ENV_CONFIG.IS_DEV) {
  console.log('🔍 Environment Debug:');
  console.log('GOOGLE_MAPS_API_KEY loaded:', !!ENV_CONFIG.GOOGLE_MAPS_API_KEY);
  console.log('SUPABASE_URL loaded:', !!ENV_CONFIG.SUPABASE_URL);
}

// Validation
const validateEnvConfig = () => {
  const requiredKeys = [
    { key: 'GOOGLE_MAPS_API_KEY', value: ENV_CONFIG.GOOGLE_MAPS_API_KEY },
    // OPENAI_API_KEY validation removed - now handled by backend
  ];

  const missingKeys = requiredKeys.filter(({ value }) => !value);
  
  if (missingKeys.length > 0) {
    const missing = missingKeys.map(({ key }) => key).join(', ');
    
    if (ENV_CONFIG.IS_DEV) {
      console.warn(`⚠️  Missing environment variables: ${missing}`);
      console.warn('Please check your .env file or app.json extra configuration');
    } else {
      throw new Error(`Missing required environment variables: ${missing}`);
    }
  }
};

// Run validation
validateEnvConfig();

export default ENV_CONFIG;