import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  FiThumbsUp, 
  FiThumbsDown, 
  FiShare2, 
  FiSave,
  FiFlag,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiMaximize,
  FiSettings
} from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';

import { toast } from 'react-toastify';

const VideoPlayer = ({ video, isLiked, onLikeToggle }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleSeekChange = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    playerRef.current.seekTo(newPlayed);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleLike = async () => {
    try {
      await likeVideo(video._id);
      onLikeToggle(!isLiked);
      toast.success(isLiked ? 'Video unliked' : 'Video liked');
    } catch (error) {
      toast.error('Failed to like video');
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds();
    
    if (hh > 0) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    }
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(controlsTimeout.current);
    };
  }, []);

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (playing) {
          clearTimeout(controlsTimeout.current);
          controlsTimeout.current = setTimeout(() => {
            setShowControls(false);
          }, 1000);
        }
      }}
    >
      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={video.videoFile}
        playing={playing}
        volume={volume}
        muted={muted}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        style={{ aspectRatio: '16/9' }}
      />

      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-2">
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onChange={handleSeekChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(played * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-gray-300"
              >
                {playing ? <FiPause size={24} /> : <FiPlay size={24} />}
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-white hover:text-gray-300"
                >
                  {muted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-gray-300">
                <FiSettings size={20} />
              </button>
              <button 
                className="text-white hover:text-gray-300"
                onClick={() => setFullscreen(!fullscreen)}
              >
                <FiMaximize size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isLiked 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FiThumbsUp />
            <span>{video.likesCount || 0}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <FiThumbsDown />
            <span>Dislike</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <FiShare2 />
            <span>Share</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <FiSave />
            <span>Save</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiFlag />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <BsThreeDots />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;