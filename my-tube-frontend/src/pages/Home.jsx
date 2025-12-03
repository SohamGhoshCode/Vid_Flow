import React, { useState, useEffect } from 'react';
import VideoCard from '../components/Video/VideoCard';
import Sidebar from '../components/Common/Sidebar';
import { getAllVideos } from '../services/api';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThreeDots } from 'react-loader-spinner';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchVideos = async (pageNum = 1) => {
    try {
      const response = await getAllVideos({
        page: pageNum,
        limit: 12
      });
      
      if (pageNum === 1) {
        setVideos(response.data.data.docs);
      } else {
        setVideos(prev => [...prev, ...response.data.data.docs]);
      }
      
      setHasMore(response.data.data.hasNextPage);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDots color="#3B82F6" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
          
          <InfiniteScroll
            dataLength={videos.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-4">
                <ThreeDots color="#3B82F6" height={30} width={30} />
              </div>
            }
            endMessage={
              <p className="text-center text-gray-500 py-4">
                No more videos to load
              </p>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </InfiniteScroll>
          
          {videos.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;