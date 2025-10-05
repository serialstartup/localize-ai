import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locationService from '../services/locationService';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

interface LocationAccuracy {
  level: 'high' | 'medium' | 'low' | 'none';
  meters?: number;
  age?: number;
}

interface LocationContextType {
  currentLocation: Location | null;
  isLocationLoading: boolean;
  locationPermission: 'granted' | 'denied' | 'not-determined';
  recentLocations: Location[];
  locationAccuracy: LocationAccuracy;
  autoLocationEnabled: boolean;
  getCurrentLocation: () => Promise<Location | null>;
  requestLocationPermission: () => Promise<boolean>;
  saveRecentLocation: (location: Location) => Promise<void>;
  clearRecentLocations: () => Promise<void>;
  refreshLocation: () => Promise<Location | null>;
  toggleAutoLocation: (enabled: boolean) => void;
  getLocationStatus: () => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RECENT_LOCATIONS: '@helpme_recent_locations',
  LOCATION_PERMISSION: '@helpme_location_permission',
  AUTO_LOCATION_ENABLED: '@helpme_auto_location_enabled',
};

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'not-determined'>('not-determined');
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const [locationAccuracy, setLocationAccuracy] = useState<LocationAccuracy>({ level: 'none' });
  const [autoLocationEnabled, setAutoLocationEnabled] = useState(false);
  const [unsubscribeAutoLocation, setUnsubscribeAutoLocation] = useState<(() => void) | null>(null);

  useEffect(() => {
    initializeLocation();
    
    // Cleanup on unmount
    return () => {
      if (unsubscribeAutoLocation) {
        unsubscribeAutoLocation();
      }
      locationService.cleanup();
    };
  }, []);

  const initializeLocation = async () => {
    try {
      const [storedLocations, storedPermission, storedAutoLocation] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.LOCATION_PERMISSION),
        AsyncStorage.getItem(STORAGE_KEYS.AUTO_LOCATION_ENABLED),
      ]);

      if (storedLocations) {
        setRecentLocations(JSON.parse(storedLocations));
      }

      if (storedPermission) {
        setLocationPermission(storedPermission as 'granted' | 'denied' | 'not-determined');
      }

      if (storedAutoLocation) {
        const autoEnabled = JSON.parse(storedAutoLocation);
        setAutoLocationEnabled(autoEnabled);
        
        // Start auto location if enabled and permission granted
        if (autoEnabled && storedPermission === 'granted') {
          startAutoLocationTracking();
        }
      }

      // Update accuracy status
      updateLocationAccuracy();
    } catch (error) {
      console.error('Error initializing location:', error);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const permissionResult = await locationService.requestPermissions();
      
      const permission: 'granted' | 'denied' = permissionResult.granted ? 'granted' : 'denied';
      setLocationPermission(permission);
      await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_PERMISSION, permission);
      
      return permissionResult.granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission('denied');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Location | null> => {
    try {
      setIsLocationLoading(true);

      if (locationPermission !== 'granted') {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          const defaultLocation = locationService.getDefaultLocation();
          setCurrentLocation(defaultLocation);
          return defaultLocation;
        }
      }

      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        await saveRecentLocation(location);
        return location;
      }

      // Fallback to default location
      const defaultLocation = locationService.getDefaultLocation();
      setCurrentLocation(defaultLocation);
      return defaultLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      const defaultLocation = locationService.getDefaultLocation();
      setCurrentLocation(defaultLocation);
      return defaultLocation;
    } finally {
      setIsLocationLoading(false);
    }
  };

  const saveRecentLocation = async (location: Location) => {
    try {
      const updatedLocations = [location, ...recentLocations.slice(0, 4)]; // Keep last 5 locations
      
      // Remove duplicates based on coordinates
      const uniqueLocations = updatedLocations.filter((loc, index, self) =>
        index === self.findIndex(l => 
          Math.abs(l.latitude - loc.latitude) < 0.001 && 
          Math.abs(l.longitude - loc.longitude) < 0.001
        )
      );

      setRecentLocations(uniqueLocations);
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(uniqueLocations));
    } catch (error) {
      console.error('Error saving recent location:', error);
    }
  };

  const clearRecentLocations = async () => {
    try {
      setRecentLocations([]);
      await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_LOCATIONS);
    } catch (error) {
      console.error('Error clearing recent locations:', error);
    }
  };

  // Helper methods
  const startAutoLocationTracking = () => {
    if (unsubscribeAutoLocation) {
      unsubscribeAutoLocation(); // Stop existing subscription
    }

    const unsubscribe = locationService.subscribeToLocationUpdates((location) => {
      console.log('📍 Auto location update received:', location);
      setCurrentLocation(location);
      saveRecentLocation(location);
      updateLocationAccuracy();
    });

    setUnsubscribeAutoLocation(() => unsubscribe);
  };

  const stopAutoLocationTracking = () => {
    if (unsubscribeAutoLocation) {
      unsubscribeAutoLocation();
      setUnsubscribeAutoLocation(null);
    }
  };

  const updateLocationAccuracy = () => {
    const accuracy = locationService.getLocationAccuracy();
    setLocationAccuracy(accuracy);
  };

  const refreshLocation = async (): Promise<Location | null> => {
    try {
      setIsLocationLoading(true);
      const location = await locationService.forceLocationRefresh();
      if (location) {
        setCurrentLocation(location);
        await saveRecentLocation(location);
        updateLocationAccuracy();
      }
      return location;
    } catch (error) {
      console.error('Error refreshing location:', error);
      return null;
    } finally {
      setIsLocationLoading(false);
    }
  };

  const toggleAutoLocation = async (enabled: boolean) => {
    try {
      setAutoLocationEnabled(enabled);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_LOCATION_ENABLED, JSON.stringify(enabled));

      if (enabled && locationPermission === 'granted') {
        startAutoLocationTracking();
      } else {
        stopAutoLocationTracking();
      }
    } catch (error) {
      console.error('Error toggling auto location:', error);
    }
  };

  const getLocationStatus = (): string => {
    if (locationPermission !== 'granted') {
      return 'Permission required';
    }

    if (isLocationLoading) {
      return 'Getting location...';
    }

    if (!currentLocation) {
      return 'No location';
    }

    const accuracy = locationAccuracy;
    const status = [];

    if (autoLocationEnabled) {
      status.push('Auto-updating');
    }

    switch (accuracy.level) {
      case 'high':
        status.push(`High accuracy (±${accuracy.meters}m)`);
        break;
      case 'medium':
        status.push(`Medium accuracy (±${accuracy.meters}m)`);
        break;
      case 'low':
        status.push(`Low accuracy (±${accuracy.meters}m)`);
        break;
      default:
        status.push('Location available');
    }

    if (accuracy.age && accuracy.age > 60) {
      status.push(`${Math.round(accuracy.age / 60)}min old`);
    }

    return status.join(' • ');
  };

  const value: LocationContextType = {
    currentLocation,
    isLocationLoading,
    locationPermission,
    recentLocations,
    locationAccuracy,
    autoLocationEnabled,
    getCurrentLocation,
    requestLocationPermission,
    saveRecentLocation,
    clearRecentLocations,
    refreshLocation,
    toggleAutoLocation,
    getLocationStatus,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};