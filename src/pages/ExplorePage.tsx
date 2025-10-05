import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaceCard from '../components/PlaceCard';
import CategoryCard from '../components/CategoryCard';
import PageHeader from '../components/PageHeader';
import { useAuth, useFavorites, useLocation } from '../contexts';
import APIService from '../services/api';
import { createValidUUID } from '../utils/uuid';

const categories = [
  {
    id: 1,
    name: 'Food & Drink',
    icon: '🍽️',
    color: '#fef3c7',
    textColor: '#92400e'
  },
  {
    id: 2,
    name: 'Outdoors',
    icon: '🌳',
    color: '#dcfce7',
    textColor: '#166534'
  },
  {
    id: 3,
    name: 'Arts & Culture',
    icon: '🎭',
    color: '#f3e8ff',
    textColor: '#7c3aed'
  },
  {
    id: 4,
    name: 'Nightlife',
    icon: '🍸',
    color: '#e0e7ff',
    textColor: '#3730a3'
  },
  {
    id: 5,
    name: 'Shopping',
    icon: '🛍️',
    color: '#fce7f3',
    textColor: '#be185d'
  },
  {
    id: 6,
    name: 'Entertainment',
    icon: '🎬',
    color: '#fef9c3',
    textColor: '#a16207'
  },
  {
    id: 7,
    name: 'Relaxation',
    icon: '💆',
    color: '#dbeafe',
    textColor: '#1e40af'
  },
  {
    id: 8,
    name: 'Family-Friendly',
    icon: '👪',
    color: '#ccfbf1',
    textColor: '#0f766e'
  }
];

const popularPlaces = [
  {
    id: 1,
    name: 'Artisan Coffee Roasters',
    type: 'Coffee Shop',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.8,
    distance: '0.2 mi',
    isOpen: true,
    description: 'Locally roasted coffee in a cozy atmosphere with excellent pastries and free WiFi.',
    tags: ['Coffee', 'WiFi', 'Pastries', 'Cozy']
  },
  {
    id: 2,
    name: 'Urban Eats',
    type: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.5,
    distance: '0.5 mi',
    isOpen: true,
    description: 'Modern restaurant with locally sourced ingredients and craft cocktails.',
    tags: ['Dinner', 'Cocktails', 'Local']
  },
  {
    id: 3,
    name: 'Green Park Cafe',
    type: 'Cafe',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.7,
    distance: '0.3 mi',
    isOpen: true,
    description: 'Peaceful cafe overlooking the park with organic options.',
    tags: ['Organic', 'Breakfast', 'Lunch']
  }
];

const restaurantPlaces = [
  {
    id: 4,
    name: 'Sushi Paradise',
    type: 'Japanese Restaurant',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.9,
    distance: '0.7 mi',
    isOpen: true,
    description: 'Authentic Japanese cuisine with fresh sushi and sashimi.',
    tags: ['Japanese', 'Sushi', 'Fine Dining']
  },
  {
    id: 5,
    name: 'Bella Italia',
    type: 'Italian Restaurant',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.6,
    distance: '0.8 mi',
    isOpen: false,
    description: 'Family-owned Italian restaurant with homemade pasta.',
    tags: ['Italian', 'Pasta', 'Wine']
  },
  {
    id: 6,
    name: 'Taco Fiesta',
    type: 'Mexican Restaurant',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.4,
    distance: '1.0 mi',
    isOpen: true,
    description: 'Authentic Mexican street food with handmade tortillas.',
    tags: ['Mexican', 'Tacos', 'Margaritas']
  }
];

