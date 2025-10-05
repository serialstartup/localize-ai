import React, { ReactNode, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  seeAllText?: string;
  headerType?: 'simple' | 'enhanced';
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundColor = '#9333ea',
  textColor = '#ffffff',
  showSeeAll = false,
  onSeeAllPress,
  seeAllText = 'See All',
  headerType = 'simple',
  children,
  style,
}) => {
  if (headerType === 'enhanced') {
    return (
      <LinearGradient
        colors={[backgroundColor, '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4"
        style={[
          {
            shadowColor: backgroundColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          },
          style
        ]}
      >
        <Text 
          className="text-4xl font-bold mb-2" 
          style={{ 
            color: textColor,
            letterSpacing: -0.8,
            ...Platform.select({
              ios: { fontFamily: 'System' },
              android: { fontFamily: 'sans-serif-medium' }
            })
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            className="text-lg leading-relaxed"
            style={{ 
              color: textColor,
              opacity: 0.9,
              letterSpacing: 0.2,
            }}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </LinearGradient>
    );
  }

  return (
    <View 
      className="px-6 pt-4 pb-4"
      style={[
        { 
          borderBottomWidth: showSeeAll ? 1 : 0,
          borderBottomColor: '#f1f5f9',
        },
        style
      ]}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text 
            className="text-2xl font-semibold"
            style={{ 
              color: '#1e293b',
              letterSpacing: -0.5,
              ...Platform.select({
                ios: { fontFamily: 'System' },
                android: { fontFamily: 'sans-serif-medium' }
              })
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              className="text-base mt-1"
              style={{ 
                color: '#64748b',
                letterSpacing: 0.1
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        
        {showSeeAll && onSeeAllPress && (
          <TouchableOpacity 
            className="py-2 px-3 bg-purple-50 rounded-full" 
            onPress={onSeeAllPress}
            activeOpacity={0.7}
          >
            <Text className="text-purple-600 text-sm font-medium">
              {seeAllText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

export default memo(PageHeader);