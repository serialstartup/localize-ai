import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserProfileUpdate } from '../services/authService';
import type { User, UserPreferences } from '../lib/supabase';

interface ExtendedUser extends User {
  preferences?: UserPreferences;
}

interface AuthContextType {
  user: ExtendedUser | null;
  isLoading: boolean;
  hasOnboarded: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (userData: UserProfileUpdate) => Promise<{ success: boolean; error?: string }>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Initialize auth state from Supabase
  useEffect(() => {
    initializeAuth();
    
    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (supabaseUser) => {
      if (supabaseUser) {
        const preferences = await authService.getUserPreferences(supabaseUser.id);
        setUser({
          ...supabaseUser,
          preferences: preferences || undefined,
        });
        setHasOnboarded(supabaseUser.onboarding_completed || false);
      } else {
        setUser(null);
        setHasOnboarded(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('AuthContext: Initializing auth...');
      setIsLoading(true);
      
      // Check if Supabase config is available
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase config missing, using mock auth');
        setUser(null);
        setHasOnboarded(false);
        setIsLoading(false);
        return;
      }
      
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        const preferences = await authService.getUserPreferences(currentUser.id);
        setUser({
          ...currentUser,
          preferences: preferences || undefined,
        });
        setHasOnboarded(currentUser.onboarding_completed || false);
        
        // Ensure user preferences exist if user has completed onboarding but has no preferences
        if (currentUser.onboarding_completed && !preferences) {
          console.log('AuthContext: User has completed onboarding but has no preferences, creating defaults');
          setTimeout(() => ensureUserPreferences(), 100); // Delay to allow user state to be set
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
      setHasOnboarded(false);
    } finally {
      setIsLoading(false);
    }
  };
  // const initializeAuth = async () => {
  //   try {
  //     setIsLoading(true);
  //     const currentUser = await authService.getCurrentUser();
      
  //     if (currentUser) {
  //       const preferences = await authService.getUserPreferences(currentUser.id);
  //       setUser({
  //         ...currentUser,
  //         preferences: preferences || undefined,
  //       });
  //       setHasOnboarded(currentUser.onboarding_completed || false);
  //     }
  //   } catch (error) {
  //     console.error('Error initializing auth:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      setIsLoading(true);
      const response = await authService.signIn({ email, password });
      console.log('AuthContext: AuthService response:', response);
      
      if (response.success && response.user) {
        console.log('AuthContext: Login successful, waiting for auth state change');
        // Auth state listener will handle the rest
        return { success: true };
      } else {
        console.log('AuthContext: Login failed:', response.error);
        setIsLoading(false);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Giriş yaparken bir hata oluştu.' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.signUp({ email, password, name });
      
      if (response.success) {
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, error: 'Hesap oluştururken bir hata oluştu.' };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      // Manually clear user state
      setUser(null);
      setHasOnboarded(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      const response = await authService.completeOnboarding();
      if (response.success) {
        setHasOnboarded(true);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const updateUser = async (userData: UserProfileUpdate) => {
    try {
      if (!user) return { success: false, error: 'Kullanıcı bulunamadı' };
      
      const response = await authService.updateProfile(userData);
      if (response.success) {
        // Refresh user data
        const updatedUser = await authService.getCurrentUser();
        if (updatedUser) {
          const preferences = await authService.getUserPreferences(updatedUser.id);
          setUser({
            ...updatedUser,
            preferences: preferences || undefined,
          });
        }
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Profil güncellenirken hata oluştu.' };
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      if (!user) return { success: false, error: 'Kullanıcı bulunamadı' };
      
      // Ensure interests is included with a default value
      const preferencesWithDefaults = {
        ...preferences,
        interests: preferences.interests || [],
      };
      
      const response = await authService.updatePreferences(preferencesWithDefaults);
      if (response.success) {
        // Update local state
        setUser({
          ...user,
          preferences: user.preferences ? { ...user.preferences, ...preferencesWithDefaults } : preferencesWithDefaults as UserPreferences,
        });
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: 'Tercihler güncellenirken hata oluştu.' };
    }
  };

  // Function to ensure user preferences exist with defaults
  const ensureUserPreferences = async () => {
    if (!user || user.preferences) return; // Already has preferences
    
    try {
      console.log('AuthContext: Creating default preferences for user');
      await updatePreferences({
        theme: 'light',
        language: 'tr',
        push_notifications: true,
        email_notifications: true,
        recommendation_notifications: true,
        nearby_notifications: false,
        location_services: true,
        analytics: true,
        personalized_ads: false,
        show_open_only: false,
        max_distance: 5000,
        currency: 'TRY',
        voice_enabled: true,
        image_analysis: true,
        auto_location: true,
        interests: [],
      });
    } catch (error) {
      console.error('Error ensuring user preferences:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    hasOnboarded,
    login,
    signup,
    logout,
    completeOnboarding,
    updateUser,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};