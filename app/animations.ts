"use client";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Initialize scroll animations for elements with the 'reveal' class
export const initScrollAnimations = (options = { immediate: true }) => {
  if (typeof window === 'undefined') return () => {};

  // Animate elements with the 'reveal' class
  const revealElements = document.querySelectorAll('.reveal');

  if (options.immediate) {
    // If immediate is true, animate all elements immediately without scroll trigger
    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          // No scroll trigger for immediate animations
        }
      );
    });
  } else {
    // Otherwise, use scroll-triggered animations
    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  // Animate elements with specific animation classes
  const animateElements = (selector: string, animation: gsap.TweenVars) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (options.immediate) {
        // Immediate animation without scroll trigger
        gsap.fromTo(
          element,
          {
            y: 30,
            opacity: 0
          },
          {
            ...animation,
            // No scroll trigger for immediate animations
          }
        );
      } else {
        // Scroll-triggered animation
        gsap.fromTo(
          element,
          {
            y: 30,
            opacity: 0
          },
          {
            ...animation,
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });
  };

  // Animate fade in up elements
  animateElements('.animate-fadeInUp', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Animate fade in elements
  animateElements('.animate-fadeIn', {
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Animate scale in elements
  animateElements('.animate-scaleIn', {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'back.out(1.7)',
  });

  // Initialize smooth scroll for anchor links
  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId) {
          const target = document.querySelector(targetId);
          if (target) {
            gsap.to(window, {
              duration: 1,
              scrollTo: {
                y: target,
                offsetY: 80, // Account for fixed header
              },
              ease: 'power3.inOut',
            });
          }
        }
      });
    });
  };

  initSmoothScroll();

  // Clean up function to kill all ScrollTrigger instances
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
};

// Function to convert scroll-triggered animations to immediate animations
export const convertScrollTriggersToImmediate = () => {
  if (typeof window === 'undefined') return () => {};

  // Kill all existing ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Function to animate content sections immediately
  const animateContentSections = () => {
    // Get all content sections
    const contentSections = document.querySelectorAll('.content-section');

    // Make all content sections visible immediately
    gsap.set(contentSections, { opacity: 1, y: 0, visibility: 'visible' });

    // Animate each section with a staggered effect
    gsap.fromTo(
      contentSections,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );

    // Animate elements within each section
    contentSections.forEach((section, index) => {
      const delay = index * 0.1;

      // Section titles
      const sectionTitle = section.querySelector('.section-title');
      if (sectionTitle) {
        gsap.fromTo(
          sectionTitle,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: delay + 0.1,
            ease: 'power2.out'
          }
        );
      }

      // Section text
      const sectionText = section.querySelector('.section-text');
      if (sectionText) {
        gsap.fromTo(
          sectionText,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: delay + 0.2,
            ease: 'power2.out'
          }
        );
      }

      // Expectation items
      const expectationItems = section.querySelectorAll('.expectation-item');
      if (expectationItems.length) {
        gsap.fromTo(
          expectationItems,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            delay: delay + 0.3,
            ease: 'power3.out'
          }
        );

        // Add floating animation to expectation icons
        gsap.to('.expectation-icon', {
          y: -8,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: 0.5
        });
      }

      // Sub-events cards
      const subEventCards = section.querySelectorAll('.sub-event-card');
      if (subEventCards.length) {
        gsap.fromTo(
          subEventCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            delay: delay + 0.3,
            ease: 'power3.out'
          }
        );
      }

      // Gallery items
      const galleryItems = section.querySelectorAll('.gallery-item');
      if (galleryItems.length) {
        gsap.fromTo(
          galleryItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            delay: delay + 0.3,
            ease: 'power3.out'
          }
        );
      }
    });

    // Make sure related events sections are visible
    const relatedEventsSections = document.querySelectorAll('.related-events-section');
    gsap.set(relatedEventsSections, {
      opacity: 1,
      visibility: 'visible',
      display: 'block'
    });

    // Animate related events cards
    const relatedEventCards = document.querySelectorAll('.related-event-card');
    if (relatedEventCards.length) {
      gsap.fromTo(
        relatedEventCards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.5,
          ease: 'power2.out'
        }
      );
    }
  };

  // Run the animation function
  animateContentSections();

  // Return cleanup function
  return () => {
    // No cleanup needed as we've already killed ScrollTriggers
  };
};
