
// ================================
// SUPABASE DATABASE TYPES
// Auto-generated from schema
// ================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ================================
// DATABASE SCHEMA TYPES
// ================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          onboarding_completed: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          onboarding_completed?: boolean
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: 'tr' | 'en'
          push_notifications: boolean
          email_notifications: boolean
          recommendation_notifications: boolean
          nearby_notifications: boolean
          location_services: boolean
          analytics: boolean
          personalized_ads: boolean
          show_open_only: boolean
          max_distance: number
          currency: 'TRY' | 'USD' | 'EUR'
          voice_enabled: boolean
          image_analysis: boolean
          auto_location: boolean
          interests: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: 'tr' | 'en'
          push_notifications?: boolean
          email_notifications?: boolean
          recommendation_notifications?: boolean
          nearby_notifications?: boolean
          location_services?: boolean
          analytics?: boolean
          personalized_ads?: boolean
          show_open_only?: boolean
          max_distance?: number
          currency?: 'TRY' | 'USD' | 'EUR'
          voice_enabled?: boolean
          image_analysis?: boolean
          auto_location?: boolean
          interests?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: 'tr' | 'en'
          push_notifications?: boolean
          email_notifications?: boolean
          recommendation_notifications?: boolean
          nearby_notifications?: boolean
          location_services?: boolean
          analytics?: boolean
          personalized_ads?: boolean
          show_open_only?: boolean
          max_distance?: number
          currency?: 'TRY' | 'USD' | 'EUR'
          voice_enabled?: boolean
          image_analysis?: boolean
          auto_location?: boolean
          interests?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
          last_message_at: string
          is_archived: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
          last_message_at?: string
          is_archived?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
          last_message_at?: string
          is_archived?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          message_type: 'user' | 'assistant'
          content: string
          is_image: boolean
          image_url: string | null
          location_lat: number | null
          location_lng: number | null
          location_address: string | null
          location_city: string | null
          location_country: string | null
          processing_time: number | null
          ai_model: string | null
          search_query: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          message_type: 'user' | 'assistant'
          content: string
          is_image?: boolean
          image_url?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          location_city?: string | null
          location_country?: string | null
          processing_time?: number | null
          ai_model?: string | null
          search_query?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          message_type?: 'user' | 'assistant'
          content?: string
          is_image?: boolean
          image_url?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          location_city?: string | null
          location_country?: string | null
          processing_time?: number | null
          ai_model?: string | null
          search_query?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      places: {
        Row: {
          id: string
          google_place_id: string | null
          name: string
          place_type: string | null
          formatted_address: string | null
          location: unknown | null // PostGIS POINT type
          latitude: number
          longitude: number
          rating: number | null
          user_ratings_total: number | null
          price_level: number | null
          phone: string | null
          website: string | null
          opening_hours: Json | null
          photos: Json | null
          last_updated_at: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          google_place_id?: string | null
          name: string
          place_type?: string | null
          formatted_address?: string | null
          location?: unknown | null
          latitude: number
          longitude: number
          rating?: number | null
          user_ratings_total?: number | null
          price_level?: number | null
          phone?: string | null
          website?: string | null
          opening_hours?: Json | null
          photos?: Json | null
          last_updated_at?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          google_place_id?: string | null
          name?: string
          place_type?: string | null
          formatted_address?: string | null
          location?: unknown | null
          latitude?: number
          longitude?: number
          rating?: number | null
          user_ratings_total?: number | null
          price_level?: number | null
          phone?: string | null
          website?: string | null
          opening_hours?: Json | null
          photos?: Json | null
          last_updated_at?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          id: string
          name: string
          address: string
          image_url: string | null
          rating: number | null
          type: string | null
          phone: string | null
          website: string | null
          hours: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          address: string
          image_url?: string | null
          rating?: number | null
          type?: string | null
          phone?: string | null
          website?: string | null
          hours?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          image_url?: string | null
          rating?: number | null
          type?: string | null
          phone?: string | null
          website?: string | null
          hours?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          place_id: string
          notes: string | null
          tags: string[] | null
          is_visited: boolean
          visited_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          place_id: string
          notes?: string | null
          tags?: string[] | null
          is_visited?: boolean
          visited_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          place_id?: string
          notes?: string | null
          tags?: string[] | null
          is_visited?: boolean
          visited_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_place_id_fkey"
            columns: ["place_id"]
            referencedRelation: "places"
            referencedColumns: ["id"]
          }
        ]
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          search_query: string
          search_type: string
          location_lat: number | null
          location_lng: number | null
          location_address: string | null
          results_count: number
          processing_time: number | null
          ai_response_quality: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_query: string
          search_type?: string
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          results_count?: number
          processing_time?: number | null
          ai_response_quality?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          search_query?: string
          search_type?: string
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          results_count?: number
          processing_time?: number | null
          ai_response_quality?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      message_recommendations: {
        Row: {
          id: string
          message_id: string
          place_id: string
          user_id: string
          ai_reason: string | null
          ai_highlight: string | null
          confidence_score: number | null
          rank_order: number | null
          was_clicked: boolean
          was_visited: boolean
          user_feedback: number | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          place_id: string
          user_id: string
          ai_reason?: string | null
          ai_highlight?: string | null
          confidence_score?: number | null
          rank_order?: number | null
          was_clicked?: boolean
          was_visited?: boolean
          user_feedback?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          place_id?: string
          user_id?: string
          ai_reason?: string | null
          ai_highlight?: string | null
          confidence_score?: number | null
          rank_order?: number | null
          was_clicked?: boolean
          was_visited?: boolean
          user_feedback?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_recommendations_message_id_fkey"
            columns: ["message_id"]
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recommendations_place_id_fkey"
            columns: ["place_id"]
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recommendations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_activity_log: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: Json | null
          location_lat: number | null
          location_lng: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_data?: Json | null
          location_lat?: number | null
          location_lng?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_data?: Json | null
          location_lat?: number | null
          location_lng?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_log_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_feedback: {
        Row: {
          id: string
          user_id: string | null
          feedback_type: string
          title: string
          description: string
          rating: number | null
          is_resolved: boolean
          admin_response: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          feedback_type: string
          title: string
          description: string
          rating?: number | null
          is_resolved?: boolean
          admin_response?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          feedback_type?: string
          title?: string
          description?: string
          rating?: number | null
          is_resolved?: boolean
          admin_response?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          last_login_at: string | null
          theme: 'light' | 'dark' | 'system' | null
          language: 'tr' | 'en' | null
          push_notifications: boolean | null
          location_services: boolean | null
          max_distance: number | null
          currency: 'TRY' | 'USD' | 'EUR' | null
        }
        Relationships: []
      }
      chat_sessions_summary: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          last_message_at: string
          message_count: number
          latest_message_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ================================
// HELPER TYPES FOR APP USAGE
// ================================

// User types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// User preferences types
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

// Place types
export type Place = Database['public']['Tables']['places']['Row']
export type PlaceInsert = Database['public']['Tables']['places']['Insert']
export type PlaceUpdate = Database['public']['Tables']['places']['Update']

// Chat types
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type ChatSessionInsert = Database['public']['Tables']['chat_sessions']['Insert']
export type ChatSessionUpdate = Database['public']['Tables']['chat_sessions']['Update']

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']
export type ChatMessageUpdate = Database['public']['Tables']['chat_messages']['Update']

// Place types
export type Place = Database['public']['Tables']['places']['Row']
export type PlaceInsert = Database['public']['Tables']['places']['Insert']
export type PlaceUpdate = Database['public']['Tables']['places']['Update']

// Favorites types
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row']
export type UserFavoriteInsert = Database['public']['Tables']['user_favorites']['Insert']
export type UserFavoriteUpdate = Database['public']['Tables']['user_favorites']['Update']

// Search history types
export type SearchHistory = Database['public']['Tables']['search_history']['Row']
export type SearchHistoryInsert = Database['public']['Tables']['search_history']['Insert']

// Recommendation types
export type MessageRecommendation = Database['public']['Tables']['message_recommendations']['Row']
export type MessageRecommendationInsert = Database['public']['Tables']['message_recommendations']['Insert']
export type MessageRecommendationUpdate = Database['public']['Tables']['message_recommendations']['Update']

// Activity log types
export type UserActivityLog = Database['public']['Tables']['user_activity_log']['Row']
export type UserActivityLogInsert = Database['public']['Tables']['user_activity_log']['Insert']

// Feedback types
export type UserFeedback = Database['public']['Tables']['user_feedback']['Row']
export type UserFeedbackInsert = Database['public']['Tables']['user_feedback']['Insert']

// View types
export type UserProfile = Database['public']['Views']['user_profiles']['Row']
export type ChatSessionSummary = Database['public']['Views']['chat_sessions_summary']['Row']

// ================================
// EXTENDED TYPES FOR APP FEATURES
// ================================

export interface ChatMessageWithRecommendations extends ChatMessage {
  recommendations?: MessageRecommendation[]
}

export interface PlaceWithFavorite extends Place {
  is_favorite?: boolean
  favorite_notes?: string
  favorite_tags?: string[]
}

export interface UserProfileComplete extends User {
  preferences?: UserPreferences
}

export interface ChatSessionWithStats extends ChatSession {
  message_count: number
  latest_message_at: string | null
  last_message_preview?: string
}

// ================================
// API RESPONSE TYPES
// ================================

export interface SupabaseResponse<T> {
  data: T | null
  error: {
    message: string
    code?: string
  } | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count?: number
  error: {
    message: string
    code?: string
  } | null
}

// ================================
// SEARCH AND FILTER TYPES
// ================================

export interface PlaceSearchFilters {
  place_type?: string
  min_rating?: number
  max_distance?: number
  price_level?: number[]
  is_open_now?: boolean
  has_photos?: boolean
}

export interface ChatSearchFilters {
  session_id?: string
  message_type?: 'user' | 'assistant'
  start_date?: string
  end_date?: string
  search_text?: string
}

export interface UserActivityFilters {
  activity_type?: string
  start_date?: string
  end_date?: string
  location_radius?: number
  center_lat?: number
  center_lng?: number
}

// ================================
// ANALYTICS TYPES
// ================================

export interface UserAnalytics {
  total_searches: number
  total_favorites: number
  total_messages: number
  most_searched_category: string
  average_session_length: number
  favorite_locations: Array<{
    name: string
    count: number
    lat: number
    lng: number
  }>
}

export interface PlaceAnalytics {
  view_count: number
  favorite_count: number
  recommendation_count: number
  average_rating: number
  popular_times?: Record<string, number>
}