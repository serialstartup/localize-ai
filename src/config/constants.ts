// Google Places API Constants
export const GOOGLE_PLACES = {
  BASE_URL: 'https://maps.googleapis.com/maps/api/place',
  ENDPOINTS: {
    NEARBY_SEARCH: '/nearbysearch/json',
    TEXT_SEARCH: '/textsearch/json',
    PLACE_DETAILS: '/details/json',
    PLACE_PHOTO: '/photo',
  },
  PLACE_TYPES: {
    RESTAURANT: 'restaurant',
    CAFE: 'cafe',
    BAR: 'bar',
    TOURIST_ATTRACTION: 'tourist_attraction',
    SHOPPING_MALL: 'shopping_mall',
    PARK: 'park',
    MUSEUM: 'museum',
    GYM: 'gym',
    HOSPITAL: 'hospital',
    BANK: 'bank',
  },
  SEARCH_RADIUS: {
    NEARBY: 1000,    // 1km
    MEDIUM: 5000,    // 5km
    FAR: 10000,      // 10km
  },
} as const;


// Chat Constants
export const CHAT_CONFIG = {
  MAX_MESSAGE_HISTORY: 10,
  TYPING_DELAY: 1000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Location Constants
export const LOCATION_CONFIG = {
  ACCURACY: {
    HIGHEST: 1,
    HIGH: 2,
    BALANCED: 3,
    LOW: 4,
  },
  TIMEOUT: 15000, // 15 seconds
  MAX_AGE: 300000, // 5 minutes
} as const;

// UI Constants
export const UI_CONFIG = {
  SEARCH_DEBOUNCE_DELAY: 500,
  IMAGE_LAZY_LOAD_THRESHOLD: 100,
  LIST_ITEM_HEIGHT: 120,
  MAP_ZOOM_LEVEL: 15,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_ERROR: 'Kimlik doğrulama hatası',
  DATABASE_ERROR: 'Veritabanı hatası',
  NETWORK_ERROR: 'Ağ bağlantı hatası',
  VALIDATION_ERROR: 'Doğrulama hatası',
  UNKNOWN_ERROR: 'Bilinmeyen hata',
} as const;