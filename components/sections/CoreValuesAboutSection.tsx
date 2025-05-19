"use client";

import React from 'react';
import Image from 'next/image';

// Import JSON data
import coreValuesData from '@/data/sections/home/coreValues.json';

const CoreValuesAboutSection: React.FC = () => {
  // Use values data from JSON
  const values = coreValuesData.values;

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-[0.03]"></div>

      {/* Decorative elements removed */}

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block px-5 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-5 shadow-sm section-title animate-heading">
            {coreValuesData.leftContent.badge.text}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 section-title animate-heading">
            {coreValuesData.leftContent.title.text}
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 section-description animate-text">
            {coreValuesData.leftContent.description.text}
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl flex flex-col h-full animate-card"
              data-index={index}
            >
              {/* Card Header with Icon */}
              <div className={`${value.bgColor} p-8 flex items-center justify-center relative h-28`}>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 -ml-6 -mb-6"></div>

                {/* Icon container */}
                <div className="icon-container w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg z-10">
                  <svg width="40" height="40" viewBox={value.icon.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {value.icon.paths.map((path, pathIndex) => (
                      <path
                        key={pathIndex}
                        d={path.d}
                        stroke="white"
                        strokeWidth={path.strokeWidth}
                        strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                        strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-[#0066FF]">
                  {value.title}
                </h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed flex-grow">
                  {value.description}
                </p>

                {/* Visual indicator */}
                <div className="w-12 h-1 bg-gray-200 rounded-full group-hover:bg-[#0066FF] transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Innovation approach highlight box */}
        <div className="mt-20 bg-gradient-to-r from-[#0066FF]/5 to-[#5045E8]/5 rounded-2xl p-8 md:p-10 shadow-lg border border-[#0066FF]/10 relative overflow-hidden animate-text">
          {/* Decorative elements removed */}

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#0066FF] to-[#5045E8] flex items-center justify-center shadow-xl decorative-element">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 animate-heading">
                Our Value-Driven Approach
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 animate-text">
                At the Innovation Lab, we integrate these core values into every aspect of our work.
                Our approach combines technical excellence with ethical considerations, ensuring that
                our innovations contribute positively to society while preparing students for leadership roles.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Innovation', 'Collaboration', 'Leadership', 'Inclusivity'].map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-white rounded-full text-[#0066FF] font-medium shadow-sm animate-card">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValuesAboutSection;
