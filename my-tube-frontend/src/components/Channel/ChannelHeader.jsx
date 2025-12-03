import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiBell, 
  FiShare2, 
  FiMessageSquare,
  FiVideo,
  FiUsers,
  FiGlobe
} from 'react-icons/fi';
import { MdSubscriptions } from 'react-icons/md';

const ChannelHeader = ({ channel, isSubscribed, onSubscribe, onShare }) => {
  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiGlobe className="text-white text-4xl opacity-50" />
          </div>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{channel.fullName}</h1>
                  <p className="text-gray-600 mb-2">@{channel.username}</p>
                  
                  <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MdSubscriptions />
                      <span className="font-semibold">{channel.subscribersCount?.toLocaleString() || 0}</span>
                      <span>subscribers</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <FiVideo />
                      <span className="font-semibold">{channel.videosCount?.toLocaleString() || 0}</span>
                      <span>videos</span>
                    </div>
                    
                    {channel.channelsSubscribedToCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <FiUsers />
                        <span className="font-semibold">{channel.channelsSubscribedToCount}</span>
                        <span>subscribed</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Channel Stats */}
                {channel.totalViews > 0 && (
                  <div className="mt-4 md:mt-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{channel.totalViews?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">total views</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Channel Description */}
              {channel.description && (
                <div className="mb-4">
                  <p className="text-gray-700">{channel.description}</p>
                </div>
              )}
              
              {/* Channel Links */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-full font-semibold flex items-center space-x-2 ${
                    isSubscribed
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isSubscribed ? (
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
                
                <button
                  onClick={handleShare}
                  className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FiShare2 />
                  <span>Share</span>
                </button>
                
                <button className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center space-x-2">
                  <FiMessageSquare />
                  <span>Message</span>
                </button>
                
                {/* Custom Channel Links */}
                {channel.links && channel.links.length > 0 && (
                  <div className="w-full mt-4">
                    <h4 className="font-medium mb-2">Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {channel.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-sm"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;