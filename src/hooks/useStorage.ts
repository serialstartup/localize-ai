import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored value on mount
  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (err) {
      console.error(`Error loading storage key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = useCallback(async (value: T | ((val: T) => T)) => {
    try {
      setError(null);
      
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(`Error setting storage key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key, storedValue]);

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing storage key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key, initialValue]);

  const refresh = useCallback(() => {
    loadStoredValue();
  }, []);

  return {
    value: storedValue,
    setValue,
    removeValue,
    refresh,
    isLoading,
    error,
  };
}