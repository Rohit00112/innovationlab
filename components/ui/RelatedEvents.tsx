"use client";

import React from 'react';
import Link from 'next/link';
import ModernEventCard from './ModernEventCard';
import relatedEventsData from '@/data/sections/eventDetails/relatedEvents.json';

interface EventDate {
  month: string;
  day: string;
  time: string;
}

interface RelatedEvent {
  id: string;
  title: string;
  date: EventDate | string;
  location: string;
  imageUrl?: string;
  image?: string;
}

interface RelatedEventsProps {
  relatedEvents: RelatedEvent[];
}

const RelatedEvents: React.FC<RelatedEventsProps> = ({ relatedEvents }) => {
  // No need for useEffect since we're setting styles directly in the JSX
  // This prevents any flashing of overlay on initial render

  return (
    <div
      className={relatedEventsData.sectionClasses}
      style={{
        willChange: 'transform',
        opacity: 1,
        visibility: 'visible',
        transition: 'none' // Disable transitions to prevent flashing
      }}
    >
      {/* Background with subtle border instead of gradient overlay */}
      <div
        className="absolute inset-0 border border-gray-100 rounded-xl -z-10"
        style={{ opacity: 1, visibility: 'visible', transition: 'none' }}
      ></div>

      <div className={relatedEventsData.container.classes}>
        {/* Section header with modern design */}
        <div className={relatedEventsData.header.containerClasses}>
          <div className={relatedEventsData.header.icon.containerClasses}>
            <svg
              className={relatedEventsData.header.icon.classes}
              fill="none"
              stroke="currentColor"
              viewBox={relatedEventsData.header.icon.viewBox}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={relatedEventsData.header.icon.path.strokeWidth}
                d={relatedEventsData.header.icon.path.d}
              ></path>
            </svg>
          </div>
          <h2 className={relatedEventsData.header.title.classes}>{relatedEventsData.header.title.text}</h2>
          <div className={relatedEventsData.header.divider.classes}></div>
          <p className={relatedEventsData.header.description.classes}>{relatedEventsData.header.description.text}</p>
        </div>

        {/* Cards container with improved spacing and layout */}
        <div className={relatedEventsData.grid.containerClasses}>
          {relatedEvents.map((relatedEvent, index) => (
            <div
              key={relatedEvent.id}
              className={`related-event-card transform-gpu transition-all duration-500 event-card-${index}`}
            >
              <ModernEventCard
                id={relatedEvent.id}
                title={relatedEvent.title}
                date={typeof relatedEvent.date === 'string' ? {
                  month: relatedEvent.date.split(' ')[0],
                  day: relatedEvent.date.split(' ')[1]?.split(',')[0] || '01',
                  time: '00:00'
                } : relatedEvent.date}
                location={relatedEvent.location}
                imageUrl={relatedEvent.imageUrl || relatedEvent.image || ''}
              />
            </div>
          ))}
        </div>

        {/* View all events button */}
        <div className={relatedEventsData.viewAllButton.containerClasses}>
          <Link
            href={relatedEventsData.viewAllButton.href}
            className={relatedEventsData.viewAllButton.classes}
          >
            {relatedEventsData.viewAllButton.text}
            <svg
              className={relatedEventsData.viewAllButton.icon.classes}
              fill="none"
              stroke="currentColor"
              viewBox={relatedEventsData.viewAllButton.icon.viewBox}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={relatedEventsData.viewAllButton.icon.path.strokeWidth}
                d={relatedEventsData.viewAllButton.icon.path.d}
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedEvents;
