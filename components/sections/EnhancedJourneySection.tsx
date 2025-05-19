"use client";

import React, { useRef, useEffect } from 'react';
import EnhancedTimelineCard from '../ui/EnhancedTimelineCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import JSON data
import journeyData from '@/data/sections/about/journey.json';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EnhancedJourneySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const decorativeElementsRef = useRef<HTMLDivElement>(null);

  // Custom SVG icons for each milestone
  const icons = {
    foundation: (
      <svg width="20" height="20" viewBox={journeyData.icons.foundation.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={journeyData.icons.foundation.path}
          stroke={journeyData.icons.foundation.stroke}
          strokeWidth={journeyData.icons.foundation.strokeWidth}
          strokeLinecap={journeyData.icons.foundation.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
          strokeLinejoin={journeyData.icons.foundation.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
        />
      </svg>
    ),
    cohort: (
      <svg width="20" height="20" viewBox={journeyData.icons.cohort.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={journeyData.icons.cohort.path}
          stroke={journeyData.icons.cohort.stroke}
          strokeWidth={journeyData.icons.cohort.strokeWidth}
          strokeLinecap={journeyData.icons.cohort.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
          strokeLinejoin={journeyData.icons.cohort.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
        />
      </svg>
    ),
    research: (
      <svg width="20" height="20" viewBox={journeyData.icons.research.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={journeyData.icons.research.path}
          stroke={journeyData.icons.research.stroke}
          strokeWidth={journeyData.icons.research.strokeWidth}
          strokeLinecap={journeyData.icons.research.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
          strokeLinejoin={journeyData.icons.research.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
        />
      </svg>
    ),
    expansion: (
      <svg width="20" height="20" viewBox={journeyData.icons.expansion.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d={journeyData.icons.expansion.path}
          stroke={journeyData.icons.expansion.stroke}
          strokeWidth={journeyData.icons.expansion.strokeWidth}
          strokeLinecap={journeyData.icons.expansion.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
          strokeLinejoin={journeyData.icons.expansion.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
        />
      </svg>
    ),
  };

  // Milestone data from JSON
  const milestones = journeyData.milestones.map(milestone => ({
    ...milestone,
    icon: icons[milestone.iconType as keyof typeof icons]
  }));

  // Set up animations
  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return;

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
      '.section-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    ).fromTo(
      '.section-description',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    );

    // Animate timeline line
    tl.fromTo(
      '.timeline-line',
      { height: 0, opacity: 0 },
      { height: '100%', opacity: 1, duration: 1.5, ease: 'power3.inOut' },
      '-=0.4'
    );

    // Animate timeline dots
    tl.fromTo(
      '.timeline-dot',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(1.7)' },
      '-=1.2'
    );

    // Animate timeline items with staggered effect
    if (!prefersReducedMotion) {
      const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');

      timelineItems.forEach((item, index) => {
        const position = index % 2 === 0 ? 'left' : 'right';
        const card = item.querySelector('div[data-index="' + index + '"]');
        const icon = item.querySelector('.icon-element').parentElement;

        // Create a separate timeline for each item
        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Animate card
        itemTl.fromTo(
          card,
          {
            opacity: 0,
            x: position === 'left' ? -50 : 50,
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)',
          },
          0
        );

        // Animate icon
        itemTl.fromTo(
          icon,
          {
            opacity: 0,
            scale: 0.5,
            rotation: position === 'left' ? -45 : 45,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          0.2
        );
      });
    } else {
      // Simple fade-in for reduced motion preference
      const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
      tl.to(timelineItems, { opacity: 1, duration: 0.5, stagger: 0.1 });
    }

    // Animate future milestone teaser
    tl.fromTo(
      '.future-milestone',
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
      '-=0.4'
    );

    // Animate floating decorative elements
    if (!prefersReducedMotion && decorativeElementsRef.current) {
      const decorativeElements = decorativeElementsRef.current.querySelectorAll('.decorative-element');

      decorativeElements.forEach((element, index) => {
        // Random floating animation within ±10px range
        gsap.to(element, {
          y: index % 2 === 0 ? '10' : '-10',
          x: index % 3 === 0 ? '5' : '-5',
          rotation: index % 2 === 0 ? 5 : -5,
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });
      });
    }

    // Clean up
    return () => {
      if (tl) tl.kill();
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => trigger.kill());

      // Kill any ongoing animations for decorative elements
      if (decorativeElementsRef.current) {
        const decorativeElements = decorativeElementsRef.current.querySelectorAll('.decorative-element');
        gsap.killTweensOf(decorativeElements);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={journeyData.sectionClasses}
      id={journeyData.sectionId}
    >
      {/* Decorative elements container */}
      <div ref={decorativeElementsRef} className="absolute inset-0 pointer-events-none">
        {/* Floating decorative elements */}
        {journeyData.background.decorativeElements.map((element, index) => (
          <div key={index} className={element.classes}></div>
        ))}
      </div>

      {/* Background pattern */}
      <div className={journeyData.background.pattern.containerClasses}>
        <div className="absolute inset-0" style={journeyData.background.pattern.style}></div>
      </div>

      <div className="relative z-10">
        {/* Section header - using the container classes from JSON which now include container styling */}
        <div className={journeyData.header.containerClasses}>
          <span className={journeyData.header.badge.classes}>
            {journeyData.header.badge.text}
          </span>
          <h2 className={journeyData.header.title.classes}>
            {journeyData.header.title.text}
          </h2>
          <p className={journeyData.header.description.classes}>
            {journeyData.header.description.text}
          </p>

          {/* Decorative line */}
          <div className={journeyData.header.decorativeLine.classes}></div>
        </div>

        <div className="container mx-auto px-4 md:px-8">

        <div ref={timelineRef} className={journeyData.timeline.containerClasses}>
          {/* Timeline line */}
          <div className={journeyData.timeline.line.classes}></div>

          {/* Decorative dots along timeline */}
          {journeyData.timeline.dots.map((dot, index) => (
            <div key={index} className={dot.classes}></div>
          ))}

          {/* Timeline cards */}
          <div className={journeyData.timeline.cardsContainerClasses}>
            {milestones.map((milestone, index) => (
              <EnhancedTimelineCard
                key={index}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                iconBgColor={milestone.iconBgColor}
                position={milestone.position}
                icon={milestone.icon}
                index={index}
                link={milestone.link}
              />
            ))}
          </div>
        </div>


        </div>
      </div>
    </section>
  );
};

export default EnhancedJourneySection;
