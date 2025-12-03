import React, { useState } from 'react';
import VideoCard from './VideoCard.jsx';
import { FiGrid, FiList, FiFilter, FiSortAsc, FiSearch } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';

const VideoList = ({ 
  videos, 
  loading, 
  hasMore, 
  onLoadMore, 
  title = "Videos",
  showFilters = true,
  emptyMessage = "No videos found"
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort videos
  const filteredVideos = videos.filter(video => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.owner?.fullName?.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (filter !== 'all' && video.category !== filter) {
      return false;
    }
    
    return true;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'likes':
        return (b.likesCount || 0) - (a.likesCount || 0);
      case 'duration':
        return (b.duration || 0) - (a.duration || 0);
      default:
        return 0;
    }
  });

  // Mock categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'music', label: 'Music' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'education', label: 'Education' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the filteredVideos function
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <ThreeDots color="#3B82F6" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          {videos.length > 0 && (
            <p className="text-gray-600">
              Showing {filteredVideos.length} of {videos.length} video{videos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {/* Search */}
        {showFilters && (
          <form onSubmit={handleSearch} className="mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
          </form>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* View Mode */}
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
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <FiSortAsc className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="popular">Most popular</option>
                <option value="likes">Most liked</option>
                <option value="duration">Longest</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Videos Display */}
      {sortedVideos.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedVideos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVideos.map(video => (
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
                      <span>{video.owner?.fullName}</span>
                      <span>{video.views?.toLocaleString()} views</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-2 mb-3">{video.description}</p>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {video.likesCount || 0} likes • {video.commentsCount || 0} comments
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Watch
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Videos'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl text-gray-300 mx-auto mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? 'No matching videos found' : emptyMessage}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try a different search term'
              : 'Check back later for new content'
            }
          </p>
        </div>
      )}

      {/* Loading indicator for load more */}
      {loading && videos.length > 0 && (
        <div className="flex justify-center py-4">
          <ThreeDots color="#3B82F6" height={30} width={30} />
        </div>
      )}
    </div>
  );
};

export default VideoList;