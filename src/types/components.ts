import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Base Component Props
export interface BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// Button Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends BaseComponentProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

// Input Types
export type InputVariant = 'default' | 'search' | 'password';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends BaseComponentProps {
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
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

// Modal Types
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface ModalProps extends BaseComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'slide' | 'fade';
  children: React.ReactNode;
}

export interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

// Loading Spinner Types
export type SpinnerSize = 'small' | 'medium' | 'large';

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: SpinnerSize;
  color?: string;
  text?: string;
  overlay?: boolean;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  textColor: string;
}

export interface CategoryCardProps extends BaseComponentProps {
  category: Category;
  onPress?: (category: Category) => void;
}

// Place Card Types
export interface PlaceCardProps extends BaseComponentProps {
  place: Place;
  onPress?: (place: Place) => void;
  onFavoritePress?: (id: number) => void;
  onRemovePress?: (id: number) => void;
  isFavorited?: boolean;
  showFavoriteButton?: boolean;
  showRemoveButton?: boolean;
  showTrendingBadge?: boolean;
  showOpenStatus?: boolean;
  displayMode?: 'card' | 'list';
}

// Page Header Types
export interface PageHeaderProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  headerType?: 'simple' | 'gradient';
  backgroundColor?: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
}

// Empty State Types
export interface EmptyStateProps extends BaseComponentProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
}

// Import Place type from api.ts
export type { Place } from './api';