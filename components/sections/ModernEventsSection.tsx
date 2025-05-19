"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import ModernEventCard from '../ui/ModernEventCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventData {
  id: string;
  title: string;
  date: {
    month: string;
    day: string;
    time: string;
  };
  location: string;
  imageUrl: string;
}

const ModernEventsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [events] = useState<EventData[]>([
    {
      id: 'iic-quest-3-0',
      title: 'IIC Quest 3.0',
      date: {
        month: 'June',
        day: '11',
        time: '08:00 A.M',
      },
      location: 'Itahari International College',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 'tech-workshop',
      title: 'Tech Workshop 2023',
      date: {
        month: 'July',
        day: '15',
        time: '10:00 A.M',
      },
      location: 'Innovation Hub, Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 'coding-bootcamp',
      title: 'Coding Bootcamp',
      date: {
        month: 'Aug',
        day: '05',
        time: '09:30 A.M',
      },
      location: 'Digital Campus, Pokhara',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 'ai-conference',
      title: 'AI Conference 2023',
      date: {
        month: 'Sept',
        day: '20',
        time: '09:00 A.M',
      },
      location: 'Tech Park, Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070&auto=format&fit=crop',
    },
  ]);

  // Set up animations
  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    // Animate section title and description
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
      },
    });

    tl.from('.section-title', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
      .from('.section-description', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .from('.section-button', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.3');

    // Animate cards with stagger
    const cards = cardsRef.current.querySelectorAll('.event-card');
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardsRef.current,
        start: 'top 75%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="section-description text-lg text-gray-700 mb-8">
            Join us for these exciting events and workshops designed to inspire innovation and foster collaboration in technology.
          </p>
          <Link
            href="/events"
            className="section-button inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors duration-300"
          >
            View All Events
            <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <ModernEventCard
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                imageUrl={event.imageUrl}
              />
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="section-title text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Featured Event
          </h2>
          <ModernEventCard
            id="iic-quest-3-0"
            title="Innovation Lab Presents IIC Quest 3.0"
            date={{
              month: 'June',
              day: '11',
              time: '08:00 A.M',
            }}
            location="Itahari International College"
            imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            fullWidth={true}
          />
        </div>
      </div>
    </section>
  );
};

export default ModernEventsSection;
