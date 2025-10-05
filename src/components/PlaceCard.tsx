import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Place {
  id: number;
  name: string;
  type: string;
  image: string;
  rating: number;
  distance: string;
  tags: string[];
  isOpen?: boolean;
  trending?: boolean;
  description?: string;
}

interface PlaceCardProps {
  place: Place;
  onPress?: () => void;
  onFavoritePress?: (id: number) => void;
  onRemovePress?: (id: number) => void;
  isFavorited?: boolean;
  showFavoriteButton?: boolean;
  showRemoveButton?: boolean;
  showTrendingBadge?: boolean;
  showOpenStatus?: boolean;
  displayMode?: 'card' | 'list';
  style?: StyleProp<ViewStyle>;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onPress,
  onFavoritePress,
  onRemovePress,
  isFavorited = false,
  showFavoriteButton = true,
  showRemoveButton = false,
  showTrendingBadge = false,
  showOpenStatus = false,
  displayMode = 'card',
  style,
}) => {
  const isCardMode = displayMode === 'card';
  const cardClassName = isCardMode 
    ? "card min-w-[300px] max-w-[300px] mr-4" 
    : "card mb-6";

    console.log("placesss here: ", place);
    
  return (
    <TouchableOpacity 
      className={cardClassName}
      style={style}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View className="relative">
        <Image 
          source={{ uri: place.image }} 
          className={isCardMode ? "w-full h-40" : "w-full h-48"}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        {showFavoriteButton && onFavoritePress && (
          <TouchableOpacity 
            className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-md min-h-[44px] min-w-[44px] items-center justify-center ${
              isCardMode ? 'bg-opacity-100' : 'bg-opacity-90'
            }`}
            onPress={() => onFavoritePress(place.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavorited ? 'heart' : 'heart-outline'} 
              size={22} 
              color={isFavorited ? '#ef4444' : '#6b7280'} 
            />
          </TouchableOpacity>
        )}

        {/* Trending Badge */}
        {showTrendingBadge && place.trending && (
          <View className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full flex-row items-center">
            <Text className="text-xs text-white font-bold">
              🔥 TREND
            </Text>
          </View>
        )}
        
        {/* Rating and Distance Overlay (Card Mode) */}
        {isCardMode && (
          <View className="absolute bottom-0 left-0 right-0 p-3 flex-row justify-between items-center">
            <View className="flex-row items-center bg-black bg-opacity-70 px-2 py-1 rounded-lg">
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text className="ml-1 text-sm font-semibold text-white">
                {place.rating}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-row items-center bg-black bg-opacity-70 px-2 py-1 rounded-lg mr-2">
                <Ionicons name="location" size={16} color="#ffffff" />
                <Text className="ml-1 text-sm text-white">
                  {place.distance}
                </Text>
              </View>
              
              {showOpenStatus && place.isOpen && (
                <View className="bg-green-500 px-4 py-1 rounded-lg">
                  <Text className="text-sm font-semibold text-white">
                    Open
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      
      {/* Content */}
      <View className={isCardMode ? "p-4" : "p-6"}>
        {/* Title and Rating/Type (List Mode) */}
        <View className={`flex-row justify-between items-start ${isCardMode ? 'mb-1' : 'mb-3'}`}>
          <View className="flex-1 mr-4">
            <Text className={`font-bold text-gray-900 ${isCardMode ? 'text-lg mb-1' : 'text-lg mb-0.5'}`}>
              {place.name}
            </Text>
            <Text className={`text-gray-500 ${isCardMode ? 'text-sm mb-3' : 'text-sm'}`}>
              {place.type}
            </Text>
          </View>
          
          {/* Rating (List Mode) */}
          {!isCardMode && (
            <View className="flex-row items-center bg-yellow-400 bg-opacity-20 px-4 py-2 rounded-lg">
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text className="ml-1 text-sm font-bold text-white">
                {place.rating}
              </Text>
            </View>
          )}
        </View>
        
        {/* Distance (List Mode) */}
        {!isCardMode && (
          <View className="flex-row items-center mb-6">
            <Ionicons name="location" size={16} color="#9333ea" />
            <Text className="ml-1 text-sm text-gray-700 font-medium">
              {place.distance}
            </Text>
          </View>
        )}
        
        {/* Tags */}
        <View className={`flex-row flex-wrap ${showRemoveButton ? 'mb-3' : ''}`}>
          {place.tags.slice(0, isCardMode ? 3 : place.tags.length).map((tag, idx) => (
            <View 
              key={idx} 
              className={`px-2 py-1 rounded-full mr-1 mb-1 ${
                isCardMode || !showTrendingBadge
                  ? 'bg-gray-100'
                  : 'bg-purple-600 bg-opacity-10 border border-purple-600 border-opacity-20'
              }`}
            >
              <Text className={`text-xs font-medium ${
                isCardMode || !showTrendingBadge
                  ? 'text-gray-700'
                  : 'text-purple-600 font-semibold'
              }`}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Remove Button */}
        {showRemoveButton && onRemovePress && (
          <TouchableOpacity 
            className="flex-row items-center bg-opacity-10 px-4 py-2 rounded-md self-start"
            onPress={() => onRemovePress(place.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
            <Text className="ml-1 text-sm text-red-500 font-medium">
              Remove
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(PlaceCard);