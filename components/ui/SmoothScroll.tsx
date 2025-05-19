"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !contentRef.current) return;

    // Make sure content is visible first
    gsap.set(contentRef.current, { opacity: 1 });

    // Don't interfere with normal link navigation
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Allow normal link navigation to proceed
        // This ensures links work as expected
      });
    });

    // Delay animations to ensure content is visible
    const initAnimations = () => {
      // Create enhanced section transitions
      const sections = contentRef.current.querySelectorAll('section');

      // First ensure all sections are visible
      gsap.set(sections, { opacity: 1, y: 0 });

      // Then apply animations with a delay
      setTimeout(() => {
        sections.forEach((section, index) => {
          // Add a subtle parallax effect to each section
          gsap.fromTo(
            section,
            {
              opacity: 0.95, // Less dramatic initial opacity
              y: 10 // Less dramatic initial position
            },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 15%",
                scrub: 0.8,
              }
            }
          );

          // Add subtle scale effect to section backgrounds
          const bgElements = section.querySelectorAll('.bg-element, .decorative-element');
          if (bgElements.length > 0) {
            gsap.fromTo(
              bgElements,
              {
                scale: 0.98, // Less dramatic scale
                opacity: 0.9 // Less dramatic opacity
              },
              {
                scale: 1,
                opacity: 1,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                }
              }
            );
          }
        });
      }, 200);
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initAnimations, 100);

    // Clean up
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={contentRef} className="smooth-content">
      {children}
    </div>
  );
};

export default SmoothScroll;
