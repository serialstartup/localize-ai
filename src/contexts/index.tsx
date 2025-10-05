import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { LocationProvider } from './LocationContext';
import { PreferencesProvider } from './PreferencesContext';
import { FavoritesProvider } from './FavoritesContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <PreferencesProvider>
      <LocationProvider>
        <AuthProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </AuthProvider>
      </LocationProvider>
    </PreferencesProvider>
  );
};

export { useAuth } from './AuthContext';
export { useLocation } from './LocationContext';
export { usePreferences } from './PreferencesContext';
export { useFavorites } from './FavoritesContext';

export type { User } from './AuthContext';
export type { Location } from './LocationContext';
export type { UserPreferences } from './PreferencesContext';