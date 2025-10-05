import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

interface KeyboardState {
  isVisible: boolean;
  height: number;
  animationDuration: number;
}

export function useKeyboard(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
    animationDuration: 0,
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardState({
        isVisible: true,
        height: event.endCoordinates.height,
        animationDuration: event.duration || 0,
      });
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      setKeyboardState({
        isVisible: false,
        height: 0,
        animationDuration: event.duration || 0,
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  return keyboardState;
}

export function useKeyboardAwareScrollView() {
  const keyboard = useKeyboard();

  const getScrollViewProps = () => ({
    keyboardShouldPersistTaps: 'handled' as const,
    contentContainerStyle: {
      paddingBottom: keyboard.isVisible ? keyboard.height : 0,
    },
  });

  return {
    ...keyboard,
    getScrollViewProps,
  };
}