"use client";

import React from 'react';
import Link from 'next/link';

const ProgramsCTASection: React.FC = () => {
  return (
    <section className="py-20 md:py-24 bg-gray-50 relative overflow-hidden" id="contact">
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
              Ready to Join Our Innovation Community?
            </h2>
            <p className="text-lg text-gray-700 mb-8 animate-cta">
              Whether you&apos;re a student, entrepreneur, researcher, or corporate innovator, we have programs designed to help you succeed. Get in touch with us to learn more about our programs and how we can support your innovation journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-cta">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-[#0066FF] to-[#5045E8] text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
              >
                Contact Us
              </Link>
              <Link
                href="/events"
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-md text-center animate-cta">
            <div className="w-16 h-16 bg-[#0066FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Innovators Supported</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center animate-cta">
            <div className="w-16 h-16 bg-[#0066FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600">Successful Startups</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center animate-cta">
            <div className="w-16 h-16 bg-[#0066FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">87%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsCTASection;
