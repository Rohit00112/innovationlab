"use client";

import React, { useRef, useEffect } from 'react';
import HeroSection from '../sections/HeroSection';
import MissionVisionSection from '../sections/MissionVisionSection';
// Removed unused import
// import ProgramsSection from '../sections/ProgramsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CoreValuesSection from '../sections/CoreValuesSection';
import { useHoverAnimations } from '@/hooks/useGSAPAnimations';

const HomePage: React.FC = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const missionVisionRef = useRef<HTMLDivElement>(null);
  // Commented out unused ref
  // const programsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const coreValuesRef = useRef<HTMLDivElement>(null);

  // Use global hover animations
  useHoverAnimations();

  // Smooth scroll to section when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Smooth scroll to the element
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Make sure links work properly
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      // Remove any existing click event listeners that might interfere with navigation
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <main className="overflow-hidden">
      <HeroSection ref={heroRef} />
      <MissionVisionSection ref={missionVisionRef} />
      {/* <ProgramsSection ref={programsRef} /> */}
      <UpcomingEventsSection ref={eventsRef} />
      <TestimonialsSection ref={testimonialsRef} />
      <CoreValuesSection ref={coreValuesRef} />
    </main>
  );
};

export default HomePage;
