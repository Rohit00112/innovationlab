"use client";

import React, { useRef, useEffect, useState } from 'react';
import PastEventsHeroSection from '../sections/PastEventsHeroSection';
import PastEventsArchiveSection from '../sections/PastEventsArchiveSection';
import PastEventsHighlightsSection from '../sections/PastEventsHighlightsSection';
import EventsNewsletterSection from '../sections/EventsNewsletterSection';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PastEventsPage: React.FC = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  
  // State for active filter
  const [activeYear, setActiveYear] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Set up animations
  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        heroRef.current.querySelectorAll('.animate-title'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      )
      .fromTo(
        heroRef.current.querySelectorAll('.animate-subtitle'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
        '-=0.6'
      );
    }

    // Archive section animations
    if (archiveRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: archiveRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        archiveRef.current.querySelectorAll('.filter-item'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }

    // Highlights section animations
    if (highlightsRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: highlightsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        highlightsRef.current.querySelectorAll('.highlight-item'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }

    // Newsletter section animations
    if (newsletterRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: newsletterRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        newsletterRef.current.querySelectorAll('.animate-newsletter'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }

    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle filter changes
  const handleYearChange = (year: string) => {
    setActiveYear(year);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <>
      <div ref={heroRef}>
        <PastEventsHeroSection />
      </div>
      <div ref={archiveRef}>
        <PastEventsArchiveSection 
          activeYear={activeYear}
          activeCategory={activeCategory}
          onYearChange={handleYearChange}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      <div ref={highlightsRef}>
        <PastEventsHighlightsSection />
      </div>
      <div ref={newsletterRef}>
        <EventsNewsletterSection />
      </div>
    </>
  );
};

export default PastEventsPage;
