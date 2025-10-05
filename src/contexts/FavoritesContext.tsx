import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import favoritesService, { FavoritePlace, AddFavoriteRequest } from '../services/favoritesService';
import { useAuth } from './AuthContext';
import { createValidUUID } from '../utils/uuid';

interface FavoritesContextType {
  favorites: FavoritePlace[];
  isLoading: boolean;
  favoritesCount: number;
  visitedCount: number;
  addToFavorites: (request: AddFavoriteRequest) => Promise<{ success: boolean; error?: string }>;
  removeFromFavorites: (placeId: string) => Promise<{ success: boolean; error?: string }>;
  isFavorited: (placeId: string) => boolean;
  markAsVisited: (placeId: string) => Promise<{ success: boolean; error?: string }>;
  refreshFavorites: () => Promise<void>;
  checkFavoriteStatus: (placeId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);

  // Load favorites when user is available
  useEffect(() => {
    if (user) {
      loadFavorites();
      loadStats();
    } else {
      // Clear state when user logs out
      setFavorites([]);
      setFavoritesCount(0);
      setVisitedCount(0);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await favoritesService.getFavorites();
      if (response.success && response.data) {
        setFavorites(response.data as FavoritePlace[]);
        setFavoritesCount((response.data as FavoritePlace[]).length);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const [favCount, visitCount] = await Promise.all([
        favoritesService.getFavoritesCount(),
        favoritesService.getVisitedCount()
      ]);
      
      setFavoritesCount(favCount);
      setVisitedCount(visitCount);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const addToFavorites = async (request: AddFavoriteRequest): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    try {
      // Ensure place_id is a valid UUID
      const uuidRequest = {
        ...request,
        place_id: createValidUUID(request.place_id)
      };
      
      const response = await favoritesService.addToFavorites(uuidRequest);
      
      if (response.success && response.data) {
        // Add to local state
        setFavorites(prev => [response.data as FavoritePlace, ...prev]);
        setFavoritesCount(prev => prev + 1);
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: 'Favorilere eklenirken hata oluştu' };
    }
  };

  const removeFromFavorites = async (placeId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    try {
      const uuidPlaceId = createValidUUID(placeId);
      const response = await favoritesService.removeFromFavorites(uuidPlaceId);
      
      if (response.success) {
        // Remove from local state
        const removedFavorite = favorites.find(fav => fav.place_id === uuidPlaceId);
        setFavorites(prev => prev.filter(fav => fav.place_id !== uuidPlaceId));
        setFavoritesCount(prev => prev - 1);
        
        // Update visited count if the removed item was visited
        if (removedFavorite?.is_visited) {
          setVisitedCount(prev => prev - 1);
        }
        
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: 'Favorilerden kaldırılırken hata oluştu' };
    }
  };

  const isFavorited = (placeId: string): boolean => {
    const uuidPlaceId = createValidUUID(placeId);
    return favorites.some(fav => fav.place_id === uuidPlaceId);
  };

  const checkFavoriteStatus = async (placeId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const uuidPlaceId = createValidUUID(placeId);
      return await favoritesService.isFavorited(uuidPlaceId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  const markAsVisited = async (placeId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }

    try {
      const uuidPlaceId = createValidUUID(placeId);
      const response = await favoritesService.markAsVisited(uuidPlaceId);
      
      if (response.success && response.data) {
        // Update local state
        setFavorites(prev => 
          prev.map(fav => 
            fav.place_id === placeId 
              ? { ...fav, is_visited: true, visited_at: response.data!.visited_at }
              : fav
          )
        );
        
        // Update visited count if it wasn't already visited
        const existingFav = favorites.find(fav => fav.place_id === placeId);
        if (existingFav && !existingFav.is_visited) {
          setVisitedCount(prev => prev + 1);
        }
        
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      console.error('Error marking as visited:', error);
      return { success: false, error: 'Ziyaret edildi olarak işaretlenirken hata oluştu' };
    }
  };

  const refreshFavorites = async () => {
    await loadFavorites();
    await loadStats();
  };

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    favoritesCount,
    visitedCount,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    markAsVisited,
    refreshFavorites,
    checkFavoriteStatus,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};