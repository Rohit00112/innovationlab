"use client";

import React, { useRef, forwardRef, useState, useEffect } from 'react';
import SimpleEventCard from '../ui/SimpleEventCard';
import FeaturedEvent from '../ui/FeaturedEvent';
import Link from 'next/link';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { gsap } from 'gsap';

// Import JSON data
import upcomingEventsData from '@/data/sections/home/upcomingEvents.json';

const UpcomingEventsSection = forwardRef<HTMLDivElement>((_, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  // Using 'All' as default category
  const [activeCategory] = useState<string>('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Events data from JSON
  const upcomingEvents = upcomingEventsData.events;

  // Get featured event
  const featuredEvent = upcomingEvents.find(event => event.featured);

  // Filter events based on active category
  const filteredEvents = activeCategory === 'All'
    ? upcomingEvents.filter(event => !event.featured)
    : upcomingEvents.filter(event => event.category === activeCategory && !event.featured);

  // Handle carousel navigation
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    const maxSlides = Math.ceil(filteredEvents.length / 3) - 1;
    if (currentSlide < maxSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Update carousel position when slide changes
  useEffect(() => {
    if (!carouselRef.current) return;

    gsap.to(carouselRef.current, {
      x: -currentSlide * 100 + '%',
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [currentSlide, filteredEvents]);

  // Reset current slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeCategory]);

  // Handler for image click - placeholder for future modal functionality
  const handleImageClick = (imageUrl: string, title: string) => {
    // In the future, this will open an image modal
    console.log(`Image clicked: ${title} - ${imageUrl}`);
  };

  return (
    <section
      ref={(node) => {
        // Assign to both refs
        sectionRef.current = node as HTMLDivElement | null;
        if (typeof ref === 'function') {
          ref(node as HTMLDivElement | null);
        } else if (ref) {
          ref.current = node as HTMLDivElement | null;
        }
      }}
      id={upcomingEventsData.sectionId}
      className={upcomingEventsData.sectionClasses}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-element" style={{ backgroundImage: `url(${upcomingEventsData.background.pattern.url})` }}>
        <div className={`absolute inset-0 ${upcomingEventsData.background.pattern.opacity}`}></div>
      </div>

      {/* Decorative elements */}
      {upcomingEventsData.background.decorativeElements.map((element, index) => (
        <div
          key={index}
          className={`${element.position} ${element.background} ${element.classes}`}
          data-depth={element.dataDepth}
        ></div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={upcomingEventsData.header.containerClasses}>
          <div className={upcomingEventsData.header.contentClasses}>
            <h2 className={upcomingEventsData.header.title.classes}>
              {upcomingEventsData.header.title.text}
              <span className={upcomingEventsData.header.title.underline.classes}></span>
            </h2>
            <p className={upcomingEventsData.header.description.classes}>
              {upcomingEventsData.header.description.text}
            </p>
          </div>
          <Link
            href={upcomingEventsData.header.calendarLink.href}
            className={upcomingEventsData.header.calendarLink.classes}
          >
            <CalendarIcon className={upcomingEventsData.header.calendarLink.icon.classes} />
            {upcomingEventsData.header.calendarLink.text}
          </Link>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <div className={upcomingEventsData.featuredEvent.containerClasses}>
            <div className={upcomingEventsData.featuredEvent.headerClasses}>
              <div className={upcomingEventsData.featuredEvent.headerBar.classes}></div>
              <h3 className={upcomingEventsData.featuredEvent.headerTitle.classes}>
                {upcomingEventsData.featuredEvent.headerTitle.text}
              </h3>
            </div>
            <FeaturedEvent
              id={featuredEvent.id}
              title={featuredEvent.title}
              date={featuredEvent.date}
              time={featuredEvent.time}
              location={featuredEvent.location}
              description={featuredEvent.description}
              imageUrl={featuredEvent.imageUrl}
              attendees={featuredEvent.attendees}
              category={featuredEvent.category}
            />
          </div>
        )}

        {/* Category filters - Commented out but using JSON data */}
        {/* <div className={upcomingEventsData.categories.containerClasses}>
          <div className={upcomingEventsData.categories.labelClasses}>
            <AdjustmentsHorizontalIcon className={upcomingEventsData.categories.labelIcon.classes} />
            <span className={upcomingEventsData.categories.labelText.classes}>
              {upcomingEventsData.categories.labelText.text}
            </span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${upcomingEventsData.categories.buttonClasses.base} ${
                activeCategory === category
                  ? upcomingEventsData.categories.buttonClasses.active
                  : upcomingEventsData.categories.buttonClasses.inactive
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}

        {/* Events Grid with responsive layout */}
        <div className={upcomingEventsData.eventsGrid.containerClasses}>
          {/* Desktop view - grid layout */}
          <div className={upcomingEventsData.eventsGrid.desktopClasses}>
            {filteredEvents.map((event) => (
              <div key={event.id} className={upcomingEventsData.eventsGrid.cardContainerClasses}>
                <SimpleEventCard
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  description={event.description}
                  imageUrl={event.imageUrl}
                  category={event.category}
                  onImageClick={() => handleImageClick(event.imageUrl, event.title)}
                />
              </div>
            ))}
          </div>

          {/* Mobile/Tablet view - carousel */}
          <div className={upcomingEventsData.eventsGrid.mobileCarousel.containerClasses}>
            <div
              ref={carouselRef}
              className={upcomingEventsData.eventsGrid.mobileCarousel.innerClasses}
              style={{ width: `${filteredEvents.length * 100}%` }}
            >
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={upcomingEventsData.eventsGrid.mobileCarousel.itemClasses}
                  style={{ flex: `0 0 ${100 / 3}%` }}
                >
                  <div className={upcomingEventsData.eventsGrid.cardContainerClasses}>
                    <SimpleEventCard
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      description={event.description}
                      imageUrl={event.imageUrl}
                      category={event.category}
                      onImageClick={() => handleImageClick(event.imageUrl, event.title)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel navigation */}
            {filteredEvents.length > 3 && (
              <div className={upcomingEventsData.eventsGrid.mobileCarousel.navigation.containerClasses}>
                <button
                  onClick={handlePrevSlide}
                  className={`${upcomingEventsData.eventsGrid.mobileCarousel.navigation.buttonClasses.base} ${
                    currentSlide === 0
                      ? upcomingEventsData.eventsGrid.mobileCarousel.navigation.buttonClasses.disabled
                      : upcomingEventsData.eventsGrid.mobileCarousel.navigation.buttonClasses.active
                  }`}
                  disabled={currentSlide === 0}
                >
                  <ChevronLeftIcon className={upcomingEventsData.eventsGrid.mobileCarousel.navigation.iconClasses} />
                </button>
                <button
                  onClick={handleNextSlide}
                  className={`${upcomingEventsData.eventsGrid.mobileCarousel.navigation.buttonClasses.base} ${
                    currentSlide >= Math.ceil(filteredEvents.length / 3) - 1
                      ? upcomingEventsData.eventsGrid.mobileCarousel.navigation.buttonClasses.disabled
                      : upcomingEventsData.eventsGrid.mobileCarousel.navigation.buttonClasses.active
                  }`}
                  disabled={currentSlide >= Math.ceil(filteredEvents.length / 3) - 1}
                >
                  <ChevronRightIcon className={upcomingEventsData.eventsGrid.mobileCarousel.navigation.iconClasses} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced View All Events Link - Commented out but using JSON data */}
        {/* <div className={upcomingEventsData.viewAllLink.containerClasses}>
          <Link
            href={upcomingEventsData.header.calendarLink.href}
            className={upcomingEventsData.viewAllLink.linkClasses}
          >
            <span>{upcomingEventsData.viewAllLink.text}</span>
            <svg className={upcomingEventsData.viewAllLink.icon.classes} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d={upcomingEventsData.viewAllLink.icon.path} clipRule="evenodd" />
            </svg>
          </Link>
        </div> */}
      </div>
    </section>
  );
});

UpcomingEventsSection.displayName = 'UpcomingEventsSection';

export default UpcomingEventsSection;
