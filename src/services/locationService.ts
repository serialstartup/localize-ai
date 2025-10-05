import * as Location from 'expo-location';
import { ENV_CONFIG, LOCATION_CONFIG } from '../config';
import { LocationData } from '../types';

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.LocationPermissionResponse['status'];
}

export interface LocationServiceOptions {
  accuracy?: Location.LocationAccuracy;
  timeout?: number;
  maximumAge?: number;
}

interface CachedLocation extends LocationData {
  timestamp: number;
  accuracy: number;
}

interface LocationUpdateCallback {
  (location: LocationData): void;
}

class LocationService {
  private lastKnownLocation: LocationData | null = null;
  private cachedLocation: CachedLocation | null = null;
  private locationWatchSubscription: Location.LocationSubscription | null = null;
  private updateCallbacks: Set<LocationUpdateCallback> = new Set();
  private autoUpdateEnabled: boolean = false;
  private lastUpdateTime: number = 0;
  
  // Cache settings
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MIN_UPDATE_INTERVAL = 30 * 1000; // 30 seconds
  private readonly SIGNIFICANT_DISTANCE = 100; // 100 meters

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<LocationPermissionStatus> {
    try {
      // Check if location services are enabled
      const hasServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!hasServicesEnabled) {
        return {
          granted: false,
          canAskAgain: false,
          status: 'denied',
        };
      }

      // Check current permission status
      const foregroundPermission = await Location.getForegroundPermissionsAsync();
      
      if (foregroundPermission.granted) {
        return {
          granted: true,
          canAskAgain: foregroundPermission.canAskAgain,
          status: foregroundPermission.status,
        };
      }

      // Request permission if not granted
      const permissionResult = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: permissionResult.granted,
        canAskAgain: permissionResult.canAskAgain,
        status: permissionResult.status,
      };
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Check if cached location is still valid
   */
  private isCacheValid(): boolean {
    if (!this.cachedLocation) return false;
    const age = Date.now() - this.cachedLocation.timestamp;
    return age < this.CACHE_DURATION;
  }

  /**
   * Check if location update is needed based on time and distance
   */
  private async shouldUpdateLocation(currentLocation?: LocationData): Promise<boolean> {
    const now = Date.now();
    
    // Check minimum time interval
    if (now - this.lastUpdateTime < this.MIN_UPDATE_INTERVAL) {
      return false;
    }

    // If no current location, definitely update
    if (!currentLocation || !this.lastKnownLocation) {
      return true;
    }

    // Check if moved significantly
    const distance = this.calculateDistance(currentLocation, this.lastKnownLocation);
    return distance.meters > this.SIGNIFICANT_DISTANCE;
  }

  /**
   * Get current location with smart caching
   */
  async getCurrentLocation(options: LocationServiceOptions = {}): Promise<LocationData | null> {
    try {
      // Return cached location if valid
      if (this.isCacheValid() && !options.timeout) {
        console.log('📍 Using cached location (valid for', Math.round((this.CACHE_DURATION - (Date.now() - this.cachedLocation!.timestamp)) / 1000), 'more seconds)');
        return this.cachedLocation;
      }

      const permissions = await this.requestPermissions();
      if (!permissions.granted) {
        console.warn('❌ Location permission not granted, using default location (Istanbul)');
        return this.getDefaultLocation();
      }

      const locationOptions: Location.LocationOptions = {
        accuracy: options.accuracy || Location.Accuracy.Balanced,
        timeout: options.timeout || LOCATION_CONFIG.TIMEOUT,
        maximumAge: options.maximumAge || LOCATION_CONFIG.MAX_AGE,
      };

      const location = await Location.getCurrentPositionAsync(locationOptions);
      
      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log('✅ GPS Location obtained:', {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        cached: false
      });

      // Try to get address information
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          locationData.address = this.formatAddress(address);
          locationData.city = address.city || address.subAdministrativeArea || undefined;
          locationData.country = address.country || undefined;
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

      // Update caches
      this.lastKnownLocation = locationData;
      this.cachedLocation = {
        ...locationData,
        timestamp: Date.now(),
        accuracy: location.coords.accuracy || 0
      };
      this.lastUpdateTime = Date.now();

      // Notify callbacks of location update
      this.notifyLocationUpdate(locationData);

      return locationData;
    } catch (error) {
      console.error('❌ Error getting current location:', error);
      
      // Return cached location if available
      if (this.cachedLocation) {
        console.warn('🔄 Using cached location due to GPS error');
        return this.cachedLocation;
      }

      // Return last known location or default
      const fallbackLocation = this.lastKnownLocation || this.getDefaultLocation();
      console.warn('🔄 Using fallback location:', fallbackLocation);
      return fallbackLocation;
    }
  }

