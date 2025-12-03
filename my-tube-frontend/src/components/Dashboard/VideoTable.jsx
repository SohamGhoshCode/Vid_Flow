import React, { useState } from 'react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiBarChart2,
  FiMoreVertical,
  FiGlobe,
  FiLock
} from 'react-icons/fi';
import { formatNumber } from '../../utils/helpers';

const VideoTable = ({ videos, onAction, loading }) => {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVideos(videos.map(v => v._id));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  const sortedVideos = [...videos].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'title':
        aValue = a.title?.toLowerCase();
        bValue = b.title?.toLowerCase();
        break;
      case 'views':
        aValue = a.views || 0;
        bValue = b.views || 0;
        break;
      case 'likes':
        aValue = a.likesCount || 0;
        bValue = b.likesCount || 0;
        break;
      case 'comments':
        aValue = a.commentsCount || 0;
        bValue = b.commentsCount || 0;
        break;
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = 0;
        bValue = 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl text-gray-300 mb-4">🎬</div>
        <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
        <p className="text-gray-600 mb-6">Upload your first video to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {selectedVideos.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-medium">{selectedVideos.length} selected</span>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Make public
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Make private
            </button>
            <button className="text-sm text-red-600 hover:text-red-800">
              Delete selected
            </button>
          </div>
          <button
            onClick={() => setSelectedVideos([])}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear selection
          </button>
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 w-12">
              <input
                type="checkbox"
                checked={selectedVideos.length === videos.length && videos.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
            </th>
            <th 
              className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center space-x-1">
                <span>Video</span>
                {sortBy === 'title' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('views')}
            >
              <div className="flex items-center space-x-1">
                <span>Views</span>
                {sortBy === 'views' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('likes')}
            >
              <div className="flex items-center space-x-1">
                <span>Likes</span>
                {sortBy === 'likes' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('comments')}
            >
              <div className="flex items-center space-x-1">
                <span>Comments</span>
                {sortBy === 'comments' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center space-x-1">
                <span>Date</span>
                {sortBy === 'date' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedVideos.map(video => (
            <tr 
              key={video._id} 
              className={`border-b hover:bg-gray-50 ${selectedVideos.includes(video._id) ? 'bg-blue-50' : ''}`}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedVideos.includes(video._id)}
                  onChange={() => handleSelectVideo(video._id)}
                  className="rounded"
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="max-w-xs">
                    <div className="font-medium line-clamp-1 mb-1">{video.title}</div>
                    <div className="text-xs text-gray-600 line-clamp-1">
                      {video.description || 'No description'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium">{formatNumber(video.views || 0)}</div>
                <div className="text-xs text-gray-600">
                  {video.watchTime ? `${Math.floor(video.watchTime / 60)} min` : '0 min'}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-1">
                  <span>👍</span>
                  <span>{formatNumber(video.likesCount || 0)}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {video.dislikesCount || 0} dislikes
                </div>
              </td>
              <td className="py-3 px-4">
                <div>{formatNumber(video.commentsCount || 0)}</div>
                <div className="text-xs text-gray-600">
                  {video.unreadComments || 0} new
                </div>
              </td>
              <td className="py-3 px-4">
                <div>{new Date(video.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-gray-600">
                  {new Date(video.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  {video.isPublished ? (
                    <>
                      <FiGlobe className="text-green-600" />
                      <span className="text-green-600 font-medium">Public</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Private</span>
                    </>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAction('edit', video._id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => onAction('analytics', video._id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Analytics"
                  >
                    <FiBarChart2 />
                  </button>
                  <button
                    onClick={() => window.open(`/watch/${video._id}`, '_blank')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="View"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => onAction('delete', video._id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {videos.length > 10 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing 1-{Math.min(videos.length, 10)} of {videos.length} videos
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTable;