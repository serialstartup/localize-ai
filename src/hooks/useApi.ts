import { useState, useCallback } from 'react';
import APIService from '../services/api';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const { onSuccess, onError, retryCount = 0, retryDelay = 1000 } = options;

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    attempts: number = retryCount + 1
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await apiCall();
      
      setState({
        data: result,
        isLoading: false,
        error: null,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (attempts > 1) {
        // Retry logic
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return execute(apiCall, attempts - 1);
      }

      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
      });

      if (onError) {
        onError(errorMessage);
      }

      return null;
    }
  }, [onSuccess, onError, retryCount, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Pre-configured API methods
  const sendMessage = useCallback((message: string, location?: any, preferences?: any) => {
    return execute(() => APIService.sendMessage(message, location, preferences));
  }, [execute]);

  const analyzeImage = useCallback((imageUrl: string, message?: string) => {
    return execute(() => APIService.analyzeImage(imageUrl, message));
  }, [execute]);

  const processVoice = useCallback((audioData: string) => {
    return execute(() => APIService.processVoice(audioData));
  }, [execute]);

  const healthCheck = useCallback(() => {
    return execute(() => APIService.healthCheck());
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    // Pre-configured methods
    sendMessage,
    analyzeImage,
    processVoice,
    healthCheck,
  };
}

// Specialized hook for chat messages
export function useChatApi(options: UseApiOptions = {}) {
  const api = useApi(options);
  
  const sendChatMessage = useCallback(async (
    message: string,
    location?: any,
    preferences?: any
  ) => {
    const result = await api.sendMessage(message, location, preferences);
    return result;
  }, [api.sendMessage]);

  return {
    ...api,
    sendChatMessage,
  };
}