export interface ApiResponse<T = any> {
  success: boolean;
  response?: string;
  data?: T;
  recommendations?: Place[];
  error?: string;
  message?: string;
}

export interface ChatMessage {
  id?: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isImage?: boolean;
  imageUrl?: string;
  recommendations?: Place[];
}

export interface ChatRequest {
  message: string;
  location?: LocationData;
  preferences?: UserPreferences;
}

export interface ImageAnalysisRequest {
  imageUrl: string;
  message?: string;
  location?: LocationData;
}

export interface VoiceRequest {
  audio: string;
  location?: LocationData;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface Place {
  id: number;
  name: string;
  type: string;
  image: string;
  rating: number;
  distance: string;
  tags: string[];
  isOpen?: boolean;
  trending?: boolean;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  priceLevel?: 1 | 2 | 3 | 4;
  openingHours?: string[];
  googlePlaceId?: string; // For fetching detailed info
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  notifications: {
    push: boolean;
    email: boolean;
    recommendations: boolean;
    nearby: boolean;
  };
  privacy: {
    locationServices: boolean;
    analytics: boolean;
    personalizedAds: boolean;
  };
  display: {
    showOpenOnly: boolean;
    maxDistance: number;
    currency: 'TRY' | 'USD' | 'EUR';
  };
  chatSettings: {
    voiceEnabled: boolean;
    imageAnalysis: boolean;
    autoLocation: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  lastLoginAt?: string;
}