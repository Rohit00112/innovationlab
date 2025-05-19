"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
// Removed unused imports
// import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { gsap } from 'gsap';

interface SimpleEventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  category?: string;
  time?: string;
}

const SimpleEventCard: React.FC<SimpleEventCardProps> = ({
  id,
  title,
  date,
  location,
  description,
  imageUrl,
  category = "Event",
  time = "10:00 AM",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Set up 3D hover effect
  useEffect(() => {
    if (!cardRef.current || !imageContainerRef.current) return;

    const card = cardRef.current;
    const imageContainer = imageContainerRef.current;
    const cardTitle = card.querySelector('.card-title');
    const cardOverlay = card.querySelector('.card-overlay');
    const cardButton = card.querySelector('.card-button');
    const cardIcons = card.querySelectorAll('.card-icon');
    const cardBadge = card.querySelector('.card-badge');

    // Calculate card dimensions for perspective effect
    const { width, height } = card.getBoundingClientRect();
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Mouse enter animation
    card.addEventListener('mouseenter', () => {
      // Main card animation
      gsap.to(card, {
        y: -15,
        scale: 1.02,
        boxShadow: '0 20px 30px rgba(0, 102, 255, 0.15)',
        duration: 0.4,
        ease: 'power2.out',
      });

      // Image animation
      gsap.to(imageContainer, {
        scale: 1.1,
        duration: 0.7,
        ease: 'power2.out',
      });

      // Overlay animation
      if (cardOverlay) {
        gsap.to(cardOverlay, {
          opacity: 0.6,
          duration: 0.3,
        });
      }

      // Title animation
      if (cardTitle) {
        gsap.to(cardTitle, {
          color: '#0066FF',
          y: -3,
          duration: 0.3,
        });
      }

      // Button animation
      if (cardButton) {
        gsap.to(cardButton, {
          y: -5,
          boxShadow: '0 5px 15px rgba(0, 102, 255, 0.2)',
          duration: 0.4,
        });
      }

      // Icons animation with stagger
      if (cardIcons.length > 0) {
        gsap.to(cardIcons, {
          scale: 1.2,
          backgroundColor: 'rgba(0, 102, 255, 0.2)',
          duration: 0.3,
          stagger: 0.1,
        });
      }

      // Badge animation
      if (cardBadge) {
        gsap.to(cardBadge, {
          scale: 1.1,
          y: -3,
          duration: 0.3,
        });
      }
    });

    // Mouse move animation for 3D effect
    card.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top } = card.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;

      const rotateY = ((x - halfWidth) / halfWidth) * 5; // Max 5 degrees
      const rotateX = ((y - halfHeight) / halfHeight) * -5; // Max 5 degrees

      gsap.to(card, {
        rotateY: rotateY,
        rotateX: rotateX,
        transformPerspective: 1000,
        transformOrigin: 'center center',
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    // Mouse leave animation
    card.addEventListener('mouseleave', () => {
      // Reset all animations
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.to(imageContainer, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });

      if (cardOverlay) {
        gsap.to(cardOverlay, {
          opacity: 0,
          duration: 0.3,
        });
      }

      if (cardTitle) {
        gsap.to(cardTitle, {
          color: '#333333',
          y: 0,
          duration: 0.3,
        });
      }

      if (cardButton) {
        gsap.to(cardButton, {
          y: 0,
          boxShadow: 'none',
          duration: 0.4,
        });
      }

      if (cardIcons.length > 0) {
        gsap.to(cardIcons, {
          scale: 1,
          backgroundColor: 'rgba(0, 102, 255, 0.1)',
          duration: 0.3,
          stagger: 0.05,
        });
      }

      if (cardBadge) {
        gsap.to(cardBadge, {
          scale: 1,
          y: 0,
          duration: 0.3,
        });
      }
    });

    return () => {
      // Clean up event listeners
      card.replaceWith(card.cloneNode(true));
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full event-card transform-gpu"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Event Image */}
      <div ref={imageContainerRef} className="relative h-48 md:h-56 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover card-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 card-overlay"></div>

        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-[#0066FF] text-white text-sm font-medium rounded-full card-badge">
          {category}
        </div>

        {/* Date badge */}
        <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center shadow-md">
          <div className="text-xs text-[#0066FF] font-medium">{date.split(' ')[0]}</div>
          <div className="text-lg font-bold text-gray-900">{date.split(' ')[1].replace(',', '')}</div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 card-title">
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0 card-icon">
              <ClockIcon className="h-3 w-3 text-[#0066FF]" />
            </div>
            <span>{time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0 card-icon">
              <MapPinIcon className="h-3 w-3 text-[#0066FF]" />
            </div>
            <span className="truncate">{location}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-5 line-clamp-2">
          {description}
        </p>

        <Link
          href={`/events/${id}`}
          className="mt-auto inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-[#0066FF] to-[#5045E8] text-white card-button"
        >
          <span>Register Now</span>
          <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default SimpleEventCard;
