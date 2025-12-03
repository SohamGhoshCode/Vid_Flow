// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
};

// Video Categories
export const VIDEO_CATEGORIES = [
  { id: 1, name: 'Music' },
  { id: 2, name: 'Sports' },
  { id: 3, name: 'Gaming' },
  { id: 4, name: 'Movies' },
  { id: 5, name: 'News' },
  { id: 6, name: 'Live' },
  { id: 7, name: 'Learning' },
  { id: 8, name: 'Fashion & Beauty' },
  { id: 9, name: 'Podcasts' },
  { id: 10, name: 'Comedy' }
];

// Video Quality Options
export const VIDEO_QUALITIES = [
  { label: 'Auto', value: 'auto' },
  { label: '144p', value: '144' },
  { label: '240p', value: '240' },
  { label: '360p', value: '360' },
  { label: '480p', value: '480' },
  { label: '720p', value: '720' },
  { label: '1080p', value: '1080' },
  { label: '1440p', value: '1440' },
  { label: '2160p', value: '2160' }
];

// Playback Speeds
export const PLAYBACK_SPEEDS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2x', value: 2 }
];

// Upload Settings
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 1024 * 1024 * 1024, // 1GB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_VIDEO: 'new_video',
  NEW_COMMENT: 'new_comment',
  NEW_LIKE: 'new_like',
  NEW_SUBSCRIBER: 'new_subscriber',
  TRENDING: 'trending'
};