  /**
   * Start watching location changes
   */
  async startLocationWatch(
    callback: (location: LocationData) => void,
    options: LocationServiceOptions = {}
  ): Promise<boolean> {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.granted) {
        console.warn('Location permission not granted for watching');
        return false;
      }

      // Stop existing watch if any
      await this.stopLocationWatch();

      const watchOptions: Location.LocationOptions = {
        accuracy: options.accuracy || Location.Accuracy.Balanced,
        timeInterval: 30000, // Update every 30 seconds
        distanceInterval: 100, // Update every 100 meters
      };

      this.locationWatchSubscription = await Location.watchPositionAsync(
        watchOptions,
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          this.lastKnownLocation = locationData;
          callback(locationData);
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting location watch:', error);
      return false;
    }
  }

  /**
   * Stop watching location changes
   */
  async stopLocationWatch(): Promise<void> {
    if (this.locationWatchSubscription) {
      this.locationWatchSubscription.remove();
      this.locationWatchSubscription = null;
    }
  }

  /**
   * Get default location (Istanbul, Turkey)
   */
  getDefaultLocation(): LocationData {
    console.warn('⚠️ Using default location (Istanbul, Turkey) - GPS not available or permission denied');
    return {
      latitude: ENV_CONFIG.DEFAULT_LOCATION.latitude,
      longitude: ENV_CONFIG.DEFAULT_LOCATION.longitude,
      address: 'Istanbul, Turkey',
      city: 'Istanbul',
      country: 'Turkey',
    };
  }

  /**
   * Get last known location
   */
  getLastKnownLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(
    location1: LocationData,
    location2: LocationData
  ): { meters: number; kilometers: number; formatted: string } {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = location1.latitude * Math.PI / 180;
    const φ2 = location2.latitude * Math.PI / 180;
    const Δφ = (location2.latitude - location1.latitude) * Math.PI / 180;
    const Δλ = (location2.longitude - location1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const meters = R * c;
    const kilometers = meters / 1000;

    let formatted: string;
    if (meters < 1000) {
      formatted = `${Math.round(meters)}m`;
    } else {
      formatted = `${kilometers.toFixed(1)}km`;
    }

    return { meters, kilometers, formatted };
  }

  /**
   * Check if location services are available
   */
  async isLocationAvailable(): Promise<boolean> {
    try {
      const hasServices = await Location.hasServicesEnabledAsync();
      const permissions = await Location.getForegroundPermissionsAsync();
      
      return hasServices && permissions.granted;
    } catch (error) {
      console.error('Error checking location availability:', error);
      return false;
    }
  }

  /**
   * Format address from reverse geocoding
   */
  private formatAddress(address: Location.LocationGeocodedAddress): string {
    const parts = [];
    
    if (address.streetNumber && address.street) {
      parts.push(`${address.streetNumber} ${address.street}`);
    } else if (address.street) {
      parts.push(address.street);
    }
    
    if (address.district) {
      parts.push(address.district);
    }
    
    if (address.city) {
      parts.push(address.city);
    }
    
    if (address.country) {
      parts.push(address.country);
    }

    return parts.join(', ') || 'Unknown Address';
  }

  /**
   * Auto-update functionality - subscribe to location updates
   */
  subscribeToLocationUpdates(callback: LocationUpdateCallback): () => void {
    this.updateCallbacks.add(callback);
    
    // Start auto-update if this is the first subscription
    if (this.updateCallbacks.size === 1 && !this.autoUpdateEnabled) {
      this.startAutoLocationUpdate();
    }
    
    // Return unsubscribe function
    return () => {
      this.updateCallbacks.delete(callback);
      // Stop auto-update if no more subscribers
      if (this.updateCallbacks.size === 0) {
        this.stopAutoLocationUpdate();
      }
    };
  }

  /**
   * Start automatic location updates
   */
  private async startAutoLocationUpdate(): Promise<void> {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.granted) {
        console.warn('Cannot start auto location updates - permission not granted');
        return;
      }

      this.autoUpdateEnabled = true;
      console.log('🔄 Starting automatic location updates');

      // Start watching with smart intervals
      const watchOptions: Location.LocationOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000, // Check every 30 seconds
        distanceInterval: this.SIGNIFICANT_DISTANCE, // Update when moved 100m
      };

      this.locationWatchSubscription = await Location.watchPositionAsync(
        watchOptions,
        async (location) => {
          const newLocationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          // Check if we should update (significant change)
          const shouldUpdate = await this.shouldUpdateLocation(newLocationData);
          if (!shouldUpdate) {
            return;
          }

          console.log('📍 Auto location update triggered:', {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            accuracy: location.coords.accuracy
          });

          // Try to get address information
          try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
              const address = reverseGeocode[0];
              newLocationData.address = this.formatAddress(address);
              newLocationData.city = address.city || address.subAdministrativeArea || undefined;
              newLocationData.country = address.country || undefined;
            }
          } catch (geocodeError) {
            console.warn('Auto-update reverse geocoding failed:', geocodeError);
          }

          // Update caches
          this.lastKnownLocation = newLocationData;
          this.cachedLocation = {
            ...newLocationData,
            timestamp: Date.now(),
            accuracy: location.coords.accuracy || 0
          };
          this.lastUpdateTime = Date.now();

          // Notify all subscribers
          this.notifyLocationUpdate(newLocationData);
        }
      );

    } catch (error) {
      console.error('Failed to start auto location updates:', error);
      this.autoUpdateEnabled = false;
    }
  }

  /**
   * Stop automatic location updates
   */
  private async stopAutoLocationUpdate(): Promise<void> {
    this.autoUpdateEnabled = false;
    await this.stopLocationWatch();
    console.log('⏹️ Stopped automatic location updates');
  }

  /**
   * Notify all subscribers of location update
   */
  private notifyLocationUpdate(location: LocationData): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location update callback:', error);
      }
    });
  }

  /**
   * Get location accuracy status
   */
  getLocationAccuracy(): { level: 'high' | 'medium' | 'low' | 'none'; meters?: number; age?: number } {
    if (!this.cachedLocation) {
      return { level: 'none' };
    }

    const age = Date.now() - this.cachedLocation.timestamp;
    const accuracy = this.cachedLocation.accuracy;

    let level: 'high' | 'medium' | 'low' = 'low';
    if (accuracy <= 10) level = 'high';
    else if (accuracy <= 50) level = 'medium';

    return {
      level,
      meters: accuracy,
      age: Math.round(age / 1000) // age in seconds
    };
  }

  /**
   * Force location refresh (ignores cache)
   */
  async forceLocationRefresh(): Promise<LocationData | null> {
    console.log('🔄 Forcing location refresh...');
    this.cachedLocation = null; // Clear cache
    return this.getCurrentLocation({ timeout: 10000 });
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.stopAutoLocationUpdate();
    this.updateCallbacks.clear();
    this.lastKnownLocation = null;
    this.cachedLocation = null;
  }
}

export default new LocationService();