"use client";

import React, { useRef, useEffect } from 'react';
import AboutHeroSection from '../sections/AboutHeroSection';
import RelationshipSection from '../sections/RelationshipSection';
import MissionVisionAboutSection from '../sections/MissionVisionAboutSection';
import CoreValuesAboutSection from '../sections/CoreValuesAboutSection';
import JourneySection from '../sections/JourneySection';
import FAQSection from '../sections/FAQSection';
import { useAboutPageAnimations } from '@/hooks/useGSAPAnimations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutPage: React.FC = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const relationshipRef = useRef<HTMLDivElement>(null);
  const missionVisionRef = useRef<HTMLDivElement>(null);
  const coreValuesRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Apply animations to each section with appropriate timing
  useAboutPageAnimations(heroRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.25,
    floatRange: 10,
    threshold: 0.1,
    textDuration: 0,
    floatDuration: 0,
    once: false,
    immediate: false
  });

  useAboutPageAnimations(relationshipRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.2,
    floatRange: 8,
    threshold: 0.15,
    textDuration: 0,
    floatDuration: 0,
    once: false,
    immediate: false
  });

  // Use immediate animations for the mission vision section
  useAboutPageAnimations(missionVisionRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.3,
    floatRange: 10,
    threshold: 0.15,
    immediate: true,
    textDuration: 0,
    floatDuration: 0,
    once: false
  });

  // Use the same animation hook as the home page for core values
  useAboutPageAnimations(coreValuesRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.15,
    floatRange: 8,
    threshold: 0.15,
    textDuration: 0.8,
    floatDuration: 3,
    once: true,
    immediate: false
  });

  useAboutPageAnimations(journeyRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.2,
    floatRange: 10,
    threshold: 0.15,
    textDuration: 0,
    floatDuration: 0,
    once: false,
    immediate: false
  });

  useAboutPageAnimations(faqRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.25,
    floatRange: 8,
    threshold: 0.15,
    textDuration: 0,
    floatDuration: 0,
    once: false,
    immediate: false
  });

  // Set up scroll-based animations
  useEffect(() => {
    // Refresh ScrollTrigger when the component mounts
    ScrollTrigger.refresh();

    return () => {
      // Clean up all ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <div ref={heroRef}>
        <AboutHeroSection />
      </div>
      <div ref={relationshipRef}>
        <RelationshipSection />
      </div>
      <div ref={missionVisionRef}>
        <MissionVisionAboutSection />
      </div>
      <div ref={coreValuesRef}>
        <CoreValuesAboutSection />
      </div>
      <div ref={journeyRef}>
        <JourneySection />
      </div>
      <div ref={faqRef}>
        <FAQSection />
      </div>
    </>
  );
};

export default AboutPage;
