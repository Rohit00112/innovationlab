import React from 'react';

export default function ProgramDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative pt-20 bg-gradient-to-b from-[#0066FF]/80 to-[#21409A]/90">
        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Title skeleton */}
            <div className="h-12 bg-white/20 rounded-lg w-3/4 mb-4 animate-pulse"></div>
            
            {/* Tagline skeleton */}
            <div className="h-8 bg-white/20 rounded-lg w-1/2 mb-4 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="h-4 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-5/6 mb-8 animate-pulse"></div>
            
            {/* Buttons skeleton */}
            <div className="flex flex-wrap gap-4">
              <div className="h-12 bg-white/20 rounded-lg w-36 animate-pulse"></div>
              <div className="h-12 bg-white/20 rounded-lg w-36 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Program quick info skeleton */}
        <div className="bg-white py-6 shadow-md relative z-10">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation Skeleton */}
      <div className="sticky top-20 bg-white shadow-sm z-30">
        <div className="container">
          <div className="flex overflow-x-auto py-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab Content Skeleton */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Section title skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6 animate-pulse"></div>
            
            {/* Content skeleton */}
            <div className="space-y-4 mb-12">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
            
            {/* Benefits section skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            {/* Eligibility box skeleton */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-8">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 mt-1 flex-shrink-0 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CTA box skeleton */}
            <div className="bg-gradient-to-br from-[#0066FF] to-[#5045E8] rounded-xl p-6 shadow-lg">
              <div className="h-6 bg-white/20 rounded w-40 mb-4 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-5/6 mb-6 animate-pulse"></div>
              <div className="h-10 bg-white/20 rounded-lg w-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Related Programs Skeleton */}
        <div className="mt-16">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
