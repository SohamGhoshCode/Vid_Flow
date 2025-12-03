import React, { useState, useEffect } from "react";
import VideoCard from "../components/Video/VideoCard";
import Sidebar from "../components/Common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { getSubscribedChannels, getAllVideos } from "../services/api";
import { ThreeDots } from "react-loader-spinner";

const Subscriptions = () => {
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const channelsResponse = await getSubscribedChannels(user._id);
      setChannels(channelsResponse.data.data.subscriptions);
      
      // Get videos from subscribed channels
      const videosResponse = await getAllVideos({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc'
      });
      setVideos(videosResponse.data.data.docs);
    } catch (error) {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Please login to view subscriptions</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
          
          {/* Channels */}
          {channels.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Your Channels</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {channels.map(channel => (
                  <div key={channel.channel._id} className="text-center">
                    <img
                      src={channel.channel.avatar}
                      alt={channel.channel.username}
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                    />
                    <p className="text-sm font-medium truncate">
                      {channel.channel.fullName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Latest Videos */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <ThreeDots color="#3B82F6" height={50} width={50} />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos from your subscriptions</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">Latest from subscriptions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map(video => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;