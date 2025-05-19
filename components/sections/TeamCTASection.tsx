"use client";

import React from 'react';
import Link from 'next/link';

const TeamCTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0066FF]/10 to-[#5045E8]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0066FF]/10 to-[#5045E8]/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Gradient border */}
          <div className="absolute inset-0 border-4 border-transparent rounded-2xl bg-origin-border bg-clip-border bg-gradient-to-r from-[#0066FF] to-[#5045E8] opacity-20"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#0066FF]/10 to-[#5045E8]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-[#0066FF]/10 to-[#5045E8]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 animate-cta">
              Join Our Team
            </h2>
            <p className="text-lg text-gray-700 mb-8 animate-cta">
              We're always looking for talented individuals who are passionate about innovation and technology. Check out our current openings or send us your resume.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-cta">
              <Link 
                href="/careers" 
                className="px-8 py-3 bg-gradient-to-r from-[#0066FF] to-[#5045E8] text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
              >
                View Openings
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md animate-cta">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                  alt="Sarah J." 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sarah J.</h3>
                <p className="text-sm text-gray-600">Program Manager, 3 years</p>
              </div>
            </div>
            <blockquote className="text-gray-700 italic">
              "Working at Innovation Lab has been the most rewarding experience of my career. The collaborative environment and opportunity to work with cutting-edge technologies and brilliant minds has helped me grow both professionally and personally."
            </blockquote>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md animate-cta">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                  alt="Michael T." 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Michael T.</h3>
                <p className="text-sm text-gray-600">Tech Lead, 2 years</p>
              </div>
            </div>
            <blockquote className="text-gray-700 italic">
              "The culture at Innovation Lab is unlike anywhere else I've worked. There's a genuine commitment to innovation, continuous learning, and making a positive impact. Every day brings new challenges and opportunities to create something meaningful."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCTASection;
