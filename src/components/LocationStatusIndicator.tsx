import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../contexts';

interface LocationStatusIndicatorProps {
  onPress?: () => void;
  showText?: boolean;
  compact?: boolean;
}

const LocationStatusIndicator: React.FC<LocationStatusIndicatorProps> = ({ 
  onPress, 
  showText = true, 
  compact = false 
}) => {
  const { 
    locationAccuracy, 
    autoLocationEnabled, 
    isLocationLoading,
    locationPermission,
    getLocationStatus 
  } = useLocation();

  const getAccuracyColor = () => {
    if (locationPermission !== 'granted') return '#6B7280'; // Gray
    if (isLocationLoading) return '#F59E0B'; // Yellow
    
    switch (locationAccuracy.level) {
      case 'high': return '#10B981'; // Green
      case 'medium': return '#F59E0B'; // Yellow
      case 'low': return '#EF4444'; // Red
      case 'none': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  };

  const getAccuracyIcon = () => {
    if (locationPermission !== 'granted') return 'location-outline';
    if (isLocationLoading) return 'refresh';
    
    switch (locationAccuracy.level) {
      case 'high': return 'locate';
      case 'medium': return 'location';
      case 'low': return 'location-outline';
      case 'none': return 'location-outline';
      default: return 'location-outline';
    }
  };

  const statusColor = getAccuracyColor();
  const iconName = getAccuracyIcon() as keyof typeof Ionicons.glyphMap;
  const statusText = getLocationStatus();

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper 
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: compact ? 8 : 12,
          paddingVertical: compact ? 4 : 8,
          borderRadius: compact ? 12 : 16,
          backgroundColor: `${statusColor}15`,
          borderWidth: 1,
          borderColor: `${statusColor}30`,
        }
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Status Icon */}
      <View style={{
        width: compact ? 16 : 20,
        height: compact ? 16 : 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: showText ? (compact ? 6 : 8) : 0,
      }}>
        <Ionicons 
          name={iconName} 
          size={compact ? 14 : 16} 
          color={statusColor}
        />
        
        {/* Auto-update indicator */}
        {autoLocationEnabled && (
          <View style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#10B981',
          }} />
        )}
      </View>

      {/* Status Text */}
      {showText && (
        <Text style={{
          fontSize: compact ? 11 : 13,
          color: statusColor,
          fontWeight: '500',
          opacity: 0.9,
        }}>
          {statusText}
        </Text>
      )}

      {/* Loading animation */}
      {isLocationLoading && (
        <View style={{
          marginLeft: 6,
          width: compact ? 12 : 14,
          height: compact ? 12 : 14,
        }}>
          <Ionicons 
            name="ellipsis-horizontal" 
            size={compact ? 12 : 14} 
            color={statusColor}
          />
        </View>
      )}
    </Wrapper>
  );
};

export default LocationStatusIndicator;