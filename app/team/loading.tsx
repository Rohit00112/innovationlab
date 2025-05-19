import React from 'react';

export default function TeamLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero section skeleton */}
      <div className="relative min-h-[70vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#21409A] to-[#0066FF]">
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
      
      {/* Team members section skeleton */}
      <div className="py-20 bg-white">
        <div className="container">
          {/* Section title skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 max-w-xl mx-auto animate-pulse"></div>
          </div>
          
          {/* Category tabs skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full w-36 animate-pulse"></div>
            ))}
          </div>
          
          {/* Team members grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Member image skeleton */}
                <div className="relative h-64 bg-gray-200 animate-pulse"></div>
                
                {/* Member info skeleton */}
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-6 animate-pulse"></div>
                  
                  {/* Social links skeleton */}
                  <div className="flex gap-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section skeleton */}
      <div className="py-20 bg-gray-50">
        <div className="container">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto mb-8 animate-pulse"></div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="h-12 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Testimonials skeleton */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 animate-pulse"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
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
