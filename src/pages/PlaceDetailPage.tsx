import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import APIService from '../services/api';
import { useLocation } from '../contexts';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const { width } = Dimensions.get('window');

interface PlaceDetailPageProps {
  visible: boolean;
  onClose: () => void;
  place: {
    name: string;
    image: string;
    description?: string;
    distance?: string;
    rating?: number;
    tags?: string[];
    aiHighlight?: string;
    // Google Places ID for detailed info
    googlePlaceId?: string;
  };
}

const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({
  visible,
  onClose,
  place,
}) => {
  const [placeDetails, setPlaceDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const { currentLocation } = useLocation();

  useEffect(() => {
    if (visible && place.googlePlaceId) {
      fetchPlaceDetails();
    }
  }, [visible, place.googlePlaceId]);

  const fetchPlaceDetails = async () => {
    if (!place.googlePlaceId) {
      console.warn('❌ No Google Place ID provided for:', place.name);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('🔍 Fetching place details for:', place.name, 'ID:', place.googlePlaceId);
      const response = await APIService.getPlaceDetails(place.googlePlaceId);
      const details = response.success ? response.data : null;
      console.log('✅ Place details loaded:', details.name);
      setPlaceDetails(details);
    } catch (error) {
      console.error('❌ Failed to fetch place details:', error);
      Alert.alert('Hata', 'Mekan detayları yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneCall = (phone: string) => {
    const phoneNumber = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const handleGetDirections = () => {
    if (placeDetails && currentLocation) {
      const { lat, lng } = placeDetails.geometry.location;
      const url = `https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#fbbf24" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#fbbf24" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#d1d5db" />);
    }

    return stars;
  };

  const getPriceLevelText = (priceLevel?: number) => {
    if (!priceLevel) return 'Bilinmiyor';
    const prices = ['Ücretsiz', 'Ekonomik', 'Orta', 'Pahalı', 'Çok Pahalı'];
    return prices[priceLevel] || 'Bilinmiyor';
  };

  const formatDayName = (dayIndex: number) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[dayIndex];
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} onClose={onClose} size="fullscreen">
      <SafeAreaView className="flex-1 bg-white">
        {/* Header with close button */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
          <TouchableOpacity
            onPress={onClose}
            className="p-2 bg-white rounded-full shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          
          <View className="flex-row">
            <TouchableOpacity
              className="p-2 bg-white rounded-full shadow-sm mr-2"
              activeOpacity={0.7}
            >
              <Ionicons name="heart-outline" size={24} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="p-2 bg-white rounded-full shadow-sm"
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          className="flex-1 bg-white" 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Main Photo */}
          <TouchableOpacity 
            className="relative"
            activeOpacity={0.9}
            onPress={() => setShowPhotoGallery(true)}
          >
            <Image
              source={{ 
                uri: placeDetails?.photos && placeDetails.photos.length > activePhotoIndex 
                  ? APIService.getPhotoUrl(placeDetails.photos[activePhotoIndex].photo_reference, 800)
                  : place.image 
              }}
              className="w-full h-64"
              resizeMode="cover"
            />
            
            {/* Photo gallery indicators */}
            {placeDetails?.photos && placeDetails.photos.length > 1 && (
              <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                <View className="bg-black bg-opacity-50 rounded-full px-3 py-1">
                  <Text className="text-white text-sm">
                    {activePhotoIndex + 1} / {placeDetails.photos.length}
                  </Text>
                </View>
              </View>
            )}
            
            {/* Gallery icon */}
            {placeDetails?.photos && placeDetails.photos.length > 1 && (
              <View className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
                <Ionicons name="images" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Content */}
          <View className="p-4">
            {/* Title and Basic Info */}
            <Text className="text-xl font-bold text-gray-900 mb-2">
              {place.name}
            </Text>
            
            {/* Rating and Reviews */}
            {placeDetails?.rating && (
              <View className="flex-row items-center mb-3">
                <View className="flex-row items-center mr-4">
                  {renderStars(placeDetails.rating)}
                  <Text className="ml-2 text-base font-semibold text-gray-900">
                    {placeDetails.rating.toFixed(1)}
                  </Text>
                </View>
                
                <Text className="text-gray-600">
                  ({placeDetails.user_ratings_total || 0} değerlendirme)
                </Text>
              </View>
            )}

            {/* Tags and Categories */}
            {place.tags && (
              <View className="flex-row flex-wrap mb-4">
                {place.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-purple-50 px-3 py-1 rounded-full mr-2 mb-2 border border-purple-200"
                  >
                    <Text className="text-sm text-purple-700 font-medium">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* AI Highlight */}
            {place.aiHighlight && (
              <View className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
                <Text className="text-sm text-blue-800 font-medium">
                  ✨ {place.aiHighlight}
                </Text>
              </View>
            )}

            {isLoading ? (
              <View className="py-8">
                <LoadingSpinner text="Mekan detayları yükleniyor..." />
                <Text className="text-center text-gray-500 mt-2">
                  Google Places'ten bilgiler getiriliyor...
                </Text>
              </View>
            ) : placeDetails ? (
              <>
                {/* Quick Actions */}
                <View className="flex-row justify-between mb-6">
                  {placeDetails.international_phone_number && (
                    <TouchableOpacity
                      className="flex-1 bg-green-500 rounded-lg p-4 mr-2 items-center"
                      onPress={() => handlePhoneCall(placeDetails.international_phone_number!)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="call" size={20} color="white" />
                      <Text className="text-white font-semibold mt-1">Ara</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    className="flex-1 bg-blue-500 rounded-lg p-4 mx-1 items-center"
                    onPress={handleGetDirections}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="navigate" size={20} color="white" />
                    <Text className="text-white font-semibold mt-1">Yol Tarifi</Text>
                  </TouchableOpacity>
                  
                  {placeDetails.website && (
                    <TouchableOpacity
                      className="flex-1 bg-purple-500 rounded-lg p-4 ml-2 items-center"
                      onPress={() => handleWebsite(placeDetails.website!)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="globe" size={20} color="white" />
                      <Text className="text-white font-semibold mt-1">Website</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Information Sections */}
                <View className="space-y-6">
                  {/* Address and Location */}
                  <View>
                    <Text className="text-lg font-semibold text-gray-900 mb-3">
                      📍 Konum ve Adres
                    </Text>
                    
                    {/* Map placeholder with coordinates */}
                    <TouchableOpacity
                      className="bg-gray-100 rounded-lg p-4 mb-3"
                      onPress={() => {
                        const { lat, lng } = placeDetails.geometry.location;
                        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                        Linking.openURL(url);
                      }}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-gray-900 font-medium mb-1">
                            🗺️ Harita üzerinde görüntüle
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Koordinatlar: {placeDetails.geometry.location.lat.toFixed(6)}, {placeDetails.geometry.location.lng.toFixed(6)}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                      </View>
                    </TouchableOpacity>
                    
                    <Text className="text-gray-700 leading-relaxed">
                      {placeDetails.formatted_address}
                    </Text>
                    <Text className="text-sm text-cyan-600 font-medium mt-1">
                      📏 {place.distance}
                    </Text>
                  </View>

                  {/* Contact Info */}
                  {(placeDetails.international_phone_number || placeDetails.website) && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-3">
                        📞 İletişim
                      </Text>
                      
                      {placeDetails.international_phone_number && (
                        <TouchableOpacity
                          className="flex-row items-center mb-2"
                          onPress={() => handlePhoneCall(placeDetails.international_phone_number!)}
                        >
                          <Ionicons name="call" size={16} color="#059669" />
                          <Text className="ml-2 text-green-600 font-medium">
                            {placeDetails.international_phone_number}
                          </Text>
                        </TouchableOpacity>
                      )}
                      
                      {placeDetails.website && (
                        <TouchableOpacity
                          className="flex-row items-center"
                          onPress={() => handleWebsite(placeDetails.website!)}
                        >
                          <Ionicons name="globe" size={16} color="#7c3aed" />
                          <Text className="ml-2 text-purple-600 font-medium">
                            Website
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Price Level */}
                  {placeDetails.price_level && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-2">
                        💰 Fiyat Aralığı
                      </Text>
                      <Text className="text-gray-700">
                        {getPriceLevelText(placeDetails.price_level)}
                      </Text>
                    </View>
                  )}

                  {/* Opening Hours */}
                  {placeDetails.opening_hours?.weekday_text && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-3">
                        🕒 Açılış Saatleri
                      </Text>
                      
                      <View className="bg-gray-50 rounded-lg p-4">
                        {placeDetails.opening_hours.weekday_text.map((dayText, index) => (
                          <View key={index} className="flex-row justify-between py-1">
                            <Text className="text-gray-700">
                              {dayText}
                            </Text>
                          </View>
                        ))}
                      </View>
                      
                      {placeDetails.opening_hours.open_now !== undefined && (
                        <View className={`mt-2 p-2 rounded-lg ${placeDetails.opening_hours.open_now ? 'bg-green-50' : 'bg-red-50'}`}>
                          <Text className={`text-center font-medium ${placeDetails.opening_hours.open_now ? 'text-green-700' : 'text-red-700'}`}>
                            {placeDetails.opening_hours.open_now ? '🟢 Şu anda açık' : '🔴 Şu anda kapalı'}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Reviews */}
                  {placeDetails.reviews && placeDetails.reviews.length > 0 && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-3">
                        💬 Son Yorumlar
                      </Text>
                      
                      {placeDetails.reviews.slice(0, 3).map((review, index) => (
                        <View key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                          <View className="flex-row items-center justify-between mb-2">
                            <Text className="font-semibold text-gray-900">
                              {review.author_name}
                            </Text>
                            <View className="flex-row">
                              {renderStars(review.rating)}
                              <Text className="ml-1 text-sm text-gray-600">
                                {review.rating}/5
                              </Text>
                            </View>
                          </View>
                          
                          <Text className="text-gray-700 leading-relaxed">
                            {review.text}
                          </Text>
                          
                          <Text className="text-xs text-gray-500 mt-2">
                            {new Date(review.time * 1000).toLocaleDateString('tr-TR')}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </>
            ) : (
              // Fallback content when no Google Place ID is available
              <View className="py-6">
                <Text className="text-center text-gray-600 mb-4">
                  Bu mekan için detaylı bilgiler mevcut değil
                </Text>
                
                {/* Basic info from the place object */}
                <View className="space-y-4">
                  {place.description && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-2">
                        📋 Açıklama
                      </Text>
                      <Text className="text-gray-700 leading-relaxed">
                        {place.description}
                      </Text>
                    </View>
                  )}
                  
                  {place.distance && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-2">
                        📍 Mesafe
                      </Text>
                      <Text className="text-gray-700">
                        {place.distance}
                      </Text>
                    </View>
                  )}
                  
                  {place.rating && (
                    <View>
                      <Text className="text-lg font-semibold text-gray-900 mb-2">
                        ⭐ Puan
                      </Text>
                      <Text className="text-gray-700">
                        {place.rating}/5.0
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Photo Gallery Overlay */}
        {showPhotoGallery && placeDetails?.photos && placeDetails.photos.length > 0 && (
          <View className="absolute inset-0 bg-black z-10">
            <SafeAreaView className="flex-1">
            {/* Photo Gallery Header */}
            <View className="flex-row items-center justify-between p-4">
              <TouchableOpacity
                onPress={() => setShowPhotoGallery(false)}
                className="p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <Text className="text-white font-semibold text-lg">Fotoğraflar</Text>
              <View className="w-10" />
            </View>

            <View className="flex-1">
              <ScrollView 
                horizontal 
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setActivePhotoIndex(index);
                }}
              >
                {placeDetails.photos.map((photo, index) => (
                  <View key={index} style={{ width }}>
                    <Image
                      source={{ 
                        uri: APIService.getPhotoUrl(photo.photo_reference, 800) 
                      }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </ScrollView>
              
              {/* Photo counter */}
              <View className="absolute bottom-6 left-0 right-0 flex-row justify-center">
                <View className="bg-black bg-opacity-70 rounded-full px-4 py-2">
                  <Text className="text-white font-medium">
                    {activePhotoIndex + 1} / {placeDetails.photos.length}
                  </Text>
                </View>
              </View>
            </View>
            </SafeAreaView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default PlaceDetailPage;