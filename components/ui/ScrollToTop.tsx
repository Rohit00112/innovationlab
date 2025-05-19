"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top with animation
  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: {
        y: 0,
        autoKill: true,
      },
      duration: 1,
      ease: 'power3.inOut',
    });
  };

  // Button animation
  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    // Entrance animation when button becomes visible
    if (isVisible) {
      gsap.fromTo(
        button,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to(button, { opacity: 0, y: 20, duration: 0.3, ease: 'power3.in' });
    }

    // Hover animations
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.1,
        boxShadow: '0 10px 25px rgba(0, 102, 255, 0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        boxShadow: '0 4px 10px rgba(0, 102, 255, 0.2)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    // Click animation
    button.addEventListener('mousedown', () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
      });
    });

    button.addEventListener('mouseup', () => {
      gsap.to(button, {
        scale: 1.1,
        duration: 0.1,
        ease: 'power2.out',
      });
    });

    return () => {
      // Clean up
      gsap.killTweensOf(button);
    };
  }, [isVisible]);

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#0066FF] text-white shadow-lg transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
