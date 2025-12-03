import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getChannelStats, 
  getChannelVideos 
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
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
  FiMoreVertical,
  FiUpload,
  FiSettings,
  FiBell
} from 'react-icons/fi';

// Import StatsCard components
import {
  ViewsStatsCard,
  SubscribersStatsCard,
  VideosStatsCard,
  EarningsStatsCard,
  WatchTimeStatsCard,
  EngagementStatsCard
} from './StatsCard';

import VideoTable from './VideoTable';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleVideoAction = (action, videoId) => {
    switch (action) {
      case 'edit':
        navigate(`/edit/${videoId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this video?')) {
          // Implement delete
          toast.success('Video deleted');
        }
        break;
      case 'analytics':
        navigate(`/analytics/${videoId}`);
        break;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Sign in to access dashboard</h2>
        <button
          onClick={() => navigate('/login')}
          className="btn-primary"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Creator Studio</h1>
              <p className="text-gray-600">Manage your channel and track performance</p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleUploadClick}
                className="btn-primary flex items-center space-x-2"
              >
                <FiUpload />
                <span>Upload Video</span>
              </button>
              
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FiSettings />
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ViewsStatsCard 
            value={stats?.totalViews || 0} 
            change={12} 
            isLoading={loading}
          />
          
          <SubscribersStatsCard 
            value={stats?.totalSubscribers || 0} 
            change={5} 
            isLoading={loading}
          />
          
          <VideosStatsCard 
            value={stats?.totalVideos || 0} 
            change={2} 
            isLoading={loading}
          />
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === 'earnings'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === 'comments'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Comments
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
                    <div className="flex justify-between mt-4 text-sm text-gray-600">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Videos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Recent Videos</h4>
                      <button 
                        onClick={() => setActiveTab('content')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View All
                      </button>
                    </div>
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
                              <span>{video.likesCount || 0} likes</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(video.createdAt).toLocaleDateString()}
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
                  <h3 className="text-lg font-semibold">Your Videos ({videos.length})</h3>
                  <button 
                    onClick={handleUploadClick}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FiUpload />
                    <span>Upload Video</span>
                  </button>
                </div>
                
                <VideoTable 
                  videos={videos} 
                  onAction={handleVideoAction}
                  loading={loading}
                />
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Detailed Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <WatchTimeStatsCard 
                    value={1234} 
                    change={15} 
                    isLoading={loading}
                  />
                  
                  <EngagementStatsCard 
                    value={4.2} 
                    change={2} 
                    isLoading={loading}
                  />
                  
                  <EarningsStatsCard 
                    value={0} 
                    change={0} 
                    isLoading={loading}
                  />
                </div>
                
                {/* Advanced Analytics */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Audience Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Top Country</div>
                      <div className="font-semibold">United States</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Avg Watch Time</div>
                      <div className="font-semibold">4:32</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Impressions</div>
                      <div className="font-semibold">45.6K</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Click-through Rate</div>
                      <div className="font-semibold">8.2%</div>
                    </div>
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
                  <p className="text-gray-600 mb-6">
                    Your channel needs 1,000 subscribers and 4,000 watch hours to enable monetization.
                  </p>
                  <div className="flex justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                      <div className="text-sm text-gray-600">Current Subscribers</div>
                      <div className="text-xs text-gray-500">Goal: 1,000</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.floor((stats?.totalViews || 0) / 60)}</div>
                      <div className="text-sm text-gray-600">Watch Hours</div>
                      <div className="text-xs text-gray-500">Goal: 4,000</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min((stats?.totalSubscribers || 0) / 10, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.min((stats?.totalSubscribers || 0) / 10, 100).toFixed(1)}% to monetization
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'comments' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Recent Comments</h3>
                <div className="text-center py-12 text-gray-500">
                  <FiBell className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>No recent comments to display</p>
                  <p className="text-sm mt-2">Comments on your videos will appear here</p>
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