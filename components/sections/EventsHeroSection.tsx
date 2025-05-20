"use client";

import React, { useRef, useEffect, useState, RefObject } from 'react';
import Button from '../ui/Button';
import Image from 'next/image';
import { useAdvanced3DAnimations, useCountdownAnimation } from '@/hooks/useGSAPAnimations';
import { gsap } from 'gsap';

// Import JSON data
import heroData from '@/data/sections/events/hero.json';

const EventsHeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  // Set next event date for June 11 (IICQuest 3.0)
  const [nextEventDate] = useState(() => {
    // Create a date object for June 11 of the current year
    const date = new Date();
    date.setMonth(5); // June is month 5 (0-indexed)
    date.setDate(11);
    date.setHours(0, 0, 0, 0); // Start of the day
    return date;
  });

  // Custom date string for the next event
  const nextEventDateString = "June 11-13";

  // Particle effects removed

  // Initialize advanced 3D animations
  useAdvanced3DAnimations<HTMLDivElement>(contentRef as RefObject<HTMLDivElement>, {
    perspective: 1200,
    rotationIntensity: 5,
    parallaxIntensity: 25,
    staggerDelay: 0.25,
    textDuration: 0.8,
    respectedReducedMotion: true,
    threshold: 0.1,
  });

  // Initialize countdown animation
  useCountdownAnimation(nextEventDate, countdownRef as RefObject<HTMLElement>);

  // Mouse movement effect for the badges
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return; // Skip effect if reduced motion is preferred

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = section.getBoundingClientRect();

      // Calculate mouse position relative to the section
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      // Animate the event badges with subtle movement
      const eventBadges = section.querySelectorAll('.event-badge');
      eventBadges.forEach((badge) => {
        gsap.to(badge, {
          x: x * 15, // Subtle movement
          y: y * 15,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={heroData.sectionClasses}
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div className={heroData.background.overlay.classes}></div>
        <Image
          src={heroData.background.image.src}
          alt={heroData.background.image.alt}
          fill
          priority={heroData.background.image.priority}
          quality={heroData.background.image.quality}
          sizes={heroData.background.image.sizes}
          className="object-cover"
          style={{ objectPosition: heroData.background.image.objectPosition }}
        />


        {/* Event type badge - conditionally rendered if it exists */}
        {heroData.background.badges.eventType && (
          <div className={heroData.background.badges.eventType.classes}>
            <div className={heroData.background.badges.eventType.textClasses}>
              {heroData.background.badges.eventType.text}
            </div>
          </div>
        )}
      </div>

      {/* Image attribution */}
      {/* <div className={heroData.background.attribution.classes}>
        {heroData.background.attribution.text}
        <a href={heroData.background.attribution.authorLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
          {heroData.background.attribution.authorName}
        </a> on <a href={heroData.background.attribution.sourceLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
          {heroData.background.attribution.sourceName}
        </a>
      </div> */}



      <div className={`${heroData.content.containerClasses} pt-5 md:pt-10`}>
        <div ref={contentRef} className={heroData.content.wrapperClasses}>
          {/* Left content with enhanced typography and animations */}
          <div className={heroData.content.leftContent.containerClasses}>
            {/* Enhanced tagline with animation classes */}
            <div className={heroData.content.leftContent.tagline.containerClasses}>
              <span className={heroData.content.leftContent.tagline.dotClasses}></span>
              <span className={heroData.content.leftContent.tagline.textClasses}>
                {heroData.content.leftContent.tagline.text}
              </span>
            </div>

            {/* Enhanced heading with animation classes and split lines for staggered animation */}
            <h1 className={heroData.content.leftContent.heading.containerClasses}>
              <span className={heroData.content.leftContent.heading.line1.classes}>
                {heroData.content.leftContent.heading.line1.text}
              </span>
            </h1>

            {/* Enhanced description with animation class */}
            <p className={heroData.content.leftContent.description.classes}>
              {heroData.content.leftContent.description.text}
            </p>

            {/* Enhanced buttons with animation classes */}
            <div className={heroData.content.leftContent.buttons.containerClasses}>
              <Button
                href={heroData.content.leftContent.buttons.registerButton.href}
                variant={heroData.content.leftContent.buttons.registerButton.variant as "primary" | "secondary" | "outline" | undefined}
                size={heroData.content.leftContent.buttons.registerButton.size as "sm" | "md" | "lg" | undefined}
                className={heroData.content.leftContent.buttons.registerButton.classes}
                target={heroData.content.leftContent.buttons.registerButton.target}
                rel={heroData.content.leftContent.buttons.registerButton.rel}
              >
                {heroData.content.leftContent.buttons.registerButton.text}
              </Button>
              <Button
                href={heroData.content.leftContent.buttons.viewMoreButton.href}
                variant={heroData.content.leftContent.buttons.viewMoreButton.variant as "primary" | "secondary" | "outline" | undefined}
                size={heroData.content.leftContent.buttons.viewMoreButton.size as "sm" | "md" | "lg" | undefined}
                className={heroData.content.leftContent.buttons.viewMoreButton.classes}
              >
                {heroData.content.leftContent.buttons.viewMoreButton.text}
              </Button>
            </div>

            {/* Countdown container with improved mobile centering */}
            <div className={heroData.content.leftContent.countdown.containerClasses}>
              {/* Countdown timer with centered layout */}
              <div ref={countdownRef} className={heroData.content.leftContent.countdown.timerClasses}>
                {heroData.content.leftContent.countdown.units.map((unit, index) => (
                  <div key={index} className={unit.classes}>
                    <div data-countdown={unit.type} className={unit.valueClasses}>{unit.initialValue}</div>
                    <div className={unit.labelClasses}>{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default EventsHeroSection;
