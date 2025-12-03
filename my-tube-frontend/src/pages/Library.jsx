import React, { useState, useEffect } from "react";
import VideoCard from "../components/Video/VideoCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { getWatchHistory } from "../services/api";
import { ThreeDots } from "react-loader-spinner";
import Sidebar from "../components/Common/Sidebar";

const Library = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const fetchWatchHistory = async () => {
    try {
      setLoading(true);
      const response = await getWatchHistory();
      setVideos(response.data.data);
    } catch (error) {
      toast.error("Failed to load watch history");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Please login to view your library</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Library</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <ThreeDots color="#3B82F6" height={50} width={50} />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos in your watch history</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;