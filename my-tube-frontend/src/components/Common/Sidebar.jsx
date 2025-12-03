import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  PlaySquare, 
  History, 
  Clock, 
  ThumbsUp, 
  Folder,
  TrendingUp,
  Film,
  Music2,
  Gamepad2,
  Newspaper
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const mainItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: PlaySquare, label: 'Subscriptions', path: '/subscriptions' },
    { icon: Folder, label: 'Library', path: '/library' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Clock, label: 'Watch later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked videos', path: '/liked' },
  ];
  
  const exploreItems = [
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Music2, label: 'Music', path: '/music' },
    { icon: Film, label: 'Movies', path: '/movies' },
    { icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { icon: Newspaper, label: 'News', path: '/news' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto sticky top-0">
      <div className="p-4">
        {/* Main Items */}
        <div className="space-y-1 mb-6">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={22} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Explore Section */}
        <div className="mb-6">
          <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Explore
          </h3>
          <div className="space-y-1">
            {exploreItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon size={22} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Subscriptions Section */}
        <div>
          <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Subscriptions
          </h3>
          <div className="space-y-1">
            <p className="px-4 text-sm text-gray-500">
              Sign in to see your subscriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;