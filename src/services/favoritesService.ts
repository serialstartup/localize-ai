import { supabase } from '../lib/supabase';
import { ERROR_MESSAGES } from '../config';

export interface FavoritePlace {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  place_address: string;
  place_rating: number;
  google_place_id: string;
  notes?: string;
  tags?: string;
  image_url?: string;
  is_visited: boolean;
  visited_at?: string;
  created_at: string;
  updated_at: string;
  // Transformed place details for compatibility
  place: {
    name: string;
    address: string;
    image?: string;
    rating: number;
    type?: string;
    distance?: string;
    phone?: string;
    website?: string;
    hours?: string;
  };
}

export interface AddFavoriteRequest {
  place_id: string;
  notes?: string;
  tags?: string;
  place_details?: {
    name: string;
    address: string;
    image?: string;
    rating?: number;
    type?: string;
    phone?: string;
    website?: string;
    hours?: string;
  };
}

export interface FavoritesResponse {
  success: boolean;
  data?: FavoritePlace[] | FavoritePlace;
  error?: string;
  message?: string;
}

class FavoritesService {
  // Add a place to favorites
  async addToFavorites({ place_id, notes, tags, place_details }: AddFavoriteRequest): Promise<FavoritesResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        };
      }

      // Check if already favorited
      const { data: existingFavorite } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('place_id', place_id)
        .single();

      if (existingFavorite) {
        return {
          success: false,
          error: 'Bu yer zaten favorilerde'
        };
      }

      // Direct approach: Store place info directly in user_favorites (no foreign key needed)
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          place_id,
          place_name: place_details?.name || 'Unknown Place',
          place_address: place_details?.address || 'Unknown Address',
          place_rating: place_details?.rating || 0,
          google_place_id: place_id,
          notes,
          tags,
          image_url: place_details?.image || null,
          is_visited: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      console.log('Adding to favorites with place_id:', place_id);

      if (error) {
        console.error('Add to favorites error:', error);
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        };
      }

      return {
        success: true,
        data: data as FavoritePlace,
        message: 'Favorilere eklendi!'
      };
    } catch (error) {
      console.error('Add to favorites exception:', error);
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      };
    }
  }

  // Remove from favorites
  async removeFromFavorites(place_id: string): Promise<FavoritesResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        };
      }

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('place_id', place_id);

      if (error) {
        console.error('Remove from favorites error:', error);
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        };
      }

      return {
        success: true,
        message: 'Favorilerden kaldırıldı!'
      };
    } catch (error) {
      console.error('Remove from favorites exception:', error);
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      };
    }
  }

  // Get user's favorites
  async getFavorites(): Promise<FavoritesResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        };
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get favorites error:', error);
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        };
      }

      // Transform data to include place details from user_favorites table directly
      const favorites: FavoritePlace[] = (data || []).map(fav => ({
        ...fav,
        place: {
          name: fav.place_name || 'Unknown Place',
          address: fav.place_address || 'Unknown Address',
          image: fav.image_url || undefined,
          rating: fav.place_rating || 0,
          type: fav.place_type || 'Place',
          phone: fav.place_phone || undefined,
          website: fav.place_website || undefined,
          hours: fav.place_hours || undefined,
        }
      }));

      return {
        success: true,
        data: favorites
      };
    } catch (error) {
      console.error('Get favorites exception:', error);
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      };
    }
  }

  // Check if a place is favorited
  async isFavorited(place_id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('place_id', place_id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Check favorite status error:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Check favorite status exception:', error);
      return false;
    }
  }

  // Mark as visited
  async markAsVisited(place_id: string): Promise<FavoritesResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        };
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .update({
          is_visited: true,
          visited_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('place_id', place_id)
        .select()
        .single();

      if (error) {
        console.error('Mark as visited error:', error);
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        };
      }

      return {
        success: true,
        data: data as FavoritePlace,
        message: 'Ziyaret edildi olarak işaretlendi!'
      };
    } catch (error) {
      console.error('Mark as visited exception:', error);
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      };
    }
  }

  // Get favorites count for a user
  async getFavoritesCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return 0;

      const { count, error } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Get favorites count error:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Get favorites count exception:', error);
      return 0;
    }
  }

  // Get visited places count
  async getVisitedCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return 0;

      const { count, error } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_visited', true);

      if (error) {
        console.error('Get visited count error:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Get visited count exception:', error);
      return 0;
    }
  }
}

export default new FavoritesService();