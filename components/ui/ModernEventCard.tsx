"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

interface ModernEventCardProps {
  id: string;
  title: string;
  date: {
    month: string;
    day: string;
    time: string;
  };
  location: string;
  imageUrl: string;
  fullWidth?: boolean;
}

const ModernEventCard: React.FC<ModernEventCardProps> = ({
  id,
  title,
  date,
  location,
  imageUrl,
  fullWidth = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // Enhanced hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 20px 30px rgba(0, 102, 255, 0.15)',
        duration: 0.4,
        ease: 'power3.out',
      });

      // Animate the title to brand color
      const title = card.querySelector('h3');
      if (title) {
        gsap.to(title, {
          color: '#0066FF',
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // Animate the image scale
      const imageContainer = card.querySelector('.relative.w-full.h-48');
      if (imageContainer) {
        const image = imageContainer.querySelector('img');
        if (image) {
          gsap.to(image, {
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }

      // Animate the date box
      const dateBox = card.querySelector('.absolute.left-4.top-4');
      if (dateBox) {
        gsap.to(dateBox, {
          scale: 1.05,
          y: 2,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        duration: 0.4,
        ease: 'power3.out',
      });

      // Reset title color
      const title = card.querySelector('h3');
      if (title) {
        gsap.to(title, {
          color: '#111827', // text-gray-900
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // Reset image scale
      const imageContainer = card.querySelector('.relative.w-full.h-48');
      if (imageContainer) {
        const image = imageContainer.querySelector('img');
        if (image) {
          gsap.to(image, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }

      // Reset date box
      const dateBox = card.querySelector('.absolute.left-4.top-4');
      if (dateBox) {
        gsap.to(dateBox, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Clean up event listeners
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 bg-white ${fullWidth ? 'w-full' : 'max-w-md'} group hover:shadow-xl`}
    >
      {/* Event Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={fullWidth ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority
          quality={90}
        />
        {/* Explicitly set to no overlay */}
        <style jsx>{`
          div:after {
            display: none !important;
            content: none !important;
          }
        `}</style>
      </div>

      {/* Enhanced Calendar Badge */}
      <div className="absolute left-4 top-4 overflow-hidden shadow-lg w-16 text-center transform transition-transform duration-300 group-hover:scale-105 rounded-lg">
        {/* Month section with uppercase styling */}
        <div className="bg-[#0066FF] py-1 px-2 uppercase text-white font-semibold text-xs tracking-wider">
          {date.month}
        </div>
        {/* Day with larger font and white background */}
        <div className="bg-white py-2 border-l border-r border-[#0066FF]/20">
          <p className="text-2xl font-bold leading-none text-[#0066FF]">{date.day}</p>
        </div>
        {/* Time with subtle background */}
        <div className="bg-[#0066FF] py-1 text-xs text-white font-medium">
          {date.time || '00:00'}
        </div>
      </div>

      {/* Event Info */}
      <div className="p-5">
        <div className="flex items-center mb-3 text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <p className="text-sm font-medium">{location}</p>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#0066FF] transition-colors duration-300">{title}</h3>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Link
            href={`/events/${id}/register`}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-1 text-center shadow-sm hover:shadow-md"
          >
            Register Now
          </Link>
          <Link
            href={`/events/${id}`}
            className="bg-transparent hover:bg-[#0066FF]/5 text-[#0066FF] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-1 text-center border border-[#0066FF]"
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModernEventCard;
