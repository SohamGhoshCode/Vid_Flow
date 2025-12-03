import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChannelProfile, toggleSubscription } from '../services/api';
import VideoCard from '../components/Video/VideoCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Loader } from '../components/Common/Loader';
import { 
  FiUser, 
  FiVideo, 
  FiUsers, 
  FiPlayCircle,
  FiBell,
  FiShare2,
  FiMessageSquare,
  FiGrid,
  FiList
} from 'react-icons/fi';

const Channel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      const response = await getChannelProfile(username);
      setChannel(response.data.data);
      // Mock videos for now
      setVideos([
        { _id: '1', title: 'Video 1', thumbnail: 'https://via.placeholder.com/300x200', views: 1000, owner: response.data.data, createdAt: new Date(), duration: 120 },
        { _id: '2', title: 'Video 2', thumbnail: 'https://via.placeholder.com/300x200', views: 2000, owner: response.data.data, createdAt: new Date(), duration: 180 },
        { _id: '3', title: 'Video 3', thumbnail: 'https://via.placeholder.com/300x200', views: 3000, owner: response.data.data, createdAt: new Date(), duration: 240 },
        { _id: '4', title: 'Video 4', thumbnail: 'https://via.placeholder.com/300x200', views: 4000, owner: response.data.data, createdAt: new Date(), duration: 300 },
      ]);
      // Mock playlists
      setPlaylists([
        { _id: '1', name: 'Tutorial Series', description: 'Learn web development', videosCount: 10 },
        { _id: '2', name: 'Music Videos', description: 'My favorite music', videosCount: 5 },
      ]);
    } catch (error) {
      toast.error('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }
    
    try {
      await toggleSubscription(channel._id);
      setChannel(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
      }));
      toast.success(channel.isSubscribed ? 'Unsubscribed' : 'Subscribed');
    } catch (error) {
      toast.error('Failed to subscribe');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Channel not found</h2>
        <p className="text-gray-600">The channel you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Channel Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
          {channel.coverImage && (
            <img
              src={channel.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Channel Info */}
        <div className="container mx-auto px-4 -mt-12 relative">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={channel.avatar}
                  alt={channel.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              
              {/* Channel Details */}
              <div className="flex-1 md:ml-6">
                <h1 className="text-3xl font-bold mb-2">{channel.fullName}</h1>
                <p className="text-gray-600 mb-4">@{channel.username}</p>
                
                <div className="flex flex-wrap items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <FiUsers className="text-gray-500" />
                    <span className="font-semibold">{channel.subscribersCount?.toLocaleString() || 0}</span>
                    <span className="text-gray-600">subscribers</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FiVideo className="text-gray-500" />
                    <span className="font-semibold">{videos.length}</span>
                    <span className="text-gray-600">videos</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSubscribe}
                    className={`px-6 py-2 rounded-full font-semibold flex items-center space-x-2 ${
                      channel.isSubscribed
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {channel.isSubscribed ? (
                      <>
                        <FiBell />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <FiUser />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                  
                  <button className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center space-x-2">
                    <FiShare2 />
                    <span>Share</span>
                  </button>
                  
                  <button className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center space-x-2">
                    <FiMessageSquare />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Channel Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <div className="border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiPlayCircle />
                <span>VIDEOS</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('playlists')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'playlists'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiGrid />
                <span>PLAYLISTS</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('about')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiUser />
                <span>ABOUT</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'videos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Uploads</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FiGrid />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FiList />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'playlists' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Playlists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map(playlist => (
                  <div key={playlist._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
                      <p className="text-gray-600 mb-4">{playlist.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{playlist.videosCount} videos</span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View Playlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold mb-6">About</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">
                    Welcome to my channel! I create videos about web development, programming tutorials,
                    and tech reviews. Subscribe to stay updated with the latest content.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{channel.subscribersCount?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-600">Subscribers</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{videos.length}</div>
                      <div className="text-sm text-gray-600">Videos</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{(channel.subscribersCount * 100)?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">1 week</div>
                      <div className="text-sm text-gray-600">Joined</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Links</h3>
                  <div className="space-y-2">
                    <a href="#" className="text-blue-600 hover:underline block">Website</a>
                    <a href="#" className="text-blue-600 hover:underline block">Twitter</a>
                    <a href="#" className="text-blue-600 hover:underline block">GitHub</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;