import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import { getVideoById, getVideoComments, addComment } from '../services/api';
import { ThreeDots } from 'react-loader-spinner';
import { ThumbsUp, ThumbsDown, Share2, Bookmark, MoreVertical } from 'lucide-react';

const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await getVideoById(videoId);
      setVideo(response.data.data);
    } catch (error) {
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getVideoComments(videoId);
      setComments(response.data.data.docs);
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(videoId, newComment);
      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDots color="#3B82F6" height={50} width={50} />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Video not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
        <ReactPlayer
          url={video.videoFile}
          width="100%"
          height="100%"
          controls
          playing
        />
      </div>

      {/* Video Info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{video.owner?.fullName}</p>
                <p className="text-sm text-gray-500">{video.owner?.subscribersCount || 0} subscribers</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
              Subscribe
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <ThumbsUp size={20} />
              <span>{video.likesCount || 0}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Share2 size={20} />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Bookmark size={20} />
              <span>Save</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Video Description */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-semibold">{video.views?.toLocaleString()} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="whitespace-pre-line">{video.description}</p>
        </div>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        
        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Comment
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex space-x-3">
              <img
                src={comment.owner?.avatar}
                alt={comment.owner?.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-semibold">{comment.owner?.fullName}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                    <ThumbsUp size={16} />
                    <span>{comment.likesCount || 0}</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;