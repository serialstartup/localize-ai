import React, { memo } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#9333ea',
  text,
  overlay = false,
  style,
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'small';
    }
  };

  const getContainerStyles = (): string => {
    const baseStyles = 'items-center justify-center';
    
    if (overlay) {
      return `${baseStyles} absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-50`;
    }
    
    return baseStyles;
  };

  const getSpinnerContainerStyles = (): string => {
    if (overlay) {
      return 'bg-white rounded-xl p-6 items-center justify-center shadow-lg';
    }
    
    return 'items-center justify-center';
  };

  const getTextStyles = (): string => {
    const sizeStyles = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    return `text-gray-600 mt-3 text-center font-medium ${sizeStyles[size]}`;
  };

  const getDimensions = () => {
    const dimensions = {
      small: { width: 20, height: 20 },
      medium: { width: 32, height: 32 },
      large: { width: 44, height: 44 },
    };

    return dimensions[size];
  };

  return (
    <View className={getContainerStyles()} style={style}>
      <View className={getSpinnerContainerStyles()}>
        <ActivityIndicator
          size={getSpinnerSize()}
          color={color}
          style={getDimensions()}
        />
        {text && <Text className={getTextStyles()}>{text}</Text>}
      </View>
    </View>
  );
};

export default memo(LoadingSpinner);