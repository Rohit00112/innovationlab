import React from 'react';

export default function PastEventsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero section skeleton */}
      <div className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#21409A] to-[#0066FF]">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title skeleton */}
            <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="h-4 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-5/6 mx-auto mb-8 animate-pulse"></div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
                  <div className="h-8 bg-white/20 rounded w-16 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded w-24 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Archive section skeleton */}
      <div className="py-20 bg-white">
        <div className="container">
          {/* Section title skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 max-w-xl mx-auto animate-pulse"></div>
          </div>
          
          {/* Search bar skeleton */}
          <div className="max-w-md mx-auto mb-8">
            <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
          </div>
          
          {/* Filters skeleton */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
            {/* Year filter skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Category filter skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-full w-28 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Events grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="event-card">
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  {/* Image skeleton */}
                  <div className="relative h-48 bg-gray-200 animate-pulse"></div>
                  
                  {/* Content skeleton */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-6 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                      <div className="h-14 w-14 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-4/5 mb-4 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Resources badges skeleton */}
                <div className="flex gap-2 mt-3 px-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Highlights section skeleton */}
      <div className="py-20 bg-gray-50">
        <div className="container">
          {/* Section title skeleton */}
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 max-w-xl mx-auto animate-pulse"></div>
          </div>
          
          {/* Highlights skeleton */}
          <div className="space-y-20">
            {[1, 2].map((i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image skeleton */}
                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-gray-200 animate-pulse"></div>
                
                {/* Content skeleton */}
                <div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-6 animate-pulse"></div>
                  
                  {/* Testimonial skeleton */}
                  <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 mb-4 animate-pulse"></div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="ml-3">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Newsletter section skeleton */}
      <div className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-8 animate-pulse"></div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="h-12 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
