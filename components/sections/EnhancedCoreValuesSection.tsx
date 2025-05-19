"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EnhancedCoreValuesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  // Core values data
  const coreValues = [
    {
      title: 'Innovation',
      description: 'We encourage original thinking and support the development of creative solutions to real-world challenges.',
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 12L11 13.5L14.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-[#0066FF]',
      hoverColor: 'group-hover:bg-[#0052CC]',
      link: '/values/innovation',
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and foster partnerships among students, faculty, and industry to drive collective growth.',
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-[#5045E8]',
      hoverColor: 'group-hover:bg-[#4035D8]',
      link: '/values/collaboration',
    },
    {
      title: 'Leadership',
      description: 'We nurture confident, responsible individuals who take initiative, inspire others, and lead with integrity.',
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-[#EEAE22]',
      hoverColor: 'group-hover:bg-[#D99E1F]',
      link: '/values/leadership',
    },
    {
      title: 'Inclusivity',
      description: 'We embrace diversity and ensure equal opportunities for all, creating a respectful and supportive learning environment.',
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-[#00C853]',
      hoverColor: 'group-hover:bg-[#00B548]',
      link: '/values/inclusivity',
    },
    {
      title: 'Social Responsibility',
      description: 'We are committed to making a positive impact on society through ethical practices and community engagement.',
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bgColor: 'bg-[#FF6B6B]',
      hoverColor: 'group-hover:bg-[#EE5253]',
      link: '/values/social-responsibility',
    },
  ];

  // Set up animations
  useEffect(() => {
    if (!sectionRef.current || !valuesRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create a timeline for the section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
      },
    });

    // Animate section title and description
    tl.fromTo(
      '.values-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    ).fromTo(
      '.values-description',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    ).fromTo(
      '.values-approach',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    );

    // Animate value cards with staggered effect
    if (!prefersReducedMotion) {
      const cards = valuesRef.current.querySelectorAll('.value-card');
      tl.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2, // 0.2s delay between each card animation
          ease: 'back.out(1.2)',
        },
        '-=0.4'
      );
    } else {
      // Simple fade-in for reduced motion preference
      const cards = valuesRef.current.querySelectorAll('.value-card');
      tl.to(cards, { opacity: 1, duration: 0.5 });
    }

    // Clean up
    return () => {
      if (tl) tl.kill();
      let triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative overflow-hidden"
      id="core-values-section"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-[0.05]"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#0066FF]/5 to-[#5045E8]/5 blur-3xl decorative-element"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-to-r from-[#EEAE22]/5 to-[#F5C462]/5 blur-3xl decorative-element"></div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Left content */}
          <div className="w-full md:w-[330px] flex flex-col">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4 values-title">Our Principles</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 relative values-title">
              Our Core Values
              <span className="absolute -bottom-3 left-0 w-24 h-1 bg-[#EEAE22]"></span>
            </h2>
            <p className="text-base text-gray-700 mb-8 values-description">
              The principles that guide our work and shape our community, driving innovation and positive impact.
            </p>

            {/* Innovation Card */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 values-approach">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 12L11 13.5L14.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Innovation</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                We encourage original thinking and support the development of creative solutions to real-world challenges.
              </p>
            </div>
          </div>

          {/* Right content - Value cards */}
          <div
            ref={valuesRef}
            className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl value-card group"
                data-index={index}
              >
                {/* Card Header with Icon */}
                <div className={`${value.bgColor} ${value.hoverColor} p-4 flex items-center justify-center transition-colors duration-300`}>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    {value.icon}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCoreValuesSection;
