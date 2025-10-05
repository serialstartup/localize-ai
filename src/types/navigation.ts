import { NavigationProp, RouteProp } from '@react-navigation/native';

// Main Stack Navigator Types
export type RootStackParamList = {
  // Onboarding Flow
  Onboarding: { onComplete: () => void };
  Login: undefined;
  Signup: undefined;
  
  // Main App
  Main: undefined;
  
  // Settings Pages
  Language: undefined;
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
};

// Bottom Tab Navigator Types
export type TabParamList = {
  Chat: undefined;
  Explore: undefined;
  Popular: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Navigation Props
export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
export type TabNavigationProp = NavigationProp<TabParamList>;

// Route Props
export type OnboardingRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;
export type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignupRouteProp = RouteProp<RootStackParamList, 'Signup'>;

// Screen Props
export interface OnboardingScreenProps {
  navigation: RootStackNavigationProp;
  route: OnboardingRouteProp;
}

export interface LoginScreenProps {
  navigation: RootStackNavigationProp;
  route: LoginRouteProp;
}

export interface SignupScreenProps {
  navigation: RootStackNavigationProp;
  route: SignupRouteProp;
}

export interface TabScreenProps {
  navigation: TabNavigationProp;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}