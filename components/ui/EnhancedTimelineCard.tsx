"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

interface TimelineCardProps {
  year: string;
  title: string;
  description: string;
  iconBgColor: string;
  position: 'left' | 'right';
  icon: React.ReactNode;
  index: number;
  link?: string;
}

const EnhancedTimelineCard: React.FC<TimelineCardProps> = ({
  year,
  title,
  description,
  iconBgColor,
  position,
  icon,
  index,
  link = '#',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Set up hover animations
  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip animations if reduced motion is preferred
    if (prefersReducedMotion) return;

    // Card hover animation
    cardRef.current.addEventListener('mouseenter', () => {
      gsap.to(cardRef.current, {
        y: position === 'left' ? -3 : 3,
        boxShadow: '0 8px 15px rgba(0, 102, 255, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });

      // Animate the title color
      const title = cardRef.current.querySelector('.card-title');
      if (title) {
        gsap.to(title, {
          color: '#0066FF',
          duration: 0.3,
        });
      }
    });

    cardRef.current.addEventListener('mouseleave', () => {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        duration: 0.3,
        ease: 'power2.out',
      });

      // Reset the title color
      const title = cardRef.current.querySelector('.card-title');
      if (title) {
        gsap.to(title, {
          color: '#1F2937', // text-gray-900
          duration: 0.3,
        });
      }
    });

    // Icon hover animation
    iconRef.current.addEventListener('mouseenter', () => {
      gsap.to(iconRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Animate the icon inside
      const iconElement = iconRef.current.querySelector('.icon-element');
      if (iconElement) {
        gsap.to(iconElement, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    iconRef.current.addEventListener('mouseleave', () => {
      gsap.to(iconRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Reset the icon
      const iconElement = iconRef.current.querySelector('.icon-element');
      if (iconElement) {
        gsap.to(iconElement, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Clean up event listeners on unmount
    return () => {
      if (cardRef.current) {
        const card = cardRef.current;
        const newCard = card.cloneNode(true);
        if (card.parentNode) {
          card.parentNode.replaceChild(newCard, card);
        }
      }

      if (iconRef.current) {
        const icon = iconRef.current;
        const newIcon = icon.cloneNode(true);
        if (icon.parentNode) {
          icon.parentNode.replaceChild(newIcon, icon);
        }
      }
    };
  }, [position, iconBgColor]);

  return (
    <div className={`flex items-center ${position === 'left' ? 'flex-row-reverse' : 'flex-row'} timeline-item mb-8`}>
      {/* Card content */}
      <div className="w-full md:w-[45%] pl-4 md:pl-8">
        <div
          ref={cardRef}
          className="bg-white rounded-lg shadow-md p-5 border border-gray-100 transition-all duration-300 relative"
          style={{maxWidth: '400px', minHeight: '180px'}}
          data-index={index}
        >
          {/* Year badge */}
          <div className="flex items-center gap-3 justify-start mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${iconBgColor}`}>{year}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 text-left mb-2 card-title">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-700 text-left">
            {description}
          </p>
        </div>
      </div>

      {/* Icon circle in the middle */}
      <div className="relative flex items-center justify-center z-10">
        {/* Pulse effect */}
        <div className={`absolute w-14 h-14 rounded-full ${iconBgColor.replace('bg-[', 'bg-[').replace(']', '/30]')} animate-pulse`} style={{ animationDuration: '3s' }}></div>

        {/* Main circle with icon */}
        <div
          ref={iconRef}
          className={`w-14 h-14 rounded-full ${iconBgColor} flex items-center justify-center shadow-lg transition-all duration-300`}
        >
          <div className="icon-element transition-all duration-300">
            {icon}
          </div>
        </div>
      </div>

      {/* Empty div to balance the layout */}
      <div className="w-full md:w-[45%]"></div>
    </div>
  );
};

export default EnhancedTimelineCard;
