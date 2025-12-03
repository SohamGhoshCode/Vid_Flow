import React, { useState, useEffect } from 'react';
import { getChannelStats, getChannelVideos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Loader } from '../components/Common/Loader';
import { 
  FiEye, 
  FiUsers, 
  FiVideo, 
  FiThumbsUp,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiMoreVertical
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, videosRes] = await Promise.all([
        getChannelStats(),
        getChannelVideos()
      ]);
      
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      // Implement delete functionality
      toast.success('Video deleted');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Creator Studio</h1>
          <p className="text-gray-600">Manage your channel and track performance</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiEye className="text-2xl text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+12%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{formatNumber(stats?.totalViews || 0)}</h3>
            <p className="text-gray-600">Total Views</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="text-2xl text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+5%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{formatNumber(stats?.totalSubscribers || 0)}</h3>
            <p className="text-gray-600">Subscribers</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiVideo className="text-2xl text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{formatNumber(stats?.totalVideos || 0)}</h3>
            <p className="text-gray-600">Videos</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiThumbsUp className="text-2xl text-red-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+8%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{formatNumber(stats?.totalLikes || 0)}</h3>
            <p className="text-gray-600">Total Likes</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'overview'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'content'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'analytics'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-4 border-b-2 font-medium ${
                  activeTab === 'earnings'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Earnings
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Chart Placeholder */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Views (Last 7 days)</h4>
                      <FiBarChart2 className="text-gray-500" />
                    </div>
                    <div className="h-48 flex items-end space-x-2">
                      {[40, 60, 80, 60, 40, 70, 90].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-blue-500 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Videos */}
                  <div>
                    <h4 className="font-semibold mb-4">Recent Videos</h4>
                    <div className="space-y-4">
                      {videos.slice(0, 3).map(video => (
                        <div key={video._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium line-clamp-1">{video.title}</h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{video.views} views</span>
                              <span>{video.likesCount} likes</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Your Videos</h3>
                  <button className="btn-primary">
                    + Upload Video
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Video</th>
                        <th className="text-left py-3 px-4">Visibility</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Likes</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map(video => (
                        <tr key={video._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-16 h-9 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-medium line-clamp-1">{video.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-1">{video.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              video.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {video.isPublished ? 'Public' : 'Private'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{video.views?.toLocaleString()}</td>
                          <td className="py-3 px-4">{video.likesCount || 0}</td>
                          <td className="py-3 px-4">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <FiEdit2 />
                              </button>
                              <button 
                                onClick={() => handleDeleteVideo(video._id)}
                                className="p-1 hover:bg-gray-100 rounded text-red-600"
                              >
                                <FiTrash2 />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <FiMoreVertical />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Detailed Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Watch Time</h4>
                    <p className="text-3xl font-bold">1,234 hrs</p>
                    <p className="text-sm text-green-600 mt-2">+15% from last month</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Average View Duration</h4>
                    <p className="text-3xl font-bold">4:32</p>
                    <p className="text-sm text-green-600 mt-2">+2% from last month</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Impressions</h4>
                    <p className="text-3xl font-bold">45.6K</p>
                    <p className="text-sm text-red-600 mt-2">-3% from last month</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Earnings Overview</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FiDollarSign className="text-5xl text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Monetization</h4>
                  <p className="text-gray-600 mb-6">Your channel needs 1,000 subscribers and 4,000 watch hours to enable monetization.</p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                      <div className="text-sm text-gray-600">Current Subscribers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.floor((stats?.totalViews || 0) / 60)}</div>
                      <div className="text-sm text-gray-600">Watch Hours</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;