// Environment configuration

export const ENV_CONFIG = {
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  API_BASE_URL: process.env.EXPO_PUBLIC_APP_ENV === 'production' 
    ? process.env.EXPO_PUBLIC_API_BASE_URL_PROD
    : (process.env.EXPO_PUBLIC_API_BASE_URL_DEV || 'http://10.8.11.168:3001'),
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  DEFAULT_LOCATION: {
    latitude: parseFloat(process.env.EXPO_PUBLIC_DEFAULT_LOCATION_LAT || '41.0082'),
    longitude: parseFloat(process.env.EXPO_PUBLIC_DEFAULT_LOCATION_LNG || '28.9784'),
  },
  DEFAULT_SEARCH_RADIUS: parseInt(process.env.EXPO_PUBLIC_DEFAULT_SEARCH_RADIUS || '5000'),
};


// Google Places Configuration  
export const GOOGLE_PLACES = {
  BASE_URL: 'https://maps.googleapis.com/maps/api/place',
  ENDPOINTS: {
    NEARBY_SEARCH: '/nearbysearch/json',
    TEXT_SEARCH: '/textsearch/json',
    PLACE_DETAILS: '/details/json',
    PLACE_PHOTO: '/photo',
  },
  SEARCH_RADIUS: {
    SMALL: 1000,   // 1km
    MEDIUM: 5000,  // 5km
    LARGE: 10000,  // 10km
    EXTRA_LARGE: 25000, // 25km
  },
  POPULAR_TYPES: [
    'restaurant',
    'food',
    'cafe',
    'shopping_mall',
    'tourist_attraction',
    'hospital',
    'pharmacy',
    'gas_station',
    'bank',
    'atm',
  ] as const,
  DEFAULT_FIELDS: [
    'place_id',
    'name',
    'formatted_address', 
    'geometry',
    'rating',
    'user_ratings_total',
    'types',
    'opening_hours',
    'price_level',
    'photos',
  ] as const,
};

// Location Service Configuration
export const LOCATION_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  MAXIMUM_AGE: 300000, // 5 minutes
  HIGH_ACCURACY: true,
  DISTANCE_FILTER: 10, // meters
};

// Cache Configuration
export const CACHE_CONFIG = {
  PLACES_TTL: 5 * 60 * 1000, // 5 minutes
  SEARCH_TTL: 2 * 60 * 1000, // 2 minutes  
  AI_RESPONSE_TTL: 10 * 60 * 1000, // 10 minutes
};

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};

// API Error Messages (Turkish)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'İnternet bağlantısında sorun var. Lütfen tekrar deneyin.',
  LOCATION_ERROR: 'Konumunuza erişilemedi. Lütfen konum izinlerini kontrol edin.',
  API_ERROR: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  NO_RESULTS: 'Bu arama için sonuç bulunamadı. Farklı bir arama deneyebilirsiniz.',
  TIMEOUT_ERROR: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
  AUTH_ERROR: 'Giriş yapma sırasında hata oluştu. Lütfen tekrar deneyin.',
  PERMISSION_ERROR: 'Bu işlem için yetkiniz yok.',
  DATABASE_ERROR: 'Veritabanı hatası oluştu. Lütfen tekrar deneyin.',
};