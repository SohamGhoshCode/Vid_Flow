import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (credentials) => API.post('/users/login', credentials);
export const logoutUser = () => API.post('/users/logout');
export const getCurrentUser = () => API.get('/users/current-user');

// Video services
export const getAllVideos = (params) => API.get('/videos', { params });
export const getVideoById = (videoId) => API.get(`/videos/${videoId}`);
export const uploadVideo = (formData) => API.post('/videos', formData);
export const updateVideo = (videoId, data) => API.patch(`/videos/${videoId}`, data);
export const deleteVideo = (videoId) => API.delete(`/videos/${videoId}`);

// Comment services
export const getVideoComments = (videoId, params) => 
  API.get(`/comments/${videoId}`, { params });
export const addComment = (videoId, content) => 
  API.post(`/comments/${videoId}`, { content });
export const updateComment = (commentId, content) => 
  API.patch(`/comments/c/${commentId}`, { content });
export const deleteComment = (commentId) => 
  API.delete(`/comments/c/${commentId}`);

// Like services
export const likeVideo = (videoId) => API.post(`/likes/toggle/v/${videoId}`);
export const likeComment = (commentId) => API.post(`/likes/toggle/c/${commentId}`);
export const getLikedVideos = () => API.get('/likes/videos');

// Subscription services
export const toggleSubscription = (channelId) => 
  API.post(`/subscriptions/c/${channelId}`);
export const getSubscribedChannels = (subscriberId) => 
  API.get(`/subscriptions/u/${subscriberId}`);
export const getChannelSubscribers = (channelId) => 
  API.get(`/subscriptions/c/${channelId}`);

// Playlist services
export const createPlaylist = (data) => API.post('/playlist', data);
export const getUserPlaylists = (userId) => API.get(`/playlist/user/${userId}`);
export const addToPlaylist = (playlistId, videoId) => 
  API.patch(`/playlist/add/${videoId}/${playlistId}`);

// Channel services
export const getChannelProfile = (username) => API.get(`/users/c/${username}`);
export const getWatchHistory = () => API.get('/users/history');

// Dashboard services
export const getChannelStats = () => API.get('/dashboard/stats');
export const getChannelVideos = () => API.get('/dashboard/videos');

export default API;