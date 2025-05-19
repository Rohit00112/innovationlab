"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { gsap } from 'gsap';

interface FeaturedEventProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  attendees: number | string;
  category: string;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({
  id,
  title,
  date,
  time,
  location,
  description,
  imageUrl,
  attendees,
  category,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Create hover effect
    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: '0 25px 50px rgba(0, 102, 255, 0.2)',
        duration: 0.4,
        ease: 'power2.out',
      });

      if (image) {
        gsap.to(image, {
          scale: 1.05,
          duration: 0.7,
          ease: 'power2.out',
        });
      }

      if (content) {
        gsap.to(content.querySelectorAll('.animate-on-hover'), {
          y: -5,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 10px 30px rgba(0, 102, 255, 0.1)',
        duration: 0.4,
        ease: 'power2.out',
      });

      if (image) {
        gsap.to(image, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      }

      if (content) {
        gsap.to(content.querySelectorAll('.animate-on-hover'), {
          y: 0,
          stagger: 0.03,
          duration: 0.3,
          ease: 'power2.out',
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
      className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col md:flex-row h-full featured-event-card"
    >
      {/* Event Image */}
      <div ref={imageRef} className="relative h-64 md:h-auto md:w-2/5 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 40vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>

        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-[#0066FF] text-white text-sm font-medium rounded-full">
          {category}
        </div>
      </div>

      {/* Event Content */}
      <div ref={contentRef} className="p-6 md:p-8 flex flex-col flex-grow md:w-3/5">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 animate-on-hover">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 animate-on-hover">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="h-4 w-4 text-[#0066FF]" />
            </div>
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 animate-on-hover">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
              <ClockIcon className="h-4 w-4 text-[#0066FF]" />
            </div>
            <span>{time}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 animate-on-hover">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="h-4 w-4 text-[#0066FF]" />
            </div>
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 animate-on-hover">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
              <UserGroupIcon className="h-4 w-4 text-[#0066FF]" />
            </div>
            <span>{attendees} Attendees</span>
          </div>
        </div>

        <p className="text-gray-700 mb-6 line-clamp-3 animate-on-hover">
          {description}
        </p>

        <div className="mt-auto flex flex-col sm:flex-row gap-4">
          <Link
            href={`/events/${id}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-[#0066FF] to-[#5045E8] text-white hover:shadow-lg transition-all duration-300 animate-on-hover"
          >
            <span>Register Now</span>
            <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>

          <Link
            href={`/events/${id}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/5 transition-all duration-300 animate-on-hover"
          >
            <span>Learn More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
