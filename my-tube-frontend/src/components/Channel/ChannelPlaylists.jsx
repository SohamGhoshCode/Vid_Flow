import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiGrid, FiList, FiPlus, FiLock } from 'react-icons/fi';

const ChannelPlaylists = ({ playlists, channelOwner }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  const sortedPlaylists = [...playlists].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'videos':
        return b.videosCount - a.videosCount;
      case 'title':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Playlists</h2>
          {playlists.length > 0 && (
            <p className="text-sm text-gray-600">
              {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} • {playlists.reduce((sum, pl) => sum + pl.videosCount, 0)} total videos
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
              <option value="videos">Most videos</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
          
          {channelOwner && (
            <button className="btn-primary flex items-center space-x-2">
              <FiPlus />
              <span>Create Playlist</span>
            </button>
          )}
        </div>
      </div>

      {/* Playlists Grid/List */}
      {sortedPlaylists.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlaylists.map(playlist => (
              <div key={playlist._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Playlist Thumbnail */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPlay className="text-white text-4xl" />
                    </div>
                  )}
                  
                  {/* Playlist Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm">
                        {playlist.videosCount} video{playlist.videosCount !== 1 ? 's' : ''}
                      </span>
                      {playlist.isPrivate && (
                        <FiLock className="text-sm" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Playlist Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{playlist.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{playlist.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Playlist
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPlaylists.map(playlist => (
              <div key={playlist._id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                {/* Playlist Thumbnail */}
                <div className="relative w-32 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden flex-shrink-0">
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPlay className="text-white text-2xl" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {playlist.videosCount}
                  </div>
                </div>
                
                {/* Playlist Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">{playlist.description}</p>
                    </div>
                    {playlist.isPrivate && (
                      <FiLock className="text-gray-400 mt-1" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{playlist.videosCount} videos</span>
                    <span>•</span>
                    <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/playlist/${playlist._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View
                  </Link>
                  {channelOwner && (
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl text-gray-300 mx-auto mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
          <p className="text-gray-600 mb-6">
            {channelOwner 
              ? "You haven't created any playlists yet."
              : "This channel hasn't created any playlists yet."
            }
          </p>
          {channelOwner && (
            <button className="btn-primary flex items-center space-x-2 mx-auto">
              <FiPlus />
              <span>Create your first playlist</span>
            </button>
          )}
        </div>
      )}

      {/* Playlist Stats */}
      {sortedPlaylists.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Playlist Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{sortedPlaylists.length}</div>
              <div className="text-sm text-gray-600">Playlists</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {sortedPlaylists.reduce((sum, pl) => sum + pl.videosCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Videos</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {sortedPlaylists.filter(pl => pl.isPrivate).length}
              </div>
              <div className="text-sm text-gray-600">Private</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">
                {sortedPlaylists.length > 0 
                  ? Math.floor(sortedPlaylists.reduce((sum, pl) => sum + pl.videosCount, 0) / sortedPlaylists.length)
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600">Avg Videos/Playlist</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPlaylists;