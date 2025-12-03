import React, { useState, useEffect } from 'react';
import VideoCard from '../components/Video/VideoCard';

import { toast } from 'react-toastify';
import { Loader } from '../components/Common/Loader';
import { FiTrendingUp, FiFilter, FiGrid, FiList } from 'react-icons/fi';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');
  const [view, setView] = useState('grid');

  useEffect(() => {
    fetchTrendingVideos();
  }, [filter]);

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      const response = await getAllVideos({
        sortBy: 'views',
        sortType: 'desc',
        limit: 20
      });
      setVideos(response.data.data.docs);
    } catch (error) {
      toast.error('Failed to load trending videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FiTrendingUp className="text-3xl text-red-600" />
          <h1 className="text-3xl font-bold">Trending</h1>
        </div>
        <p className="text-gray-600">The most popular videos on MyTube right now</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['today', 'this week', 'this month', 'all time'].map((time) => (
              <button
                key={time}
                onClick={() => setFilter(time)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  filter === time
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <FiList />
              </button>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiFilter />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Videos */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <div key={video._id} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg">
              <div className="relative flex-shrink-0">
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </span>
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
                <p className="text-gray-700 line-clamp-2">{video.description}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Watch
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    Save
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="text-center py-12">
          <FiTrendingUp className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No trending videos</h3>
          <p className="text-gray-600">Check back later for trending content</p>
        </div>
      )}
    </div>
  );
};

export default Trending;