"use client";

import React, { useRef, forwardRef, RefObject } from 'react';
import Link from 'next/link';
import ProgramCard from '../ui/ProgramCard';
import { useCardAnimation } from '@/hooks/useGSAPAnimations';

const ProgramsSection = forwardRef<HTMLDivElement>((_, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Use the card animation hook
  useCardAnimation(sectionRef as RefObject<HTMLElement>);

  const programs = [
    {
      title: 'Startup Accelerator',
      description: 'A 12-week program designed to help early-stage startups develop their ideas into viable businesses through mentorship, workshops, and networking.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/startup-accelerator',
    },
    {
      title: 'Research Lab',
      description: 'Access cutting-edge technology and collaborate with experts to develop innovative solutions to complex problems in various domains.',
      imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/research-lab',
    },
    {
      title: 'Student Innovation',
      description: 'Empowering students to develop their entrepreneurial skills and innovative ideas through workshops, mentorship, and hands-on projects.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      link: '/programs/student-innovation',
    },
    {
      title: 'Corporate Innovation',
      description: 'Helping established companies foster a culture of innovation and develop new products, services, and business models.',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/corporate-innovation',
    },
  ];

  return (
    <section
      ref={(node) => {
        // Assign to both refs
        sectionRef.current = node as HTMLDivElement | null;
        if (typeof ref === 'function') {
          ref(node as HTMLDivElement | null);
        } else if (ref) {
          ref.current = node as HTMLDivElement | null;
        }
      }}
      className="py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden"
      id="programs-section"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-3"></div>

      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16">
          <div className="max-w-xl mb-6 md:mb-0">
            <h2 className="section-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 relative">
              Our Programs
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-full"></span>
            </h2>
            <p className="section-description text-base md:text-lg text-gray-700 leading-relaxed">
              Discover our specialized programs designed to accelerate innovation across different domains and stages.
            </p>
          </div>
          <div className="view-all-programs-wrapper relative">
            <Link
              href="/programs"
              className="text-sm md:text-base text-[#0066FF] hover:underline flex items-center group transition-all duration-300"
              prefetch={true}
              passHref={true}
              aria-label="View all programs"
              onClick={() => {
                // Ensure the link works by navigating directly
                window.location.href = '/programs';
              }}
            >
              <span>View All Programs</span>
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            {/* Removed fallback direct link to fix ESLint error */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {programs.map((program, index) => (
            <div key={index} className="card-item opacity-0">
              <ProgramCard
                title={program.title}
                description={program.description}
                imageUrl={program.imageUrl}
                link={program.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ProgramsSection.displayName = 'ProgramsSection';

export default ProgramsSection;