const ExplorePage = () => {
  const { user } = useAuth();
  const { currentLocation, getCurrentLocation } = useLocation();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  
  const [activeTab, setActiveTab] = useState<'popular' | 'trending' | 'you-may-like'>('popular');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [places, setPlaces] = useState<{
    popular: any[];
    trending: any[];
    youMayLike: any[];
  }>({
    popular: [],
    trending: [],
    youMayLike: []
  });

  useEffect(() => {
    loadPlaceData();
  }, [currentLocation, user]);

  const loadPlaceData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const location = currentLocation || await getCurrentLocation();
      
      if (!location) {
        console.log('No location available for places');
        setPlaces({
          popular: [],
          trending: [],
          youMayLike: []
        });
        return;
      }

      console.log('Searching for high-rated places within 10km of:', location);

      // Simple approach: Get high-rated places within 10km
      try {
        const nearbyPlacesResponse = await APIService.sendMessage(
          `${location.city || 'Bu konumda'} 10 kilometre çevresindeki en iyi puanlı yerler nelerdir? Minimum 4.0 puan olan yerleri öner.`,
          location,
          { 
            max_distance: 10000, // 10km
            show_open_only: false,
            language: user?.preferences?.language || 'tr',
            currency: user?.preferences?.currency || 'TRY'
          },
          []
        );

        console.log('Nearby places API response:', nearbyPlacesResponse);

        if (nearbyPlacesResponse.success && nearbyPlacesResponse.recommendations?.length > 0) {
          const highRatedPlaces = nearbyPlacesResponse.recommendations
            .filter(place => (place.rating || 0) >= 4.0)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0));

          console.log(`Found ${highRatedPlaces.length} high-rated places`);

          setPlaces({
            popular: highRatedPlaces.slice(0, 15).map(place => ({
              ...place,
              googlePlaceId: place.googlePlaceId || `place_${Math.random().toString(36).substr(2, 9)}`
            })),
            trending: highRatedPlaces.filter(p => (p.rating || 0) >= 4.5).slice(0, 10).map(place => ({
              ...place,
              googlePlaceId: place.googlePlaceId || `trending_${Math.random().toString(36).substr(2, 9)}`
            })),
            youMayLike: highRatedPlaces.slice(0, 12).map(place => ({
              ...place,
              googlePlaceId: place.googlePlaceId || `recommended_${Math.random().toString(36).substr(2, 9)}`
            }))
          });
        } else {
          console.log('No places found from API, setting empty lists');
          setPlaces({
            popular: [],
            trending: [],
            youMayLike: []
          });
        }
      } catch (apiError) {
        console.log('API failed:', apiError);
        setPlaces({
          popular: [],
          trending: [],
          youMayLike: []
        });
      }

    } catch (error) {
      console.error('Error loading place data:', error);
      setPlaces({
        popular: [],
        trending: [],
        youMayLike: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPlaceData();
    setRefreshing(false);
  };

  const handleFavoritePress = async (place: any) => {
    const placeId = place.googlePlaceId || place.place_id || String(place.id);
    const uuidPlaceId = createValidUUID(placeId);
    
    console.log('Original place ID:', placeId);
    console.log('Generated UUID:', uuidPlaceId);
    
    if (isFavorited(uuidPlaceId)) {
      await removeFromFavorites(uuidPlaceId);
    } else {
      await addToFavorites({
        place_id: uuidPlaceId,
        place_details: {
          name: place.name,
          address: place.address || place.location || 'Unknown address',
          image: place.image,
          rating: place.rating,
          type: place.type || place.category,
          phone: place.phone,
          website: place.website,
          hours: place.hours,
          distance: place.distance,
          originalDistance: place.distance, // Orijinal mesafeyi saklıyoruz
          description: place.description
        }
      });
    }
  };

  const getCurrentPlaces = () => {
    switch (activeTab) {
      case 'trending':
        return places.trending;
      case 'you-may-like':
        return places.youMayLike;
      default:
        return places.popular;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'trending':
        return 'Trending Places';
      case 'you-may-like':
        return 'You May Like';
      default:
        return 'Popular Places';
    }
  };

  // Transform API response to PlaceCard format
  const transformPlaceData = (place: any) => {
    return {
      id: place.id || place.place_id || Math.random(),
      name: place.name || 'Unknown Place',
      type: place.type || place.types?.[0] || 'Place',
      image: place.image || place.photos?.[0] || place.imageUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      rating: place.rating || 4.0,
      distance: place.distance || '0.5 km',
      tags: place.tags || place.types?.slice(0, 3) || ['Place'],
      isOpen: place.isOpen ?? place.opening_hours?.open_now ?? true,
      description: place.description || place.vicinity || 'Great place to visit',
      trending: place.trending || false,
      googlePlaceId: place.googlePlaceId || place.place_id,
      address: place.address || place.vicinity || place.formatted_address,
      phone: place.phone || place.formatted_phone_number,
      website: place.website,
      hours: place.hours || place.opening_hours
    };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView 
        style={{ flex: 1 }} 
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
        {/* Header */}
        <PageHeader 
          title="Nearby Places"
          subtitle="High-rated places within 10km"
          headerType="simple"
          backgroundColor="#9333ea"
        />

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingHorizontal: 10 }}
          style={{ marginTop: 12 }}
        >
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              category={category}
              onPress={() => {}}
              style={{ marginRight: 12 }}
            />
          ))}
        </ScrollView>

        {/* Tab Navigation */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('popular')}
              style={{
                backgroundColor: activeTab === 'popular' ? '#9333ea' : '#f3f4f6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 12
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: activeTab === 'popular' ? '#ffffff' : '#6b7280',
                fontSize: 14,
                fontWeight: activeTab === 'popular' ? '600' : '500'
              }}>
                🔥 Popular
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('trending')}
              style={{
                backgroundColor: activeTab === 'trending' ? '#9333ea' : '#f3f4f6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 12
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: activeTab === 'trending' ? '#ffffff' : '#6b7280',
                fontSize: 14,
                fontWeight: activeTab === 'trending' ? '600' : '500'
              }}>
                📈 Trending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('you-may-like')}
              style={{
                backgroundColor: activeTab === 'you-may-like' ? '#9333ea' : '#f3f4f6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 12
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: activeTab === 'you-may-like' ? '#ffffff' : '#6b7280',
                fontSize: 14,
                fontWeight: activeTab === 'you-may-like' ? '600' : '500'
              }}>
                ✨ For You
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: 16
          }}>
            {getTabTitle()}
          </Text>

          {isLoading && getCurrentPlaces().length === 0 ? (
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#9333ea" />
              <Text style={{ marginTop: 8, color: '#6b7280', fontSize: 16 }}>
                10km çevrenizdeki yerleri arıyoruz...
              </Text>
            </View>
          ) : getCurrentPlaces().length === 0 ? (
            <View style={{ paddingVertical: 32, alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📍</Text>
              <Text style={{ fontSize: 18, color: '#1f2937', textAlign: 'center', fontWeight: '600', marginBottom: 8 }}>
                {activeTab === 'trending' ? 'Trend yer bulunamadı' : 
                 activeTab === 'you-may-like' ? 'Özel öneri bulunamadı' : 
                 'Popüler yer bulunamadı'}
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 }}>
                Bu bölgede yüksek puanlı yerler bulunamadı.{'\n'}
                Farklı bir konumda deneyin veya sayfayı yenileyin.
              </Text>
            </View>
          ) : (
            <View>
              {getCurrentPlaces().map((place: any, index: number) => {
                const transformedPlace = transformPlaceData(place);
                return (
                  <PlaceCard 
                    key={transformedPlace.id || index} 
                    place={transformedPlace}
                    displayMode="list"
                    showFavoriteButton={true}
                    showOpenStatus={true}
                    showTrendingBadge={activeTab === 'trending'}
                    isFavorited={isFavorited(transformedPlace.googlePlaceId || String(transformedPlace.id))}
                    onFavoritePress={() => handleFavoritePress(transformedPlace)}
                    style={{ marginBottom: 16 }}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExplorePage;