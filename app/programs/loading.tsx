import React from 'react';

export default function ProgramsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section skeleton */}
      <div className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#21409A] to-[#0066FF]">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              {/* Title skeleton */}
              <div className="h-12 bg-white/20 rounded-lg w-3/4 mb-6 animate-pulse"></div>
              <div className="h-8 bg-white/20 rounded-lg w-1/2 mb-6 animate-pulse"></div>
              
              {/* Description skeleton */}
              <div className="h-4 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-5/6 mb-2 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-4/6 mb-8 animate-pulse"></div>
              
              {/* Buttons skeleton */}
              <div className="flex flex-wrap gap-4">
                <div className="h-12 bg-white/20 rounded-lg w-36 animate-pulse"></div>
                <div className="h-12 bg-white/20 rounded-lg w-36 animate-pulse"></div>
              </div>
            </div>
            
            {/* Image skeleton */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Programs grid skeleton */}
      <div className="py-20 md:py-24 bg-white">
        <div className="container">
          {/* Title skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 max-w-xl mx-auto animate-pulse"></div>
          </div>
          
          {/* Search bar skeleton */}
          <div className="max-w-md mx-auto mb-8">
            <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
          </div>
          
          {/* Filter buttons skeleton */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full w-28 animate-pulse"></div>
            ))}
          </div>
          
          {/* Programs grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-md">
                {/* Image skeleton */}
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                
                {/* Content skeleton */}
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mb-6 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
