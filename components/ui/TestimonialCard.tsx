"use client";

import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white rounded-xl shadow-lg mx-auto w-full border border-gray-100 transition-all duration-500 group relative overflow-hidden h-full hover:shadow-xl">

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-[0.03] mix-blend-overlay"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#0066FF] to-[#5045E8] opacity-5 rounded-br-[4rem] transition-all duration-500 group-hover:opacity-15 group-hover:w-32 group-hover:h-32"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#EEAE22] opacity-0 rounded-tl-[2rem] transition-all duration-500 group-hover:opacity-10 group-hover:w-20 group-hover:h-20"></div>

      {/* Additional decorative element */}
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-[#5045E8] opacity-0 rounded-full transition-all duration-500 group-hover:opacity-5 blur-xl"></div>
      <div className="absolute top-1/2 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 -z-10"></div>

      {/* Person info at the top */}
      <div className="flex flex-col items-center gap-3 mb-8 justify-center relative">
        {/* Background highlight for person info */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0066FF]/5 to-transparent rounded-xl -z-10 transform -translate-y-2 scale-110"></div>

        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md transition-all duration-500 group-hover:shadow-lg group-hover:border-[#0066FF]/20 mt-2">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 80px, 80px"
            quality={90}
          />
        </div>
        <div className="text-center">
          <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#0066FF] transition-colors duration-300">{name}</h4>
          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{role}</p>
        </div>
      </div>

      {/* Divider with animation */}
      <div className="w-16 h-1 bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-full transition-all duration-500 group-hover:w-32 group-hover:shadow-sm mx-auto mb-6"></div>

      {/* Quote text */}
      <div className="relative">
        {/* Quote icon */}
        <div className="absolute -top-4 left-0 text-[#0066FF]/10 transform -translate-x-1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 16.5H6C4.75 16.5 3.75 15.5 3.75 14.25V9.75C3.75 8.5 4.75 7.5 6 7.5H8.25C9.5 7.5 10.5 8.5 10.5 9.75V16.5Z" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute -top-4 left-4 text-[#0066FF]/10 transform -translate-x-1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.25 16.5H15.75C14.5 16.5 13.5 15.5 13.5 14.25V9.75C13.5 8.5 14.5 7.5 15.75 7.5H18C19.25 7.5 20.25 8.5 20.25 9.75V16.5Z" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-gray-700 relative z-10 transition-all duration-500 group-hover:text-gray-800 text-center px-4">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
