import React, { useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaceCard from '../components/PlaceCard';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLocation } from '../contexts/LocationContext';

const FavoritesPage = () => {
  const { 
    favorites, 
    isLoading, 
    removeFromFavorites, 
    markAsVisited, 
    refreshFavorites 
  } = useFavorites();
  const { currentLocation } = useLocation();
  const [refreshing, setRefreshing] = useState(false);

  console.log("favorites --> ", favorites);

  // Distance hesaplama fonksiyonu (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshFavorites();
    setRefreshing(false);
  };

  const handleRemoveFromFavorites = async (placeId: string) => {
    console.log('Removing favorite with placeId:', placeId);
    const result = await removeFromFavorites(placeId);
    if (!result.success && result.error) {
      console.error('Remove from favorites failed:', result.error);
    }
  };

  // Convert favorites to PlaceCard format
  const favoritePlaces = favorites.map(fav => {
    let distance = fav.place?.originalDistance || fav.place?.distance;
    
    // Eğer distance yoksa ve current location varsa hesapla
    if (!distance && currentLocation && fav.latitude && fav.longitude) {
      distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        fav.latitude,
        fav.longitude
      );
    }
    
    return {
      id: fav.place_id,
      name: fav.place?.name || 'İsimsiz Mekan',
      type: fav.place?.type || 'Mekan',
      image: fav.place?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      rating: fav.place?.rating || 4.0,
      distance: distance || '-- km',
      tags: fav.tags ? [fav.tags] : ['Favori'],
      isVisited: fav.is_visited,
      googlePlaceId: fav.place_id,
      description: fav.place?.description
    };
  });

  

  if (isLoading && favorites.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <PageHeader 
          title="My Favorites" 
          subtitle="Places you've saved for later"
          headerType="simple"
          style={{ paddingHorizontal: 16, paddingTop: 16 }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9333ea" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>
            Loading favorites...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <PageHeader 
        title="My Favorites" 
        subtitle={`${favorites.length} places saved`}
        headerType="simple"
        style={{ paddingHorizontal: 16, paddingTop: 16 }}
      />

      {favoritePlaces.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          description="Start exploring and save places you love!"
          actionText="Explore Now"
          onActionPress={() => {}}
        />
      ) : (
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ padding: 16 }} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#9333ea']}
              tintColor="#9333ea"
            />
          }
        >
          {favoritePlaces.map(place => (
            <PlaceCard 
              key={place.id} 
              place={place}
              displayMode="list"
              showFavoriteButton={false}
              showRemoveButton={true}
              onRemovePress={() => handleRemoveFromFavorites(place.id)}
              style={{ 
                marginBottom: 16,
                opacity: place.isVisited ? 0.7 : 1.0
              }}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default FavoritesPage;