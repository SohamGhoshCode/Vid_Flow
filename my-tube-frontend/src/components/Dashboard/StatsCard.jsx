import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const StatsCard = ({
  title,
  value,
  change,
  icon,
  color = 'blue',
  format = 'number',
  prefix = '',
  suffix = '',
  isLoading = false
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      text: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      text: 'text-yellow-600'
    },
    indigo: {
      bg: 'bg-indigo-100',
      icon: 'text-indigo-600',
      text: 'text-indigo-600'
    },
    pink: {
      bg: 'bg-pink-100',
      icon: 'text-pink-600',
      text: 'text-pink-600'
    }
  };

  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    
    if (format === 'percentage') {
      return `${val}%`;
    }
    
    if (format === 'compact') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toString();
    }
    
    return val?.toLocaleString() || '0';
  };

  const getChangeIcon = () => {
    if (change > 0) {
      return <FiTrendingUp className="text-green-600" />;
    } else if (change < 0) {
      return <FiTrendingDown className="text-red-600" />;
    } else {
      return <FiMinus className="text-gray-600" />;
    }
  };

  const getChangeColor = () => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color].bg}`}>
          <div className={`text-xl ${colorClasses[color].icon}`}>
            {icon}
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold mb-1">
        {prefix}{formatValue(value)}{suffix}
      </h3>
      
      <p className="text-gray-600 text-sm">{title}</p>
      
      {/* Optional: Progress bar */}
      {change !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{change}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                change > 0 ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-configured stat cards for common metrics
export const ViewsStatsCard = ({ value, change, isLoading }) => (
  <StatsCard
    title="Total Views"
    value={value}
    change={change}
    icon="👁️"
    color="blue"
    format="compact"
    isLoading={isLoading}
  />
);

export const SubscribersStatsCard = ({ value, change, isLoading }) => (
  <StatsCard
    title="Subscribers"
    value={value}
    change={change}
    icon="👥"
    color="green"
    format="compact"
    isLoading={isLoading}
  />
);

export const VideosStatsCard = ({ value, change, isLoading }) => (
  <StatsCard
    title="Total Videos"
    value={value}
    change={change}
    icon="🎬"
    color="purple"
    isLoading={isLoading}
  />
);

export const EarningsStatsCard = ({ value, change, isLoading }) => (
  <StatsCard
    title="Earnings"
    value={value}
    change={change}
    icon="💰"
    color="yellow"
    format="currency"
    prefix="$"
    isLoading={isLoading}
  />
);

export const WatchTimeStatsCard = ({ value, change, isLoading }) => (
  <StatsCard
    title="Watch Time"
    value={value}
    change={change}
    icon="⏱️"
    color="indigo"
    suffix=" hours"
    isLoading={isLoading}
  />
);

export const EngagementStatsCard = ({ value, change, isLoading }) => (
  <StatsCard
    title="Engagement Rate"
    value={value}
    change={change}
    icon="📈"
    color="pink"
    format="percentage"
    isLoading={isLoading}
  />
);

export default StatsCard;