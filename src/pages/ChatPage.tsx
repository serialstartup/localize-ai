import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import APIService from '../services/api';
import { useLocation, useFavorites, useAuth } from '../contexts';
import { useDebounce } from '../hooks';
import { createValidUUID } from '../utils/uuid';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import PlaceDetailPage from './PlaceDetailPage';
import LocationStatusIndicator from '../components/LocationStatusIndicator';


const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: "Merhaba! 👋 Ben senin AI destekli keşif asistanınım. Yakınındaki harika yerleri bulmana yardımcı olabilirim - ne aradığını söyle!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState(null);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);
  const flatListRef = useRef(null);
  const debouncedInputValue = useDebounce(inputValue, 500);

  // Location context, favorites context, and user context
  const { 
    currentLocation, 
    getCurrentLocation, 
    refreshLocation, 
    toggleAutoLocation,
    autoLocationEnabled 
  } = useLocation();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { user } = useAuth();

  // Get search suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInputValue.length > 2) {
        try {
          const location = currentLocation || await getCurrentLocation();
          const response = await APIService.getSearchSuggestions(
            debouncedInputValue,
            location,
            messages
              .filter(msg => msg.type === 'user')
              .map(msg => msg.content)
              .slice(-5)
          );
          
          if (response.success && response.suggestions) {
            setSearchSuggestions(response.suggestions);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.warn('Failed to fetch search suggestions:', error);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedInputValue, currentLocation]);

  // Get initial location when component mounts
  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Add user message immediately
    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);
    
    try {
      // Get current location if not available
      const location = currentLocation || await getCurrentLocation();
      
      // Debug log location to help diagnose accuracy issues
      if (location) {
        console.log('🌍 Location for search:', {
          lat: location.latitude,
          lng: location.longitude,
          address: location.address,
          city: location.city,
          country: location.country
        });
      }
      
      // Make API call with location, user preferences, and chat history
      const chatHistory = messages.slice(-10); // Last 10 messages for context
      const userPreferences = user?.preferences ? {
        language: user.preferences.language || 'tr',
        currency: user.preferences.currency || 'TRY',
        max_distance: user.preferences.max_distance || 5000,
        interests: user.preferences.interests || [],
        show_open_only: user.preferences.show_open_only || false
      } : null;
      
      const response = await APIService.sendMessage(
        userMessage, 
        location, 
        userPreferences,
        chatHistory
      );
      
      if (response.success) {
        const assistantMessage = {
          type: 'assistant',
          content: response.response,
          recommendations: response.recommendations || [],
          searchSuggestions: response.searchSuggestions || [],
          processingTime: response.processingTime,
          intent: response.intent, // Add intent information
          confidence: response.confidence,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Set suggestions based on intent
        if (response.intent === 'CLARIFY_NEEDED' && response.searchSuggestions?.length > 0) {
          setSearchSuggestions(response.searchSuggestions);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } else {
        throw new Error(response.error || 'API response indicated failure');
      }
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Add error message for failed API calls
      const errorMessage = {
        type: 'assistant',
        content: 'Üzgünüm, şu anda bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin. 🤖',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // TODO: Implement actual voice recording
      setTimeout(() => {
        setIsRecording(false);
        // For now, just show a message that voice is not implemented yet
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: 'Sesli giriş henüz desteklenmiyor. Lütfen metin olarak yazın. 🎤',
          timestamp
        }]);
      }, 2000);
    }
  };

  const handleImageUpload = async () => {
    if (isLoading) return;
    
    // For now, simulate image upload with a placeholder
    const imageUrl = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80';
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Add user message with image
    const userMessage = {
      type: 'user',
      content: 'Resim yükledim: Böyle bir yer arıyorum',
      isImage: true,
      imageUrl,
      timestamp
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get current location
      const location = currentLocation || await getCurrentLocation();
      
      // Debug log location for image analysis
      if (location) {
        console.log('🌍 Location for image analysis:', {
          lat: location.latitude,
          lng: location.longitude,
          address: location.address
        });
      }
      
      // Make API call to analyze image with user preferences
      const userPreferences = user?.preferences ? {
        language: user.preferences.language || 'tr',
        currency: user.preferences.currency || 'TRY',
        max_distance: user.preferences.max_distance || 5000,
        interests: user.preferences.interests || [],
        show_open_only: user.preferences.show_open_only || false
      } : null;
      
      const response = await APIService.analyzeImage(
        imageUrl, 
        'Bu resimle ilgili yakındaki yerler öner',
        location,
        userPreferences
      );
      
      if (response.success) {
        const assistantMessage = {
          type: 'assistant',
          content: response.response,
          recommendations: response.recommendations,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Image analysis failed');
      }
      
    } catch (error) {
      console.error('Image analysis error:', error);
      
      // Add error message
      const errorMessage = {
        type: 'assistant',
        content: 'Resmi analiz ederken bir sorun yaşadım. Lütfen tekrar deneyin. 📸',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    if (text.length === 0) {
      setShowSuggestions(false);
    }
  };

  const handleShowAllRecommendations = (recommendations) => {
    setSelectedRecommendations(recommendations);
    setShowAllRecommendations(true);
  };

  const handlePlacePress = (place) => {
    console.log('🔍 Place pressed:', {
      name: place.name,
      hasGooglePlaceId: !!place.googlePlaceId,
      googlePlaceId: place.googlePlaceId,
      allKeys: Object.keys(place)
    });
    setSelectedPlaceForDetail(place);
    setShowPlaceDetail(true);
  };

  const handleFavoritePress = async (place) => {
    const placeId = place.googlePlaceId || place.place_id || String(place.id || Math.random());
    const uuidPlaceId = createValidUUID(placeId);
    
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
          distance: place.distance
        }
      });
    }
  };

  const renderMessage = ({ item: message, index }) => (
    <View key={index} className={`flex-row mb-6 ${message.type === 'user' ? 'justify-end' : 'justify-start'} px-4`}>
      {message.type === 'assistant' && (
        <View className="avatar-bot">
          <Text className="text-base text-white">🤖</Text>
        </View>
      )}
      <View className={`message-container ${message.type === 'user' ? 'message-user max-w-[80%]' : 'message-assistant max-w-[90%]'}`}>
        
        {message.isImage && (
          <View className="p-4 pb-0">
            <Image 
              source={{ uri: message.imageUrl }} 
              className="w-full h-40 rounded-lg mb-3"
              resizeMode="cover"
            />
          </View>
        )}
        
        <View className="px-4 py-3">
          <Text className={message.type === 'user' ? 'message-text-user' : 'message-text-assistant'}>
            {message.content}
          </Text>
        </View>
        
        {message.timestamp && (
          <View className="px-4 pb-3">
            <Text className={`text-xs ${message.type === 'user' ? 'text-white opacity-70 text-right' : 'text-gray-500 text-left'}`}>
              {message.timestamp}
            </Text>
          </View>
        )}
        
        {message.recommendations && message.recommendations.length > 0 && (
          <View className="pt-0">
            {/* Horizontal Scrolling Recommendations (max 10) */}
            <View className="px-4 pt-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-semibold text-gray-900">
                  Öneriler ({message.recommendations.length})
                </Text>
                {message.recommendations.length > 10 && (
                  <TouchableOpacity
                    className="bg-purple-50 px-3 py-1 rounded-full border border-purple-200"
                    activeOpacity={0.7}
                    onPress={() => handleShowAllRecommendations(message.recommendations)}
                  >
                    <Text className="text-sm text-purple-700 font-medium">Tümünü Gör</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            >
              {message.recommendations.slice(0, 10).map((rec, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  className="bg-white rounded-xl mr-3 border border-gray-200 shadow-sm w-[260px]" 
                  activeOpacity={0.9}
                  onPress={() => handlePlacePress(rec)}
                >
                  <Image 
                    source={{ uri: rec.image }} 
                    className="w-full h-[120px] rounded-t-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFavoritePress(rec);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={isFavorited(createValidUUID(rec.googlePlaceId || rec.place_id || String(rec.id))) ? "heart" : "heart-outline"} 
                      size={14} 
                      color={isFavorited(createValidUUID(rec.googlePlaceId || rec.place_id || String(rec.id))) ? "#ef4444" : "#6b7280"} 
                    />
                  </TouchableOpacity>
                  <View className="p-2">
                    <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={1}>
                      {rec.name}
                    </Text>
                    <Text className="text-xs text-gray-600 mb-2" numberOfLines={3}>
                      {rec.description}
                    </Text>
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                        <Ionicons name="location" size={12} color="#9333ea" />
                        <Text className="text-xs text-gray-700 ml-1 font-medium">
                          {rec.distance}
                        </Text>
                      </View>
                      {rec.rating && (
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={12} color="#fbbf24" />
                          <Text className="text-xs text-gray-700 ml-1 font-medium">
                            {rec.rating}
                          </Text>
                        </View>
                      )}
                    </View>
                    {/* Minimalist tags - show only 1 most relevant */}
                    {rec.tags && rec.tags.length > 0 && (
                      <View className="bg-purple-50 px-2 py-1 rounded-md self-start">
                        <Text className="text-xs text-purple-700 font-medium">
                          {rec.tags[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {message.type === 'user' && (
        <View className="avatar-user">
          <Text className="text-sm text-gray-600">👤</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          className="flex-1"
          contentContainerStyle={{ 
            paddingTop: 24,
            paddingBottom: 32,
            paddingHorizontal: 0
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        {/* Search Suggestions or Clarifying Questions */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <View className="bg-white border-t border-gray-200 px-4 py-2">
            <Text className="text-xs text-gray-500 mb-2 font-medium">
              {messages.length > 0 && messages[messages.length - 1]?.intent === 'CLARIFY_NEEDED' 
                ? 'Detay almak için sorular:' 
                : 'Öneriler:'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className="bg-purple-50 px-3 py-2 rounded-full mr-2 border border-purple-200"
                  activeOpacity={0.7}
                >
                  <Text className="text-sm text-purple-700 font-medium">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View className="bg-white border-t border-gray-200 px-4 py-3" 
              style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 16 }}>
          {isLoading && (
            <View className="mb-3 items-center">
              <LoadingSpinner size="small" text="AI düşünüyor..." />
            </View>
          )}
          
          {/* Location Status Indicator */}
          <View className="flex-row justify-between items-center mb-3">
            <LocationStatusIndicator 
              onPress={refreshLocation}
              compact={true}
            />
            
            <TouchableOpacity
              onPress={() => toggleAutoLocation(!autoLocationEnabled)}
              className={`px-3 py-1.5 rounded-lg ${autoLocationEnabled ? 'bg-green-100' : 'bg-gray-100'}`}
              activeOpacity={0.7}
            >
              <Text className={`text-xs font-medium ${autoLocationEnabled ? 'text-green-700' : 'text-gray-600'}`}>
                {autoLocationEnabled ? '📍 Auto' : '📍 Manual'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2">
            <TouchableOpacity 
              onPress={toggleRecording} 
              className={`mr-2 p-2 rounded-full ${isRecording ? 'bg-red-100' : 'bg-transparent'}`}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isRecording ? 'mic' : 'mic-outline'} 
                size={18} 
                color={isRecording ? '#ef4444' : '#9ca3af'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleImageUpload} 
              className="mr-2 p-2 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="image-outline" size={18} color="#9ca3af" />
            </TouchableOpacity>
            
            <TextInput
              className="flex-1 text-sm text-gray-900 max-h-20 min-h-[40px]"
              placeholder={currentLocation ? "Yakındaki yerleri keşfet..." : "Konum alınıyor..."}
              placeholderTextColor="#9ca3af"
              value={inputValue}
              onChangeText={handleInputChange}
              onSubmitEditing={handleSend}
              onFocus={() => setShowSuggestions(true)}
              multiline={true}
              style={{ paddingVertical: 10 }}
              editable={!isLoading}
            />
            
            <TouchableOpacity 
              onPress={handleSend} 
              disabled={!inputValue.trim() || isLoading}
              className={`${inputValue.trim() && !isLoading ? 'bg-purple-600' : 'bg-gray-300'} rounded-full p-2 ml-2`}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="#ffffff" />
              ) : (
                <Ionicons 
                  name="send" 
                  size={16} 
                  color={inputValue.trim() && !isLoading ? '#ffffff' : '#9ca3af'} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* See All Recommendations Modal */}
        <Modal
          visible={showAllRecommendations}
          onClose={() => setShowAllRecommendations(false)}
          title="Tüm Öneriler"
          size="large"
        >
          <ScrollView className="max-h-96">
            {selectedRecommendations && selectedRecommendations.map((rec, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex-row bg-gray-50 rounded-lg mb-3 p-3 border border-gray-100"
                activeOpacity={0.7}
                onPress={() => {
                  setShowAllRecommendations(false);
                  handlePlacePress(rec);
                }}
              >
                <Image
                  source={{ uri: rec.image }}
                  className="w-16 h-16 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-base text-gray-900 mb-1">
                    {rec.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                    {rec.description}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={12} color="#06b6d4" />
                    <Text className="text-xs text-cyan-600 ml-1 font-medium">
                      {rec.distance}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>

        {/* Place Detail Page */}
        <PlaceDetailPage
          visible={showPlaceDetail}
          onClose={() => setShowPlaceDetail(false)}
          place={selectedPlaceForDetail || {
            name: '',
            image: '',
            description: '',
            distance: '',
            rating: 0,
            tags: [],
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;