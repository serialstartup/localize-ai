import React, { useEffect, memo } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  BackHandler,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'slide' | 'fade';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'slide',
  children,
  style,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  const getModalStyles = (): string => {
    const sizeStyles = {
      small: 'max-w-sm w-full',
      medium: 'max-w-md w-full',
      large: 'max-w-lg w-full',
      fullscreen: 'w-full h-full',
    };

    const baseStyles = 'bg-white rounded-xl shadow-xl mx-4';
    const fullscreenStyles = size === 'fullscreen' ? 'mx-0 rounded-none' : '';

    return `${baseStyles} ${sizeStyles[size]} ${fullscreenStyles}`;
  };

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View 
          className="flex-1 justify-center items-center bg-black bg-opacity-50"
          style={{ opacity: fadeAnim }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              className={getModalStyles()}
              style={[
                { transform: [{ scale: scaleAnim }] },
                style,
              ]}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <View className="flex-row items-center justify-between p-6 pb-0">
                  {title ? (
                    <Text className="text-xl font-bold text-gray-900 flex-1 mr-4">
                      {title}
                    </Text>
                  ) : (
                    <View className="flex-1" />
                  )}
                  
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      className="p-2 -m-2"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={24} color="#6b7280" />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Content */}
              <View className="p-6">
                {children}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="small"
      showCloseButton={false}
    >
      <Text className="text-base text-gray-700 mb-6 leading-relaxed">
        {message}
      </Text>
      
      <View className="flex-row space-x-3">
        <View className="flex-1">
          <Button
            title={cancelText}
            variant="outline"
            onPress={onClose}
          />
        </View>
        <View className="flex-1">
          <Button
            title={confirmText}
            variant={confirmVariant}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

export default memo(Modal);