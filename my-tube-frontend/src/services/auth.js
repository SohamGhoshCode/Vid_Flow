import API from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Auth service functions
export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post('/users/login', credentials);
      
      if (response.data.data.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.data.accessToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
        
        // Set token in axios default headers
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await API.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await API.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      // Remove token from axios default headers
      delete API.defaults.headers.common['Authorization'];
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await API.post('/users/refresh-token');
      
      if (response.data.data.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.data.accessToken);
        
        // Update axios default headers
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
      }
      
      return response.data.data.accessToken;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await API.patch('/users/update-account', userData);
      
      if (response.data.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await API.post('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update avatar
  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await API.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update cover image
  updateCoverImage: async (coverImageFile) => {
    try {
      const formData = new FormData();
      formData.append('coverImage', coverImageFile);
      
      const response = await API.patch('/users/cover-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  },

  // Get auth headers
  getAuthHeader: () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Update user in local storage
  updateUserInStorage: (userData) => {
    const currentUser = authService.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Clear all auth data
  clearAuthData: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    delete API.defaults.headers.common['Authorization'];
  },

  // Check token expiration
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  },

  // Get token expiration time
  getTokenExpiration: (token) => {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  },

  // Initialize auth from storage
  initializeAuth: () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (token && !authService.isTokenExpired(token)) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    } else {
      authService.clearAuthData();
      return false;
    }
  }
};

// Initialize auth on import
authService.initializeAuth();

export default authService;