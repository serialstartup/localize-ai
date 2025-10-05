import React, { ReactNode, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  icon?: IoniconsName;
  iconColor?: string;
  title: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'heart-outline',
  iconColor = '#9ca3af',
  title,
  description,
  actionText,
  onActionPress,
  children,
  style,
}) => {
  return (
    <View 
      className="flex-1 justify-center items-center px-4"
      style={style}
    >
      <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-6">
        <Ionicons name={icon} size={40} color={iconColor} />
      </View>
      
      <Text className="text-gray-600 mb-6 text-lg text-center font-semibold">
        {title}
      </Text>
      
      {description && (
        <Text className="text-gray-500 text-base text-center leading-relaxed max-w-[280px] mb-6">
          {description}
        </Text>
      )}
      
      {actionText && onActionPress && (
        <TouchableOpacity
          className="bg-purple-600 px-6 py-3 rounded-lg"
          onPress={onActionPress}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
      
      {children}
    </View>
  );
};

export default memo(EmptyState);