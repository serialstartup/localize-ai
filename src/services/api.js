import { ENV_CONFIG } from '../config';

class APIService {
  constructor() {
    this.baseURL = ENV_CONFIG.API_BASE_URL;
    
    if (!this.baseURL) {
      console.warn('API_BASE_URL not configured, API calls will fail');
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log("url----->",url);
    
    

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      console.log("response---->",response);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Send chat message - now handled entirely by backend
  async sendMessage(message, location = null, preferences = null, chatHistory = [], sessionId = null) {
    try {
      return await this.makeRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          userLocation: location,
          chatHistory,
          preferences,
          sessionId
        }),
      });
    } catch (error) {
      console.error('Send message error:', error);
      return {
        success: false,
        error: 'Üzgünüm, şu anda bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
      };
    }
  }


  // Analyze image with AI - handled by backend
  async analyzeImage(imageUrl, message = '', location = null) {
    try {
      return await this.makeRequest('/api/ai/analyze-image', {
        method: 'POST',
        body: JSON.stringify({
          imageUrl,
          message,
          userLocation: location,
        }),
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        success: false,
        error: 'Resmi analiz ederken bir sorun yaşadım. Lütfen tekrar deneyin.',
      };
    }
  }

  // Get search suggestions - handled by backend
  async getSearchSuggestions(partialQuery, location = null, recentSearches = []) {
    try {
      return await this.makeRequest('/api/search/suggestions', {
        method: 'POST',
        body: JSON.stringify({
          query: partialQuery,
          location,
          recentSearches
        }),
      });
    } catch (error) {
      console.error('Search suggestions error:', error);
      return {
        success: false,
        suggestions: [
          'Yakınımda restoran',
          'Güzel kahveci',
          'Alışveriş merkezi',
        ],
      };
    }
  }

  // Search by category - handled by backend
  async searchByCategory(category, location = null, options = {}) {
    try {
      return await this.makeRequest('/api/search/category', {
        method: 'POST',
        body: JSON.stringify({
          category,
          location,
          ...options
        }),
      });
    } catch (error) {
      console.error('Category search error:', error);
      return {
        success: false,
        error: 'Kategori araması sırasında bir sorun yaşadım.',
        places: [],
      };
    }
  }

  // Get popular places - handled by backend
  async getPopularPlaces(location = null, preferences = null, limit = 20) {
    try {
      return await this.makeRequest('/api/search/popular', {
        method: 'POST',
        body: JSON.stringify({
          location,
          preferences,
          limit
        }),
      });
    } catch (error) {
      console.error('Popular places error:', error);
      return {
        success: false,
        error: 'Popüler yerler alınırken bir sorun yaşandı.',
        data: []
      };
    }
  }

  // Get trending places - handled by backend
  async getTrendingPlaces(location = null, preferences = null, limit = 20) {
    try {
      return await this.makeRequest('/api/search/trending', {
        method: 'POST',
        body: JSON.stringify({
          location,
          preferences,
          limit
        }),
      });
    } catch (error) {
      console.error('Trending places error:', error);
      return {
        success: false,
        error: 'Trend yerler alınırken bir sorun yaşandı.',
        data: []
      };
    }
  }

  // Get personalized places - handled by backend
  async getPersonalizedPlaces(location = null, preferences = null, limit = 20) {
    try {
      return await this.makeRequest('/api/search/personalized', {
        method: 'POST',
        body: JSON.stringify({
          location,
          preferences,
          limit
        }),
      });
    } catch (error) {
      console.error('Personalized places error:', error);
      return {
        success: false,
        error: 'Kişiselleştirilmiş öneriler alınırken bir sorun yaşandı.',
        data: []
      };
    }
  }

  // Get place details - handled by backend
  async getPlaceDetails(placeId) {
    try {
      return await this.makeRequest(`/api/search/place/${placeId}`);
    } catch (error) {
      console.error('Place details error:', error);
      return {
        success: false,
        error: 'Yer detayları alınırken bir sorun yaşandı.',
        data: null
      };
    }
  }

  // Get place photo URL - handled by backend
  getPhotoUrl(photoReference, maxwidth = 800, maxheight = 600) {
    return `${this.baseURL}/api/search/photo/${photoReference}?maxwidth=${maxwidth}&maxheight=${maxheight}`;
  }
}

export default new APIService();