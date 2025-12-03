import React, { useState } from 'react';
import VideoCard from '../components/Video/VideoCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiHistory, 
  FiSearch, 
  FiFilter, 
  FiCalendar,
  FiClock,
  FiTrash2,
  FiEyeOff
} from 'react-icons/fi';

const History = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Mock history data
  const [history, setHistory] = useState([
    { 
      _id: '1', 
      title: 'React Tutorial for Beginners', 
      thumbnail: 'https://via.placeholder.com/300x200', 
      views: 1000, 
      owner: { 
        username: 'reactmaster', 
        fullName: 'React Master', 
        avatar: 'https://via.placeholder.com/40' 
      }, 
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      duration: 1200,
      watchedAt: new Date(Date.now() - 3600000)
    },
    { 
      _id: '2', 
      title: 'Node.js Crash Course', 
      thumbnail: 'https://via.placeholder.com/300x200', 
      views: 2000, 
      owner: { 
        username: 'nodeexpert', 
        fullName: 'Node Expert', 
        avatar: 'https://via.placeholder.com/40' 
      }, 
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      duration: 1800,
      watchedAt: new Date(Date.now() - 86400000)
    },
    { 
      _id: '3', 
      title: 'JavaScript Best Practices', 
      thumbnail: 'https://via.placeholder.com/300x200', 
      views: 3000, 
      owner: { 
        username: 'jsguru', 
        fullName: 'JS Guru', 
        avatar: 'https://via.placeholder.com/40' 
      }, 
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      duration: 2400,
      watchedAt: new Date(Date.now() - 259200000)
    },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search
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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(history.map(video => video._id));
    }
    setSelectAll(!selectAll);
  };

  const handleClearSelected = () => {
    if (selectedVideos.length === 0) return;
    
    if (window.confirm(`Remove ${selectedVideos.length} video(s) from history?`)) {
      setHistory(prev => prev.filter(video => !selectedVideos.includes(video._id)));
      setSelectedVideos([]);
      setSelectAll(false);
      toast.success('Removed from history');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all watch history?')) {
      setHistory([]);
      toast.success('History cleared');
    }
  };

  const handlePauseHistory = () => {
    toast.info('Watch history paused');
  };

  const formatWatchedTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return 'Last hour';
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (hours < 168) {
      return `${Math.floor(hours / 24)} days ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  const filteredHistory = history.filter(video => {
    if (!searchQuery) return true;
    return video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           video.owner?.fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <FiHistory className="text-5xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Sign in to view watch history</h2>
        <p className="text-gray-600 mb-6">
          Keep track of videos you've watched and pick up where you left off.
        </p>
        <a href="/login" className="btn-primary inline-block">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FiHistory className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold">Watch History</h1>
          </div>
          <button
            onClick={handlePauseHistory}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiEyeOff />
            <span>Pause watch history</span>
          </button>
        </div>
        <p className="text-gray-600">Videos you've watched will appear here</p>
      </div>

      {/* Search and Actions */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search watch history..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          
          <div className="flex items-center space-x-4">
            {selectedVideos.length > 0 && (
              <button
                onClick={handleClearSelected}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FiTrash2 />
                <span>Remove selected ({selectedVideos.length})</span>
              </button>
            )}
            
            <button
              onClick={handleClearAll}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear all watch history
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b">
            <div className="flex items-center px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="font-medium">Video</span>
              </div>
              <div className="w-48">
                <span className="font-medium">Watched</span>
              </div>
              <div className="w-24"></div>
            </div>
          </div>
          
          <div className="divide-y">
            {filteredHistory.map(video => (
              <div key={video._id} className="flex items-center px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video._id)}
                    onChange={() => handleSelectVideo(video._id)}
                    className="rounded"
                  />
                  
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{video.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                      <span>{video.owner?.fullName}</span>
                      <span>{video.views?.toLocaleString()} views</span>
                      <span>{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{video.description}</p>
                  </div>
                </div>
                
                <div className="w-48">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiClock className="text-gray-400" />
                    <span>{formatWatchedTime(video.watchedAt)}</span>
                  </div>
                </div>
                
                <div className="w-24 text-right">
                  <button
                    onClick={() => window.location.href = `/watch/${video._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FiHistory className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? 'No matching videos found' : 'No watch history yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try a different search term'
              : 'Videos you watch will appear here'
            }
          </p>
        </div>
      )}

      {/* History Stats */}
      {filteredHistory.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">History Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <FiHistory className="text-blue-600" />
                <h4 className="font-medium">Total Videos Watched</h4>
              </div>
              <p className="text-2xl font-bold">{filteredHistory.length}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <FiClock className="text-green-600" />
                <h4 className="font-medium">Total Watch Time</h4>
              </div>
              <p className="text-2xl font-bold">
                {Math.floor(filteredHistory.reduce((acc, video) => acc + video.duration, 0) / 60)} hours
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <FiCalendar className="text-purple-600" />
                <h4 className="font-medium">Active Days</h4>
              </div>
              <p className="text-2xl font-bold">
                {new Set(filteredHistory.map(v => new Date(v.watchedAt).toDateString())).size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;