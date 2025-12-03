import API from './api';

// Upload service for handling file uploads
export const uploadService = {
  // Upload video
  uploadVideo: async (formData, onProgress) => {
    try {
      const response = await API.post('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await API.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload cover image
  uploadCoverImage: async (coverImageFile) => {
    try {
      const formData = new FormData();
      formData.append('coverImage', coverImageFile);
      
      const response = await API.patch('/users/cover-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update video thumbnail
  updateVideoThumbnail: async (videoId, thumbnailFile) => {
    try {
      const formData = new FormData();
      formData.append('thumbnail', thumbnailFile);
      
      const response = await API.patch(`/videos/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate file
  validateFile: (file, type = 'video') => {
    const MAX_SIZE = type === 'video' ? 1024 * 1024 * 1024 : 5 * 1024 * 1024; // 1GB for video, 5MB for images
    const ALLOWED_TYPES = type === 'video' 
      ? ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Check file size
    if (file.size > MAX_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_SIZE / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
    }

    return true;
  },

  // Get file info
  getFileInfo: (file) => {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  },

  // Create thumbnail from video
  createVideoThumbnail: (videoFile) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Capture at 1 second
      };
      
      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      };
      
      video.onerror = reject;
      
      video.src = URL.createObjectURL(videoFile);
    });
  },

  // Compress image
  compressImage: (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      reader.onload = (e) => {
        image.onload = () => {
          let width = image.width;
          let height = image.height;
          
          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(image, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              }));
            },
            'image/jpeg',
            quality
          );
        };
        
        image.onerror = reject;
        image.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

export default uploadService;