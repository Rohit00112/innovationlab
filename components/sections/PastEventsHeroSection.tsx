"use client";

import React from 'react';
// Removed unused import
// import Image from 'next/image';

const PastEventsHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#21409A] to-[#0066FF] z-0"></div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full bg-[#5045E8]/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-[5%] w-48 h-48 rounded-full bg-[#0066FF]/30 blur-3xl"></div>

      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/circuit-pattern.svg')] bg-repeat opacity-10 z-0"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-title">
            Past Events Archive
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 animate-subtitle">
            Explore our previous events, access recordings, presentations, and resources from our past innovation gatherings.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-subtitle">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-2">50+</h3>
              <p className="text-white/80">Events Hosted</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-2">5,000+</h3>
              <p className="text-white/80">Attendees</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-2">20+</h3>
              <p className="text-white/80">Countries Represented</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white">
          <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default PastEventsHeroSection;
