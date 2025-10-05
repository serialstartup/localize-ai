import React, { useState, memo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InputVariant = 'default' | 'search' | 'password';
type InputSize = 'small' | 'medium' | 'large';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  required?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  required = false,
  disabled = false,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const isPasswordInput = variant === 'password' || secureTextEntry;
  const showSecureToggle = isPasswordInput && !rightIcon;
  const actualRightIcon = showSecureToggle 
    ? (isSecureVisible ? 'eye-off-outline' : 'eye-outline')
    : rightIcon;

  const getContainerStyles = (): string => {
    const sizeStyles = {
      small: 'px-3 py-2 min-h-[36px]',
      medium: 'px-4 py-3 min-h-[44px]',
      large: 'px-5 py-4 min-h-[52px]',
    };

    const baseStyles = 'flex-row items-center bg-gray-50 rounded-xl border';
    const focusStyles = isFocused ? 'border-purple-600 bg-white' : 'border-gray-200';
    const errorStyles = error ? 'border-red-500 bg-red-50' : '';
    const disabledStyles = disabled ? 'bg-gray-100 opacity-60' : '';

    return `${baseStyles} ${sizeStyles[size]} ${focusStyles} ${errorStyles} ${disabledStyles}`;
  };

  const getTextStyles = (): string => {
    const sizeStyles = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    return `flex-1 ${sizeStyles[size]} text-gray-900`;
  };

  const getLabelStyles = (): string => {
    const baseStyles = 'text-sm font-medium mb-2';
    const errorStyles = error ? 'text-red-600' : 'text-gray-700';
    
    return `${baseStyles} ${errorStyles}`;
  };

  const getIconSize = (): number => {
    const iconSizes = {
      small: 16,
      medium: 18,
      large: 20,
    };

    return iconSizes[size];
  };

  const getIconColor = (): string => {
    if (error) return '#ef4444';
    if (isFocused) return '#9333ea';
    return '#6b7280';
  };

  const handleRightIconPress = () => {
    if (showSecureToggle) {
      setIsSecureVisible(!isSecureVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text className={getLabelStyles()}>
          {label}
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </Text>
      )}
      
      <View className={getContainerStyles()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={getIconSize()}
            color={getIconColor()}
            style={{ marginRight: 8 }}
          />
        )}
        
        <TextInput
          className={getTextStyles()}
          style={inputStyle}
          placeholderTextColor="#9ca3af"
          editable={!disabled}
          secureTextEntry={isPasswordInput && !isSecureVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {actualRightIcon && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            activeOpacity={0.7}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={actualRightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || hint) && (
        <View className="mt-1">
          {error ? (
            <Text className="text-sm text-red-600">{error}</Text>
          ) : hint ? (
            <Text className="text-sm text-gray-500">{hint}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default memo(Input);