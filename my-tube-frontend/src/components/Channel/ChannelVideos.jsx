import React, { useState } from 'react';
import VideoCard from '../Video/VideoCard.jsx';
import { FiGrid, FiList, FiFilter, FiCalendar } from 'react-icons/fi';

const ChannelVideos = ({ videos, channelOwner }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'popular':
        return b.views - a.views;
      case 'duration':
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  const filteredVideos = sortedVideos.filter(video => {
    if (filter === 'all') return true;
    if (filter === 'uploads') return true;
    if (filter === 'playlists') return video.playlist;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Uploads</h2>
          {videos.length > 0 && (
            <p className="text-sm text-gray-600">
              {videos.length} video{videos.length !== 1 ? 's' : ''} • Sort by {sortBy}
            </p>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              title="Grid view"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              title="List view"
            >
              <FiList />
            </button>
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="popular">Most popular</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All videos</option>
              <option value="uploads">Uploads</option>
              <option value="playlists">Playlists</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Grid/List */}
      {filteredVideos.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map(video => (
              <div key={video._id} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-64 h-36 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>{video.views?.toLocaleString()} views</span>
                    <span className="flex items-center space-x-1">
                      <FiCalendar />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-gray-700 line-clamp-2 mb-3">{video.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Watch
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      Save to playlist
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl text-gray-300 mx-auto mb-4">📹</div>
          <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
          <p className="text-gray-600">
            {channelOwner 
              ? "You haven't uploaded any videos yet."
              : "This channel hasn't uploaded any videos yet."
            }
          </p>
          {channelOwner && (
            <button className="mt-4 btn-primary">
              Upload your first video
            </button>
          )}
        </div>
      )}

      {/* Video Stats Summary */}
      {filteredVideos.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Channel Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{filteredVideos.length}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {filteredVideos.reduce((sum, video) => sum + (video.views || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {Math.floor(filteredVideos.reduce((sum, video) => sum + (video.duration || 0), 0) / 3600)} hours
              </div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {filteredVideos.length > 0 
                  ? Math.floor(filteredVideos.reduce((sum, video) => sum + (video.views || 0), 0) / filteredVideos.length).toLocaleString()
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600">Avg Views</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelVideos;