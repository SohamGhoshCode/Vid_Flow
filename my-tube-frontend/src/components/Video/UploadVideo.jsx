import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVideo } from '../../services/api.js';
import { toast } from 'react-toastify';
import { FiUpload, FiVideo, FiImage, FiX } from 'react-icons/fi';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      
      // Create preview URL
      const videoUrl = URL.createObjectURL(file);
      setPreviewVideo(videoUrl);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewThumbnail(imageUrl);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setPreviewVideo(null);
    if (previewVideo) {
      URL.revokeObjectURL(previewVideo);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreviewThumbnail(null);
    if (previewThumbnail) {
      URL.revokeObjectURL(previewThumbnail);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }
    
    if (!thumbnail) {
      toast.error('Please select a thumbnail');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('videoFile', videoFile);
    formDataToSend.append('thumbnail', thumbnail);

    try {
      const response = await uploadVideo(formDataToSend);
      toast.success('Video uploaded successfully!');
      navigate(`/watch/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Upload */}
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FiUpload className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
            <p className="text-gray-600 mb-4">MP4, WebM, or MOV up to 1GB</p>
            
            {videoFile ? (
              <div className="relative">
                <video
                  src={previewVideo}
                  controls
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <FiX />
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <label className="btn-primary cursor-pointer inline-flex items-center">
                <FiVideo className="mr-2" />
                Select Video
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Thumbnail</h3>
            <p className="text-gray-600 mb-4">JPG, PNG, or GIF up to 5MB</p>
            
            {thumbnail ? (
              <div className="relative inline-block">
                <img
                  src={previewThumbnail}
                  alt="Thumbnail preview"
                  className="w-64 h-36 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <label className="btn-primary cursor-pointer inline-flex items-center">
                <FiImage className="mr-2" />
                Select Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              className="input-field h-32 resize-none"
              rows="4"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !videoFile || !thumbnail}
            className="btn-primary px-6 py-2"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;