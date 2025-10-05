// Re-export all types for easier importing
export * from './api';
export * from './navigation';
export * from './components';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// Common action types for reducers
export type Action<T extends string = string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

// Place interface
export interface Place {
  id: string | number;
  name: string;
  type: string;
  image: string;
  rating: number;
  distance: string;
  originalDistance?: string;
  tags: string[];
  isOpen?: boolean;
  trending?: boolean;
  description?: string;
  googlePlaceId?: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  isVisited?: boolean;
}

export interface PlaceDetails {
  name: string;
  address: string;
  image?: string;
  rating: number;
  type?: string;
  distance?: string;
  originalDistance?: string;
  phone?: string;
  website?: string;
  hours?: string;
  description?: string;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  theme?: string;
  language?: string;
  push_notifications?: boolean;
  email_notifications?: boolean;
  recommendation_notifications?: boolean;
  nearby_notifications?: boolean;
  location_services?: boolean;
  analytics?: boolean;
  personalized_ads?: boolean;
  show_open_only?: boolean;
  max_distance?: number;
  currency?: string;
  voice_enabled?: boolean;
  image_analysis?: boolean;
  auto_location?: boolean;
  interests?: string[];
  created_at?: string;
  updated_at?: string;
}