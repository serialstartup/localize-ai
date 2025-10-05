import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  notifications: {
    push: boolean;
    email: boolean;
    recommendations: boolean;
    nearby: boolean;
  };
  privacy: {
    locationServices: boolean;
    analytics: boolean;
    personalizedAds: boolean;
  };
  display: {
    showOpenOnly: boolean;
    maxDistance: number; // in km
    currency: 'TRY' | 'USD' | 'EUR';
  };
  chatSettings: {
    voiceEnabled: boolean;
    imageAnalysis: boolean;
    autoLocation: boolean;
  };
}

interface PreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  exportPreferences: () => string;
  importPreferences: (data: string) => Promise<boolean>;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'tr',
  notifications: {
    push: true,
    email: true,
    recommendations: true,
    nearby: false,
  },
  privacy: {
    locationServices: true,
    analytics: true,
    personalizedAds: false,
  },
  display: {
    showOpenOnly: false,
    maxDistance: 10,
    currency: 'TRY',
  },
  chatSettings: {
    voiceEnabled: true,
    imageAnalysis: true,
    autoLocation: true,
  },
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = '@helpme_preferences';

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPreferences) {
        const parsed = JSON.parse(storedPreferences);
        // Merge with default preferences to handle new preference additions
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const resetPreferences = async () => {
    try {
      setPreferences(defaultPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  };

  const exportPreferences = (): string => {
    return JSON.stringify(preferences, null, 2);
  };

  const importPreferences = async (data: string): Promise<boolean> => {
    try {
      const importedPreferences = JSON.parse(data) as UserPreferences;
      
      // Validate the structure
      if (!importedPreferences || typeof importedPreferences !== 'object') {
        throw new Error('Invalid preferences format');
      }

      // Merge with default preferences to ensure all fields exist
      const validatedPreferences = { ...defaultPreferences, ...importedPreferences };
      
      setPreferences(validatedPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validatedPreferences));
      
      return true;
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  };

  const value: PreferencesContextType = {
    preferences,
    isLoading,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};