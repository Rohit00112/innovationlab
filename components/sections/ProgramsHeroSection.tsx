"use client";

import React from 'react';
import Image from 'next/image';

const ProgramsHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#21409A] to-[#0066FF] z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full bg-[#5045E8]/20 blur-3xl animate-decoration"></div>
      <div className="absolute bottom-1/4 left-[5%] w-48 h-48 rounded-full bg-[#0066FF]/30 blur-3xl animate-decoration"></div>
      
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/circuit-pattern.svg')] bg-repeat opacity-10 z-0"></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-white/20 animate-float-slow animate-decoration"></div>
      <div className="absolute top-2/3 right-1/3 w-4 h-4 rounded-full bg-white/30 animate-float-medium animate-decoration"></div>
      <div className="absolute bottom-1/4 left-1/2 w-8 h-8 rounded-full bg-[#5045E8]/30 animate-float-fast animate-decoration"></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-title">
              Innovation Lab <br />
              <span className="text-white/90">Programs</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-xl animate-subtitle">
              Discover our specialized programs designed to accelerate innovation across different domains and stages.
            </p>
            <div className="flex flex-wrap gap-4 animate-subtitle">
              <a 
                href="#programs-grid" 
                className="px-8 py-3 bg-white text-[#0066FF] font-medium rounded-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                Explore Programs
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 bg-transparent border-2 border-white/70 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl animate-decoration">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Innovation Lab Programs"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0066FF]/50 to-transparent"></div>
            
            {/* Floating stats */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-600">Our Impact</p>
              <p className="text-2xl font-bold text-[#0066FF]">500+ Innovators</p>
            </div>
            
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-[#0066FF]">87%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsHeroSection;
