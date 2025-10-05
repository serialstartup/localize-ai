import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SUPABASE_CONFIG } from '../config'
import { Database } from '../types/supabase'

// Create a custom storage implementation for React Native
const customStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error)
      return null
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error)
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error)
    }
  },
}

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.ANON_KEY,
  {
    auth: {
      storage: customStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

// Export types for easier imports
export type { Database } from '../types/supabase'
export type {
  User,
  UserPreferences,
  ChatSession,
  ChatMessage,
  Place,
  UserFavorite,
} from '../types/supabase'