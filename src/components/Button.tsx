import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
  children,
}) => {
  const getButtonStyles = (): string => {
    const baseStyles = 'flex-row items-center justify-center rounded-xl';
    
    const sizeStyles = {
      small: 'px-4 py-2 min-h-[36px]',
      medium: 'px-6 py-3 min-h-[44px]',
      large: 'px-8 py-4 min-h-[52px]',
    };

    const variantStyles = {
      primary: 'bg-purple-600 shadow-sm',
      secondary: 'bg-gray-100',
      outline: 'border-2 border-purple-600 bg-transparent',
      ghost: 'bg-transparent',
      danger: 'bg-red-500 shadow-sm',
    };

    const disabledStyles = disabled ? 'opacity-50' : '';
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles}`;
  };

  const getTextStyles = (): string => {
    const baseSizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    const variantTextStyles = {
      primary: 'text-white font-semibold',
      secondary: 'text-gray-900 font-semibold',
      outline: 'text-purple-600 font-semibold',
      ghost: 'text-purple-600 font-semibold',
      danger: 'text-white font-semibold',
    };

    return `${baseSizes[size]} ${variantTextStyles[variant]}`;
  };

  const getIconColor = (): string => {
    const variantIconColors = {
      primary: '#ffffff',
      secondary: '#111827',
      outline: '#9333ea',
      ghost: '#9333ea',
      danger: '#ffffff',
    };

    return variantIconColors[variant];
  };

  const getIconSize = (): number => {
    const iconSizes = {
      small: 16,
      medium: 18,
      large: 20,
    };

    return iconSizes[size];
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
        style={{
          marginRight: iconPosition === 'left' && (title || children) ? 8 : 0,
          marginLeft: iconPosition === 'right' && (title || children) ? 8 : 0,
        }}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
        />
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {(title || children) && (
          <Text className={getTextStyles()} style={textStyle}>
            {children || title}
          </Text>
        )}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <TouchableOpacity
      className={getButtonStyles()}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default memo(Button);