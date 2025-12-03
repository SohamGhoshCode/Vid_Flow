import React from 'react';
import { Link } from 'react-router-dom';
import { BsFillPlayFill, BsThreeDotsVertical } from 'react-icons/bs';
import { AiFillEye } from 'react-icons/ai';
import moment from 'moment';

const VideoCard = ({ video }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-2">
        <Link to={`/watch/${video._id}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs">
            {formatDuration(video.duration)}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <BsFillPlayFill className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      </div>
      
      <div className="flex space-x-3">
        {video.owner?.avatar && (
          <Link to={`/channel/${video.owner?.username}`}>
            <img
              src={video.owner?.avatar}
              alt={video.owner?.username}
              className="w-10 h-10 rounded-full"
            />
          </Link>
        )}
        
        <div className="flex-1">
          <Link to={`/watch/${video._id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
              {video.title}
            </h3>
          </Link>
          
          {video.owner && (
            <Link to={`/channel/${video.owner?.username}`}>
              <p className="text-sm text-gray-600 hover:text-gray-900">
                {video.owner?.fullName || video.owner?.username}
              </p>
            </Link>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center space-x-1">
              <AiFillEye />
              <span>{(video.views || 0).toLocaleString()} views</span>
            </span>
            <span>{moment(video.createdAt).fromNow()}</span>
          </div>
        </div>
        
        <button className="self-start p-1 hover:bg-gray-100 rounded-full">
          <BsThreeDotsVertical className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;