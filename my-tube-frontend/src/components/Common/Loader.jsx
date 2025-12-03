import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <ThreeDots 
        color="#3B82F6" 
        height={80} 
        width={80} 
      />
    </div>
  );
};

export const SmallLoader = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <ThreeDots 
        color="#3B82F6" 
        height={40} 
        width={40} 
      />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <ThreeDots 
        color="#3B82F6" 
        height={100} 
        width={100} 
      />
    </div>
  );
};

export { Loader };