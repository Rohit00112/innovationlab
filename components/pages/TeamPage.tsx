"use client";

import React, { useRef, useEffect } from 'react';
import TeamHeroSection from '../sections/TeamHeroSection';
import TeamMembersSection from '../sections/TeamMembersSection';
import TeamCTASection from '../sections/TeamCTASection';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TeamPage: React.FC = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
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

    // Team members section animations
    if (membersRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: membersRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        membersRef.current.querySelectorAll('.team-member'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
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

  return (
    <>
      <div ref={heroRef}>
        <TeamHeroSection />
      </div>
      <div ref={membersRef}>
        <TeamMembersSection />
      </div>
      <div ref={ctaRef}>
        <TeamCTASection />
      </div>
    </>
  );
};

export default TeamPage;
