"use client";

import React, { useRef, useEffect, useState } from 'react';
import ProgramsHeroSection from '../sections/ProgramsHeroSection';
import ProgramsGridSection from '../sections/ProgramsGridSection';
import ProgramsCTASection from '../sections/ProgramsCTASection';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCardAnimation } from '@/hooks/useGSAPAnimations';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ProgramsPage: React.FC = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const programsGridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // State for active category filter
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
      )
      .fromTo(
        heroRef.current.querySelectorAll('.animate-decoration'),
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.7)' },
        '-=0.8'
      );
    }

    // Programs grid animations
    if (programsGridRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: programsGridRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        programsGridRef.current.querySelectorAll('.filter-item'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }

    // CTA section animations
    if (ctaRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        ctaRef.current.querySelectorAll('.animate-cta'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }

    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <>
      <div ref={heroRef}>
        <ProgramsHeroSection />
      </div>
      <div ref={programsGridRef}>
        <ProgramsGridSection 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </div>
      <div ref={ctaRef}>
        <ProgramsCTASection />
      </div>
    </>
  );
};

export default ProgramsPage;
