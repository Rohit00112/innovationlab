"use client";

import React, { useRef, useEffect } from 'react';
import EventsHeroSection from '../sections/EventsHeroSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection';
import PastEventsSection from '../sections/PastEventsSection';
import EventsCalendarSection from '../sections/EventsCalendarSection';
import EventsNewsletterSection from '../sections/EventsNewsletterSection';
import { useEventsPageAnimations, useEventsHeroAnimation, useEventCardAnimations } from '@/hooks/useGSAPAnimations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EventsPage: React.FC = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const upcomingEventsRef = useRef<HTMLDivElement>(null);
  const pastEventsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  // Apply hero animation with timeline-based sequential animations
  useEventsHeroAnimation(heroRef as React.RefObject<HTMLElement>);

  // Apply animations to other sections with appropriate timing
  useEventsPageAnimations(upcomingEventsRef as React.RefObject<HTMLElement>, {
    staggerDelay: 0.25,
    floatRange: 10,
    threshold: 0.15,
    textDuration: 0,
    floatDuration: 0,
    once: false
  });

  useEventsPageAnimations(pastEventsRef as React.RefObject<HTMLElement>, {
    textDuration: 0,
    floatDuration: 0,
    once: false,
    staggerDelay: 0.2,
    floatRange: 8,
    threshold: 0.15,
  });

  useEventsPageAnimations(calendarRef as React.RefObject<HTMLElement>, {
    textDuration: 0,
    floatDuration: 0,
    once: false,
    staggerDelay: 0.3,
    floatRange: 10,
    threshold: 0.15,
  });

  useEventsPageAnimations(newsletterRef as React.RefObject<HTMLElement>, {
    textDuration: 0,
    floatDuration: 0,
    once: false,
    staggerDelay: 0.25,
    floatRange: 8,
    threshold: 0.15,
  });

  // Apply enhanced hover animations to event cards
  useEventCardAnimations();

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
        <EventsHeroSection />
      </div>
      <div ref={upcomingEventsRef}>
        <UpcomingEventsSection />
      </div>
      <div ref={pastEventsRef}>
        <PastEventsSection />
      </div>
     
    </>
  );
};

export default EventsPage;
