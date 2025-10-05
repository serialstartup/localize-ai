import { supabase } from '../lib/supabase'
import type {
  ChatSession,
  ChatMessage,
  Place,
  UserFavorite,
  SearchHistory,
  MessageRecommendation,
  UserActivityLog,
  ChatSessionInsert,
  ChatMessageInsert,
  PlaceInsert,
  UserFavoriteInsert,
  SearchHistoryInsert,
  MessageRecommendationInsert,
  UserActivityLogInsert,
} from '../lib/supabase'
import { ERROR_MESSAGES } from '../config'

export interface DatabaseResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PlaceFilters {
  type?: string
  minRating?: number
  maxDistance?: number
  location?: {
    lat: number
    lng: number
  }
}

class DatabaseService {
  // ================================
  // CHAT SESSIONS
  // ================================

  async createChatSession(title?: string): Promise<DatabaseResponse<ChatSession>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const sessionData: ChatSessionInsert = {
        user_id: user.id,
        title: title || `Chat - ${new Date().toLocaleDateString('tr-TR')}`,
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert(sessionData)
        .select()
        .single()

      if (error) {
        console.error('Create chat session error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as ChatSession }
    } catch (error) {
      console.error('Create chat session exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  async getChatSessions(options: PaginationOptions = {}): Promise<DatabaseResponse<ChatSession[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const { page = 1, limit = 20 } = options
      const offset = (page - 1) * limit

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Get chat sessions error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as ChatSession[] }
    } catch (error) {
      console.error('Get chat sessions exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  async deleteChatSession(sessionId: string): Promise<DatabaseResponse<void>> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ is_archived: true })
        .eq('id', sessionId)

      if (error) {
        console.error('Delete chat session error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete chat session exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // CHAT MESSAGES
  // ================================

  async createChatMessage(messageData: {
    sessionId: string
    messageType: 'user' | 'assistant'
    content: string
    isImage?: boolean
    imageUrl?: string
    location?: {
      lat: number
      lng: number
      address?: string
      city?: string
      country?: string
    }
    processingTime?: number
    aiModel?: string
    searchQuery?: string
  }): Promise<DatabaseResponse<ChatMessage>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const chatMessageData: ChatMessageInsert = {
        session_id: messageData.sessionId,
        user_id: user.id,
        message_type: messageData.messageType,
        content: messageData.content,
        is_image: messageData.isImage || false,
        image_url: messageData.imageUrl,
        location_lat: messageData.location?.lat,
        location_lng: messageData.location?.lng,
        location_address: messageData.location?.address,
        location_city: messageData.location?.city,
        location_country: messageData.location?.country,
        processing_time: messageData.processingTime,
        ai_model: messageData.aiModel,
        search_query: messageData.searchQuery,
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(chatMessageData)
        .select()
        .single()

      if (error) {
        console.error('Create chat message error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as ChatMessage }
    } catch (error) {
      console.error('Create chat message exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  async getChatMessages(sessionId: string, options: PaginationOptions = {}): Promise<DatabaseResponse<ChatMessage[]>> {
    try {
      const { page = 1, limit = 50 } = options
      const offset = (page - 1) * limit

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Get chat messages error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as ChatMessage[] }
    } catch (error) {
      console.error('Get chat messages exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // PLACES
  // ================================

  async upsertPlace(placeData: {
    googlePlaceId?: string
    name: string
    placeType?: string
    formattedAddress?: string
    latitude: number
    longitude: number
    rating?: number
    userRatingsTotal?: number
    priceLevel?: number
    phone?: string
    website?: string
    openingHours?: any
    photos?: any
  }): Promise<DatabaseResponse<Place>> {
    try {
      // First, try to find existing place by google_place_id
      let existingPlace = null;
      if (placeData.googlePlaceId) {
        const { data } = await supabase
          .from('places')
          .select('*')
          .eq('google_place_id', placeData.googlePlaceId)
          .single();
        existingPlace = data;
      }

      const placePayload = {
        id: placeData.googlePlaceId, // Use googlePlaceId as the primary key
        google_place_id: placeData.googlePlaceId,
        name: placeData.name,
        place_type: placeData.placeType,
        formatted_address: placeData.formattedAddress,
        latitude: placeData.latitude,
        longitude: placeData.longitude,
        rating: placeData.rating,
        user_ratings_total: placeData.userRatingsTotal,
        price_level: placeData.priceLevel,
        phone: placeData.phone,
        website: placeData.website,
        opening_hours: placeData.openingHours,
        photos: placeData.photos,
        last_updated_at: new Date().toISOString(),
      };

      let data, error;

      if (existingPlace) {
        // Update existing place
        const result = await supabase
          .from('places')
          .update({
            ...placePayload,
            id: existingPlace.id // Keep existing ID for update
          })
          .eq('id', existingPlace.id)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Insert new place with UUID as primary key
        const result = await supabase
          .from('places')
          .insert(placePayload)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Upsert place error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as Place }
    } catch (error) {
      console.error('Upsert place exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  async searchPlaces(query: string, filters: PlaceFilters = {}, options: PaginationOptions = {}): Promise<DatabaseResponse<Place[]>> {
    try {
      const { page = 1, limit = 20 } = options
      const offset = (page - 1) * limit

      let queryBuilder = supabase
        .from('places')
        .select('*')
        .eq('is_active', true)

      // Text search
      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%, place_type.ilike.%${query}%, formatted_address.ilike.%${query}%`)
      }

      // Filters
      if (filters.type) {
        queryBuilder = queryBuilder.eq('place_type', filters.type)
      }

      if (filters.minRating) {
        queryBuilder = queryBuilder.gte('rating', filters.minRating)
      }

      // Location-based filtering would require PostGIS functions
      // For now, we'll order by created_at
      const { data, error } = await queryBuilder
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Search places error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as Place[] }
    } catch (error) {
      console.error('Search places exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // USER FAVORITES
  // ================================

  async addToFavorites(placeId: string, notes?: string, tags?: string[]): Promise<DatabaseResponse<UserFavorite>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const favoriteData: UserFavoriteInsert = {
        user_id: user.id,
        place_id: placeId,
        notes,
        tags,
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .upsert(favoriteData)
        .select()
        .single()

      if (error) {
        console.error('Add to favorites error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as UserFavorite }
    } catch (error) {
      console.error('Add to favorites exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  async removeFromFavorites(placeId: string): Promise<DatabaseResponse<void>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('place_id', placeId)

      if (error) {
        console.error('Remove from favorites error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true }
    } catch (error) {
      console.error('Remove from favorites exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  async getUserFavorites(options: PaginationOptions = {}): Promise<DatabaseResponse<UserFavorite[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const { page = 1, limit = 20 } = options
      const offset = (page - 1) * limit

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          places (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Get user favorites error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as UserFavorite[] }
    } catch (error) {
      console.error('Get user favorites exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // MESSAGE RECOMMENDATIONS
  // ================================

  async saveMessageRecommendations(messageId: string, recommendations: {
    placeId: string
    aiReason?: string
    aiHighlight?: string
    confidenceScore?: number
    rankOrder: number
  }[]): Promise<DatabaseResponse<MessageRecommendation[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const recommendationData: MessageRecommendationInsert[] = recommendations.map(rec => ({
        message_id: messageId,
        place_id: rec.placeId,
        user_id: user.id,
        ai_reason: rec.aiReason,
        ai_highlight: rec.aiHighlight,
        confidence_score: rec.confidenceScore,
        rank_order: rec.rankOrder,
      }))

      const { data, error } = await supabase
        .from('message_recommendations')
        .insert(recommendationData)
        .select()

      if (error) {
        console.error('Save message recommendations error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as MessageRecommendation[] }
    } catch (error) {
      console.error('Save message recommendations exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // SEARCH HISTORY
  // ================================

  async saveSearchHistory(searchData: {
    searchQuery: string
    searchType?: string
    location?: {
      lat: number
      lng: number
      address?: string
    }
    resultsCount?: number
    processingTime?: number
  }): Promise<DatabaseResponse<SearchHistory>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const historyData: SearchHistoryInsert = {
        user_id: user.id,
        search_query: searchData.searchQuery,
        search_type: searchData.searchType || 'text',
        location_lat: searchData.location?.lat,
        location_lng: searchData.location?.lng,
        location_address: searchData.location?.address,
        results_count: searchData.resultsCount || 0,
        processing_time: searchData.processingTime,
      }

      const { data, error } = await supabase
        .from('search_history')
        .insert(historyData)
        .select()
        .single()

      if (error) {
        console.error('Save search history error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as SearchHistory }
    } catch (error) {
      console.error('Save search history exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // USER ACTIVITY
  // ================================

  async logActivity(activityType: string, activityData?: any, location?: { lat: number; lng: number }): Promise<DatabaseResponse<UserActivityLog>> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' }
      }

      const logData: UserActivityLogInsert = {
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData,
        location_lat: location?.lat,
        location_lng: location?.lng,
      }

      const { data, error } = await supabase
        .from('user_activity_log')
        .insert(logData)
        .select()
        .single()

      if (error) {
        console.error('Log activity error:', error)
        return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
      }

      return { success: true, data: data as UserActivityLog }
    } catch (error) {
      console.error('Log activity exception:', error)
      return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
    }
  }

  // ================================
  // REAL-TIME SUBSCRIPTIONS
  // ================================

  subscribeToUserChatSessions(callback: (payload: any) => void) {
    return supabase
      .channel('user_chat_sessions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chat_sessions' },
        callback
      )
      .subscribe()
  }

  subscribeToChatMessages(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat_messages_${sessionId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  }
}

export default new DatabaseService()