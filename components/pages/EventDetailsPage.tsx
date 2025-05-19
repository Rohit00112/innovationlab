"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Button from '../ui/Button';
import AgendaItem from '../ui/AgendaItem';
import AgendaTable from '../ui/AgendaTable';
import AgendaTimeline from '../ui/AgendaTimeline';
import { useCountdownAnimation } from '@/hooks/useGSAPAnimations';

// Import JSON data
import heroData from '@/data/sections/eventDetails/hero.json';
import tabsData from '@/data/sections/eventDetails/tabs.json';
import aboutData from '@/data/sections/eventDetails/about.json';
import agendaData from '@/data/sections/eventDetails/agenda.json';
import subEventsData from '@/data/sections/eventDetails/subEvents.json';
import galleryData from '@/data/sections/eventDetails/gallery.json';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

interface EventDate {
  month: string;
  day: string;
  time: string;
}

interface RelatedEvent {
  id: string;
  title: string;
  date: EventDate;
  location: string;
  imageUrl: string;
}

interface SubEvent {
  id: string;
  title: string;
  description: string;
  date: EventDate | string;
  time?: string;
  location: string;
  imageUrl?: string;
  image?: string;
  category: string;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  category?: string;
  width?: number;
  height?: number;
}

// Define agenda item interface
interface AgendaItem {
  time: string;
  title: string;
  description: string;
  day?: string; // Optional day label (e.g., "Day 1")
  isHidden?: boolean; // Optional flag to indicate if the item should be initially hidden
  isSpecial?: boolean; // Optional flag for special formatting (e.g., "Hackathon Continues" all day)
}

interface EventDetailsProps {
  event: {
    id: string;
    title: string;
    tagline: string;
    date: EventDate | string;
    location: string;
    description: string;
    expectations: string[];
    imageUrl: string;
    relatedEvents: RelatedEvent[];
    subEvents?: SubEvent[]; // Optional sub-events array
    galleryImages?: GalleryImage[]; // Optional gallery images array
    agendaItems?: AgendaItem[]; // Optional agenda items array
    about?: {
      description: string;
      expectations: string;
    };
  };
}

const EventDetailsPage: React.FC<EventDetailsProps> = ({ event }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // State for lightbox/modal
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Default agenda items if not provided in the event object - based on the hackathon schedule
  const defaultAgendaItems: AgendaItem[] = [
    // Day 1 - June 11, Wednesday
    {
      time: "07:00 AM",
      title: "Participants arrival at Itahari International College",
      description: "Day 1, June 11, Wednesday",
      day: "Day 1"
    },
    {
      time: "09:30 AM",
      title: "Hackathon Theme Introduction",
      description: "Day 1, June 11, Wednesday",
      day: "Day 1"
    },
    {
      time: "12:00 PM",
      title: "Proposal Submission & Hackathon Kickoff",
      description: "Day 1, June 11, Wednesday",
      day: "Day 1"
    },

    // Day 2 - June 12, Thursday
    {
      time: "All Day",
      title: "Hackathon Continues",
      description: "Day 2, June 12, Thursday",
      day: "Day 2",
      isSpecial: true
    },

    // Day 3 - June 13, Friday
    {
      time: "07:00 AM",
      title: "Presentation & Demo Starts",
      description: "Day 3, June 13, Friday",
      day: "Day 3",
      isHidden: true
    },
    {
      time: "12:00 PM",
      title: "Submission",
      description: "Day 3, June 13, Friday",
      day: "Day 3",
      isHidden: true
    },
    {
      time: "12:30 PM",
      title: "Panel Discussion",
      description: "Day 3, June 13, Friday",
      day: "Day 3",
      isHidden: true
    },
    {
      time: "01:30 PM",
      title: "Formal & Informal Programs",
      description: "Day 3, June 13, Friday",
      day: "Day 3",
      isHidden: true
    },
    {
      time: "02:00 PM",
      title: "Winner Announcement & Prize Distribution",
      description: "Day 3, June 13, Friday",
      day: "Day 3",
      isHidden: true
    },
    {
      time: "04:00 PM",
      title: "Departure from College",
      description: "Day 3, June 13, Friday",
      day: "Day 3",
      isHidden: true
    }
  ];

  // Use event agenda items if available, otherwise use default
  const agendaItems = event.agendaItems || defaultAgendaItems;

  // Function to get all gallery images
  const getFilteredImages = () => {
    if (!event.galleryImages) return [];
    return event.galleryImages;
  };

  // Set event date for June 11 (IICQuest 3.0)
  const eventDate = new Date();
  eventDate.setMonth(5); // June is month 5 (0-indexed)
  eventDate.setDate(11);
  eventDate.setHours(0, 0, 0, 0); // Start of the day

  // Use the countdown animation hook
  useCountdownAnimation(eventDate, countdownRef as React.RefObject<HTMLElement>);

  // Enhanced animation effects
  useEffect(() => {
    // Ensure the DOM is fully loaded and visible first
    const initAnimations = () => {
      if (!headerRef.current || !contentRef.current || !tabsRef.current || !countdownRef.current) return;

      // Set initial visibility to ensure content is visible before animations
      gsap.set([
        '.event-date',
        '.event-title',
        '.event-location',
        '.event-tagline',
        '.content-section',
        '.section-title',
        '.section-text',
        '.tab-button',
        '.countdown-box',
        '.expectation-item',
        '.related-event-card',
        '.related-events-section',
        '.register-btn',
        '.share-btn',
        '.decorative-element',
        '.particle-1',
        '.particle-2',
        '.particle-3',
        '.particle-4',
        '.sub-events-icon',
        '.sub-events-title',
        '.sub-events-divider',
        '.sub-events-description',
        '.sub-events-grid',
        '.sub-event-card',
        '.sub-event-category',
        '.sub-event-title',
        '.sub-event-description',
        '.sub-event-link',
        '.sub-events-cta',
        '.cta-title',
        '.cta-description',
        '.register-cta-btn',
        '.schedule-cta-btn',
        '.decorative-element-1',
        '.decorative-element-2',
        '.gallery-icon',
        '.gallery-title',
        '.gallery-divider',
        '.gallery-description',
        '.gallery-filters',
        '.gallery-filter-btn',
        '.gallery-grid',
        '.gallery-item',
        '.gallery-category',
        '.gallery-item-title',
        '.gallery-item-description'
      ], {
        opacity: 1,
        y: 0,
        visibility: 'visible'
      });

      // Create master timeline
      const masterTimeline = gsap.timeline();

      // Header animations with staggered text
      const headerTimeline = gsap.timeline();

      // Animations for the collaboration image design
      headerTimeline
        .from('.event-info-card', {
          y: heroData.animations.headerTimeline.eventInfoCard.y,
          opacity: heroData.animations.headerTimeline.eventInfoCard.opacity,
          duration: heroData.animations.headerTimeline.eventInfoCard.duration,
          ease: heroData.animations.headerTimeline.eventInfoCard.ease
        })
        .from('.event-date', {
          opacity: heroData.animations.headerTimeline.eventDate.opacity,
          duration: heroData.animations.headerTimeline.eventDate.duration,
          ease: heroData.animations.headerTimeline.eventDate.ease
        }, heroData.animations.headerTimeline.eventDate.delay)
        .from('.event-tagline', {
          y: heroData.animations.headerTimeline.eventTagline.y,
          opacity: heroData.animations.headerTimeline.eventTagline.opacity,
          duration: heroData.animations.headerTimeline.eventTagline.duration,
          ease: heroData.animations.headerTimeline.eventTagline.ease
        }, heroData.animations.headerTimeline.eventTagline.delay)
        .from('.event-title', {
          y: heroData.animations.headerTimeline.eventTitle.y,
          opacity: heroData.animations.headerTimeline.eventTitle.opacity,
          duration: heroData.animations.headerTimeline.eventTitle.duration,
          ease: heroData.animations.headerTimeline.eventTitle.ease
        }, heroData.animations.headerTimeline.eventTitle.delay)
        .from('.event-location', {
          y: heroData.animations.headerTimeline.eventLocation.y,
          opacity: heroData.animations.headerTimeline.eventLocation.opacity,
          duration: heroData.animations.headerTimeline.eventLocation.duration,
          ease: heroData.animations.headerTimeline.eventLocation.ease
        }, heroData.animations.headerTimeline.eventLocation.delay)
        .from(['.register-btn', '.share-btn'], {
          y: heroData.animations.headerTimeline.actionButtons.y,
          opacity: heroData.animations.headerTimeline.actionButtons.opacity,
          duration: heroData.animations.headerTimeline.actionButtons.duration,
          stagger: heroData.animations.headerTimeline.actionButtons.stagger,
          ease: heroData.animations.headerTimeline.actionButtons.ease
        }, heroData.animations.headerTimeline.actionButtons.delay);

      // Add header timeline to master timeline
      masterTimeline.add(headerTimeline);

      // Tab buttons animation
      masterTimeline.from('.tab-button', {
        y: tabsData.animations.tabButtons.y,
        opacity: tabsData.animations.tabButtons.opacity,
        duration: tabsData.animations.tabButtons.duration,
        stagger: tabsData.animations.tabButtons.stagger,
        ease: tabsData.animations.tabButtons.ease
      }, tabsData.animations.tabButtons.delay);

      // Make all content sections visible immediately and animate them without scroll triggers
      // First make all content sections visible immediately
      gsap.set('.content-section', { opacity: 1, y: 0, visibility: 'visible' });

      // Animate each section with a staggered effect
      gsap.fromTo(
        '.content-section',
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
      document.querySelectorAll('.content-section').forEach((section, index) => {
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

        // Countdown elements
        const countdownBoxes = section.querySelectorAll('.countdown-box');
        if (countdownBoxes.length) {
          // Animate the entire countdown element
          gsap.fromTo(
            '.countdown-element',
            { y: 30, scale: 0.92, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.8,
              delay: delay + 0.2,
              ease: 'power3.out'
            }
          );

          // Animate each countdown number with staggered timing
          gsap.fromTo(
            '.countdown-number',
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.15,
              delay: delay + 0.3,
              ease: 'back.out(1.5)'
            }
          );

          // Add pulsing animation to countdown numbers
          gsap.to('.countdown-number', {
            scale: 1.08,
            duration: 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          });

          // Add floating animation to the background elements
          gsap.to('.countdown-element', {
            y: -15,
            duration: 4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          });
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

        // Animate Sub-Events section elements
        const subEventsIcon = section.querySelector('.sub-events-icon');
        const subEventsTitle = section.querySelector('.sub-events-title');
        const subEventsDivider = section.querySelector('.sub-events-divider');
        const subEventsDescription = section.querySelector('.sub-events-description');
        const subEventCards = section.querySelectorAll('.sub-event-card');

        // Gallery section elements
        const galleryIcon = section.querySelector('.gallery-icon');
        const galleryTitle = section.querySelector('.gallery-title');
        const galleryDivider = section.querySelector('.gallery-divider');
        const galleryDescription = section.querySelector('.gallery-description');
        const galleryFilters = section.querySelector('.gallery-filters');
        const galleryItems = section.querySelectorAll('.gallery-item');

        // Animate Sub-Events header elements
        if (subEventsIcon && subEventsTitle && subEventsDivider && subEventsDescription) {
          const headerDelay = delay + 0.3;

          // Create a sequence of animations
          gsap.fromTo(
            subEventsIcon,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: headerDelay,
              ease: 'power3.out'
            }
          );

          gsap.fromTo(
            subEventsTitle,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: headerDelay + 0.1,
              ease: 'power2.out'
            }
          );

          gsap.fromTo(
            subEventsDivider,
            { width: 0, opacity: 0 },
            {
              width: '100%',
              opacity: 1,
              duration: 0.7,
              delay: headerDelay + 0.2,
              ease: 'power1.inOut'
            }
          );

          gsap.fromTo(
            subEventsDescription,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: headerDelay + 0.3,
              ease: 'power2.out'
            }
          );
        }

        // Animate Sub-Event cards
        if (subEventCards.length) {
          gsap.fromTo(
            subEventCards,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              delay: delay + 0.5,
              ease: 'power3.out'
            }
          );

          // Add hover animations for sub-event cards
          subEventCards.forEach(card => {
            const cardElement = card as HTMLElement;
            const cardTitle = cardElement.querySelector('.sub-event-title');
            const cardImage = cardElement.querySelector('img');
            const cardCategory = cardElement.querySelector('.sub-event-category');
            const cardLink = cardElement.querySelector('.sub-event-link');

            // Add enhanced floating animation to category badges
            if (cardCategory) {
              gsap.to(cardCategory, {
                y: -5,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 0.8
              });
            }

            // Add enhanced hover animations
            cardElement.addEventListener('mouseenter', () => {
              // Animate title color
              if (cardTitle) {
                gsap.to(cardTitle, {
                  color: '#0066FF',
                  duration: 0.5,
                  ease: 'power1.inOut'
                });
              }

              // Animate image scale
              if (cardImage) {
                gsap.to(cardImage, {
                  scale: 1.08,
                  duration: 0.8,
                  ease: 'power1.out'
                });
              }

              // Animate link
              if (cardLink) {
                gsap.to(cardLink, {
                  x: 5,
                  duration: 0.5,
                  ease: 'back.out(1.2)'
                });
              }
            });

            cardElement.addEventListener('mouseleave', () => {
              // Reset title color
              if (cardTitle) {
                gsap.to(cardTitle, {
                  color: '#111827',
                  duration: 0.5,
                  ease: 'power1.inOut'
                });
              }

              // Reset image scale
              if (cardImage) {
                gsap.to(cardImage, {
                  scale: 1,
                  duration: 0.8,
                  ease: 'power1.out'
                });
              }

              // Reset link
              if (cardLink) {
                gsap.to(cardLink, {
                  x: 0,
                  duration: 0.5,
                  ease: 'power1.out'
                });
              }
            });
          });
        }



        // Animate Gallery header elements
        if (galleryIcon && galleryTitle && galleryDivider && galleryDescription) {
          const galleryDelay = delay + 0.7;

          // Create a sequence of animations
          gsap.fromTo(
            galleryIcon,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: galleryDelay,
              ease: 'power3.out'
            }
          );

          gsap.fromTo(
            galleryTitle,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: galleryDelay + 0.1,
              ease: 'power2.out'
            }
          );

          gsap.fromTo(
            galleryDivider,
            { width: 0, opacity: 0 },
            {
              width: '100%',
              opacity: 1,
              duration: 0.7,
              delay: galleryDelay + 0.2,
              ease: 'power1.inOut'
            }
          );

          gsap.fromTo(
            galleryDescription,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: galleryDelay + 0.3,
              ease: 'power2.out'
            }
          );
        }

        // Animate Gallery filter buttons
        if (galleryFilters) {
          const filterButtons = galleryFilters.querySelectorAll('.gallery-filter-btn');

          // Initial animation
          gsap.fromTo(
            filterButtons,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.1,
              delay: delay + 0.8,
              ease: 'power2.out'
            }
          );

          // Add click animation for filter buttons
          filterButtons.forEach(button => {
            button.addEventListener('click', () => {
              // Create a quick pulse animation when clicked
              gsap.fromTo(button,
                { scale: 0.95 },
                {
                  scale: 1,
                  duration: 0.4,
                  ease: 'elastic.out(1.2, 0.5)'
                }
              );
            });
          });
        }

        // Animate Gallery items
        if (galleryItems.length) {
          gsap.fromTo(
            galleryItems,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              delay: delay + 0.9,
              ease: 'power3.out'
            }
          );

          // Add hover animations for gallery items
          galleryItems.forEach(item => {
            const itemElement = item as HTMLElement;
            const itemTitle = itemElement.querySelector('.gallery-item-title');
            const itemImage = itemElement.querySelector('img');
            const itemCategory = itemElement.querySelector('.gallery-category');

            // Add subtle floating animation to category badges
            if (itemCategory) {
              gsap.to(itemCategory, {
                y: -5,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 0.8
              });
            }

            // Add enhanced hover animations
            itemElement.addEventListener('mouseenter', () => {
              // Animate image scale
              if (itemImage) {
                gsap.to(itemImage, {
                  scale: 1.08,
                  duration: 0.8,
                  ease: 'power1.out'
                });
              }

              // Animate title
              if (itemTitle) {
                gsap.from(itemTitle, {
                  y: 10,
                  duration: 0.4,
                  ease: 'power2.out'
                });
              }
            });

            itemElement.addEventListener('mouseleave', () => {
              // Reset image scale
              if (itemImage) {
                gsap.to(itemImage, {
                  scale: 1,
                  duration: 0.8,
                  ease: 'power1.out'
                });
              }
            });
          });
        }

      });

      // Make sure related events sections are visible
      const relatedEventsSections = document.querySelectorAll('.related-events-section');
      gsap.set(relatedEventsSections, {
        opacity: 1,
        visibility: 'visible',
        display: 'block'
      });

      // Animate related events sections
      relatedEventsSections.forEach((relatedEventsSection, sectionIndex) => {
        const sectionDelay = 0.2 + (sectionIndex * 0.1);
        const sectionHeader = relatedEventsSection.querySelector('.flex.flex-col.items-center');
        const relatedEventCards = relatedEventsSection.querySelectorAll('.related-event-card');

        if (sectionHeader) {
          const sectionIcon = sectionHeader.querySelector('.w-16.h-16');
          const sectionTitle = sectionHeader.querySelector('.section-title');
          const sectionDivider = sectionHeader.querySelector('.w-24.h-1');
          const sectionDescription = sectionHeader.querySelector('p');

          // Animate each element in sequence
          if (sectionIcon) {
            gsap.fromTo(
              sectionIcon,
              { scale: 0.8, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                delay: sectionDelay,
                ease: 'power2.out'
              }
            );
          }

          if (sectionTitle) {
            gsap.fromTo(
              sectionTitle,
              { y: 15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: sectionDelay + 0.1,
                ease: 'power2.out'
              }
            );
          }

          if (sectionDivider) {
            gsap.fromTo(
              sectionDivider,
              { width: 0, opacity: 0 },
              {
                width: '100%',
                opacity: 1,
                duration: 0.6,
                delay: sectionDelay + 0.2,
                ease: 'power2.out'
              }
            );
          }

          if (sectionDescription) {
            gsap.fromTo(
              sectionDescription,
              { y: 15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: sectionDelay + 0.3,
                ease: 'power2.out'
              }
            );
          }
        }

        // Animate the cards with a staggered effect
        if (relatedEventCards.length) {
          gsap.fromTo(
            relatedEventCards,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              delay: sectionDelay + 0.4,
              ease: 'power2.out'
            }
          );
        }

        // Animate the "View All Events" button
        const viewAllButton = relatedEventsSection.querySelector('.flex.justify-center a');
        if (viewAllButton) {
          gsap.fromTo(
            viewAllButton,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: sectionDelay + 0.5,
              ease: 'power2.out'
            }
          );
        }
      });

      // Animate all "View More" buttons in tab content
      const viewMoreButtons = document.querySelectorAll('.tab-pane .flex.justify-center a');
      gsap.fromTo(
        viewMoreButtons,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.5,
          ease: 'power2.out'
        }
      );

      // Add hover animations for buttons
      const buttons = document.querySelectorAll('.register-btn, .share-btn, .tab-pane .flex.justify-center a');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power1.out'
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power1.out'
          });
        });
      });

      // Add hover animations for tab buttons
      const tabButtons = document.querySelectorAll('.tab-button');
      tabButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          if (!button.classList.contains('active')) {
            gsap.to(button, {
              color: '#0066FF',
              borderColor: '#0066FF30',
              duration: 0.3
            });
          }
        });

        button.addEventListener('mouseleave', () => {
          if (!button.classList.contains('active')) {
            gsap.to(button, {
              color: '#6B7280',
              borderColor: 'transparent',
              duration: 0.3
            });
          }
        });
      });
    };

    // Run after a short delay to ensure DOM is ready and content is visible
    const timer = setTimeout(initAnimations, 100);

    return () => {
      // Clean up
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Get search params for tab persistence
  const searchParams = useSearchParams();

  // Define valid tabs
  const validTabs = ['about', 'agenda', 'sub-events', 'gallery'];

  // Active tab state - initialize with default 'about'
  const [activeTab, setActiveTab] = useState('about');

  // Effect to sync tab state with URL parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    // Only update state if the tab parameter is valid
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Effect to handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get('tab');

      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('about'); // Default to about if no valid tab in URL
      }
    };

    // Add event listener for browser navigation
    window.addEventListener('popstate', handlePopState);

    // Clean up event listener
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [validTabs]);

  // Effect to set initial URL parameter if not present - runs only once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get('tab');

      // If no tab parameter is in the URL, add the current active tab
      if (!tabParam) {
        url.searchParams.set('tab', activeTab);
        window.history.replaceState({}, '', url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle tab change with proper refresh of ScrollTrigger
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Update URL with the new tab parameter without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);

    // Immediately ensure all related events sections are visible
    document.querySelectorAll('.related-events-section').forEach((section) => {
      (section as HTMLElement).style.display = 'block';
      (section as HTMLElement).style.opacity = '1';
      (section as HTMLElement).style.visibility = 'visible';
    });

    // Give the DOM time to update before refreshing ScrollTrigger
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Force all related events sections to be visible again after tab switch
        document.querySelectorAll('.related-events-section').forEach((section) => {
          (section as HTMLElement).style.display = 'block';
          (section as HTMLElement).style.opacity = '1';
          (section as HTMLElement).style.visibility = 'visible';
        });

        // Reset the hidden agenda state when switching tabs
        if (tab === 'agenda') {
          const hiddenAgenda = document.querySelector('.hidden-agenda');
          const toggleButton = document.getElementById('toggle-agenda-btn');
          const buttonText = toggleButton?.querySelector('span');
          const buttonIcon = toggleButton?.querySelector('svg');

          if (hiddenAgenda && buttonText && buttonIcon) {
            const isExpanded = hiddenAgenda.getAttribute('data-expanded') === 'true';

            if (isExpanded) {
              // If it was expanded, make sure it stays expanded
              gsap.set(hiddenAgenda, {
                height: 'auto',
                opacity: 1
              });
            } else {
              // If it was collapsed, make sure it stays collapsed
              gsap.set(hiddenAgenda, {
                height: 0,
                opacity: 0
              });
              buttonText.textContent = 'View Full Agenda';
              gsap.set(buttonIcon, { rotation: 0 });
            }
          }
        }

        // Refresh ScrollTrigger to update animations
        ScrollTrigger.refresh();
      }
    }, 100);
  };

  // Effect to initialize the agenda toggle functionality
  useEffect(() => {
    // Initialize the hidden agenda section when the component mounts
    const hiddenAgenda = document.querySelector('.hidden-agenda');
    const toggleButton = document.getElementById('toggle-agenda-btn');

    if (hiddenAgenda && toggleButton) {
      // Make sure it's initially collapsed
      gsap.set(hiddenAgenda, {
        height: 0,
        opacity: 0
      });
      hiddenAgenda.setAttribute('data-expanded', 'false');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with event details - collaboration image design */}
      <div ref={headerRef} className={heroData.sectionClasses}>
        {/* Background image - people collaborating around laptops */}
        <div className="absolute inset-0 z-0">
          {/* Overlays */}
          {heroData.background.overlays.map((overlay, index) => (
            <div key={index} className={overlay.classes}></div>
          ))}

          {/* Background image */}
          <Image
            src={event.imageUrl || heroData.background.image.src}
            alt={heroData.background.image.alt}
            fill
            className={heroData.background.image.classes}
            priority={heroData.background.image.priority}
            quality={heroData.background.image.quality}
          />
        </div>

        {/* Content container */}
        <div className={heroData.content.containerClasses}>
          {/* Left side - Event info card */}
          <div className={heroData.content.eventInfoCard.containerClasses}>
            {/* Date box */}
            <div className={heroData.content.eventInfoCard.dateBox.containerClasses}>
              <span className={heroData.content.eventInfoCard.dateBox.monthClasses}>
                {typeof event.date === 'string'
                  ? event.date.split(' ')[0]
                  : event.date.month}
              </span>
              <span className={heroData.content.eventInfoCard.dateBox.dayClasses}>
                {typeof event.date === 'string'
                  ? event.date.split(' ')[1]?.split(',')[0] || '01'
                  : event.date.day}
              </span>
              <span className={heroData.content.eventInfoCard.dateBox.timeClasses}>
                {typeof event.date === 'string'
                  ? '00:00'
                  : event.date.time}
              </span>
            </div>

            {/* Event details */}
            <div className={heroData.content.eventInfoCard.details.containerClasses}>
              <span className={heroData.content.eventInfoCard.details.tagline.classes}>{event.tagline}</span>
              <h1 className={heroData.content.eventInfoCard.details.title.classes}>{event.title}</h1>
              <div className={heroData.content.eventInfoCard.details.location.containerClasses}>
                <svg
                  className={heroData.content.eventInfoCard.details.location.icon.classes}
                  fill="none"
                  stroke="currentColor"
                  viewBox={heroData.content.eventInfoCard.details.location.icon.viewBox}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {heroData.content.eventInfoCard.details.location.icon.paths.map((path, index) => (
                    <path
                      key={index}
                      strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      strokeWidth={path.strokeWidth}
                      d={path.d}
                    ></path>
                  ))}
                </svg>
                <span className={heroData.content.eventInfoCard.details.location.textClasses}>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className={heroData.content.actionButtons.containerClasses}>
            <Button
              href={heroData.content.actionButtons.registerButton.href}
              variant={heroData.content.actionButtons.registerButton.variant as "primary" | "secondary" | "outline" | undefined}
              size={heroData.content.actionButtons.registerButton.size as "sm" | "md" | "lg" | undefined}
              className={heroData.content.actionButtons.registerButton.classes}
              target={heroData.content.actionButtons.registerButton.target}
              rel={heroData.content.actionButtons.registerButton.rel}
            >
              {heroData.content.actionButtons.registerButton.text}
              <span className={heroData.content.actionButtons.registerButton.icon.classes}>
                {heroData.content.actionButtons.registerButton.icon.text}
              </span>
            </Button>
            <Button
              href={heroData.content.actionButtons.shareButton.href}
              variant={heroData.content.actionButtons.shareButton.variant as "primary" | "secondary" | "outline" | undefined}
              size={heroData.content.actionButtons.shareButton.size as "sm" | "md" | "lg" | undefined}
              className={heroData.content.actionButtons.shareButton.classes}
            >
              {heroData.content.actionButtons.shareButton.text}
              <svg
                className={heroData.content.actionButtons.shareButton.icon.classes}
                fill="none"
                stroke="currentColor"
                viewBox={heroData.content.actionButtons.shareButton.icon.viewBox}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap={heroData.content.actionButtons.shareButton.icon.path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                  strokeLinejoin={heroData.content.actionButtons.shareButton.icon.path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                  strokeWidth={heroData.content.actionButtons.shareButton.icon.path.strokeWidth}
                  d={heroData.content.actionButtons.shareButton.icon.path.d}
                ></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Event tabs */}
      <div ref={tabsRef} className={tabsData.sectionClasses}>
        <div className={tabsData.container.classes}>
          <div className={tabsData.tabsContainer.classes}>
            {tabsData.tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${tab.baseClasses} ${
                  activeTab === tab.id
                    ? tab.activeClasses
                    : tab.inactiveClasses
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="container mx-auto px-4 py-8 md:py-12">
        {/* Tab content container */}
        <div className="tab-content">
          {/* About tab content - active by default */}
          <div className={`tab-pane ${activeTab === aboutData?.tabId ? 'block' : 'hidden'}`}>
            {/* Event description */}
            <div className={aboutData?.sections?.[0]?.containerClasses}>
              <div className={aboutData?.sections?.[0]?.header?.containerClasses}>
                <div className={aboutData?.sections?.[0]?.header?.icon?.containerClasses}>
                  <svg
                    className={aboutData?.sections?.[0]?.header?.icon?.classes}
                    fill="none"
                    stroke="currentColor"
                    viewBox={aboutData?.sections?.[0]?.header?.icon?.viewBox}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap={aboutData?.sections?.[0]?.header?.icon?.path?.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={aboutData?.sections?.[0]?.header?.icon?.path?.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      strokeWidth={aboutData?.sections?.[0]?.header?.icon?.path?.strokeWidth}
                      d={aboutData?.sections?.[0]?.header?.icon?.path?.d}
                    ></path>
                  </svg>
                </div>
                <h2 className={aboutData?.sections?.[0]?.header?.title?.classes}>{aboutData?.sections?.[0]?.header?.title?.text}</h2>
              </div>
              <div className={aboutData?.sections?.[0]?.content?.containerClasses}>
                <p className={aboutData?.sections?.[0]?.content?.text?.classes}>
                  {event.description || event.about?.description}
                </p>
              </div>
            </div>

            {/* Eligibility Criteria section */}
            <div className="content-section mb-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 section-title">{aboutData?.sections?.[1]?.header?.title?.text || "Eligibility Criteria"}</h2>
              </div>
              <div className="pl-14">
                <div dangerouslySetInnerHTML={{ __html: event.about?.expectations || `
                  <p class="text-gray-700 leading-relaxed mb-6">
                    <span class="font-bold text-[#0066FF]">IICQuest 3.0</span> invites passionate and curious minds who are eager to explore the boundaries of innovation and technology. Therefore, <span class="font-bold">ongoing undergraduate students</span> of any discipline are <span class="font-bold">eligible to register</span>.
                  </p>
                  <h3 class="text-xl font-bold text-gray-900 mb-4">Minimum Requirements</h3>
                  <p class="text-gray-700 mb-4">To ensure a productive and competitive environment, participants are expected to have a basic understanding of the following:</p>
                  <ul class="space-y-3">
                    <li class="flex items-start">
                      <div class="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p class="text-gray-700">Participants must bring their own <span class="font-semibold">laptop and charger</span>.</p>
                    </li>
                    <li class="flex items-start">
                      <div class="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p class="text-gray-700">Familiarity with <span class="font-semibold">programming languages</span>.</p>
                    </li>
                    <li class="flex items-start">
                      <div class="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p class="text-gray-700">Basic knowledge of <span class="font-semibold">web or app development frameworks/tools</span>.</p>
                    </li>
                  </ul>
                `}} />
              </div>
            </div>

            {/* Countdown section - modern glass design */}
            <div className={aboutData?.sections?.[2]?.containerClasses || "content-section mb-16 bg-gradient-to-br from-[#5045E8] to-[#0066FF] rounded-xl p-8 shadow-lg border border-white/10 relative overflow-hidden"}>
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-8 text-center section-title relative z-10">
                {aboutData?.sections?.[2]?.header?.title?.text || "Countdown to Event Day"}
              </h2>

              {/* Modern countdown timer with glass effect */}
              <div ref={countdownRef} className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10 countdown-element">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-white/20 w-full">
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <div className="text-center px-2 md:px-4 py-2">
                      <div data-countdown="days" className="text-2xl md:text-3xl font-bold text-white mb-1">30</div>
                      <div className="text-xs md:text-sm text-white/80 uppercase tracking-wider">Days</div>
                    </div>
                    <div className="text-center px-2 md:px-4 py-2">
                      <div data-countdown="hours" className="text-2xl md:text-3xl font-bold text-white mb-1">12</div>
                      <div className="text-xs md:text-sm text-white/80 uppercase tracking-wider">Hours</div>
                    </div>
                    <div className="text-center px-2 md:px-4 py-2">
                      <div data-countdown="minutes" className="text-2xl md:text-3xl font-bold text-white mb-1">30</div>
                      <div className="text-xs md:text-sm text-white/80 uppercase tracking-wider">Minutes</div>
                    </div>
                    <div className="text-center px-2 md:px-4 py-2">
                      <div data-countdown="seconds" className="text-2xl md:text-3xl font-bold text-white mb-1">00</div>
                      <div className="text-xs md:text-sm text-white/80 uppercase tracking-wider">Seconds</div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* What to expect section */}
            <div className={aboutData?.sections?.[3]?.containerClasses || "content-section mb-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100"}>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 section-title">
                  {aboutData?.sections?.[3]?.header?.title?.text || "What to Expect?"}
                </h2>
              </div>
              <ul className="space-y-4 pl-14">
                {event.expectations && event.expectations.length > 0 ? (
                  event.expectations.map((item, index) => (
                    <li key={index} className="flex items-start expectation-item">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0066FF] text-white mr-4 flex-shrink-0 shadow-md shadow-[#0066FF]/20 expectation-icon">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700 text-lg expectation-text">{item}</p>
                    </li>
                  ))
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: event.about?.expectations || '' }} />
                )}
              </ul>
            </div>

            {/* Value Added Programs section */}
            <div className="content-section mb-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 section-title">Value Added Programs</h2>
              </div>
              <div className="pl-14 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Seminars & Conference</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Guest Speaker Session</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Panel Discussion</p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Career Development</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Job Fair</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-[#0066FF]">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Project Exhibition</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information section */}
            <div className="content-section mb-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 section-title">Contact Information</h2>
              </div>
              <div className="pl-14">
                <p className="text-gray-700 leading-relaxed mb-6">
                  For inquiries, support, and further details regarding the hackathon, participants and institutions are encouraged to reach out to the organizing team.
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Official Email</h3>
                  <p className="text-[#0066FF] font-medium text-lg mb-1">Innovation.lab@iic.edu.np</p>
                  <p className="text-gray-700">For all registration, and general queries.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Points of Contact</h3>

                  <div className="space-y-6">
                    {/* First contact person */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Mr. Nishesh Bishwas</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Phone:</span>
                            <a href="tel:+9779801597005" className="block text-[#0066FF] hover:underline">+977 9801597005</a>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Email:</span>
                            <a href="mailto:nishesh.bishwas@iic.edu.np" className="block text-[#0066FF] hover:underline">nishesh.bishwas@iic.edu.np</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second contact person */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Mr. Romy Khatri</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Phone:</span>
                            <a href="tel:+9779819092945" className="block text-[#0066FF] hover:underline">+977 9819092945</a>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Email:</span>
                            <a href="mailto:romy.khatri@iic.edu.np" className="block text-[#0066FF] hover:underline">romy.khatri@iic.edu.np</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Agenda tab content */}
          <div className={`tab-pane ${activeTab === agendaData?.tabId ? 'block' : 'hidden'}`}>
            <div className={agendaData?.containerClasses}>
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#0066FF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#5045E8]">
                  Event Itinerary
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-full mx-auto mb-6"></div>
                <div className="relative max-w-2xl mx-auto">
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-[#0066FF]/5 rounded-full -translate-x-1/2 -translate-y-1/4 blur-3xl -z-10"></div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#5045E8]/5 rounded-full translate-x-1/2 translate-y-1/4 blur-3xl -z-10"></div>

                  <p className="text-gray-700 text-center text-lg mb-12 relative z-10">
                    View the detailed schedule for our event. The agenda is subject to minor changes.
                  </p>
                </div>
              </div>

              {/* Event Itinerary */}
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Day 1 Timeline */}
                <AgendaTimeline
                  items={event.agendaItems?.filter(item => !item.isHidden && item.day === 'Day 1') || []}
                  dayTitle="Day 1"
                  dayDate="June 11, Wednesday"
                />

                {/* Day 2 Timeline */}
                <AgendaTimeline
                  items={event.agendaItems?.filter(item => !item.isHidden && item.day === 'Day 2') || []}
                  dayTitle="Day 2"
                  dayDate="June 12, Thursday"
                />
              </div>

              {/* Hidden agenda items (Day 3) */}
              <div className="hidden-agenda space-y-6 mt-8 max-w-4xl mx-auto" data-expanded="false" style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
                {/* Day 3 Timeline */}
                <AgendaTimeline
                  items={event.agendaItems?.filter(item => item.isHidden && item.day === 'Day 3') || []}
                  dayTitle="Day 3"
                  dayDate="June 13, Friday"
                />
              </div>

              {/* Toggle button for Agenda */}
              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  id="toggle-agenda-btn"
                  className="flex items-center px-8 py-3.5 bg-white border-2 border-[#0066FF] text-[#0066FF] rounded-full font-medium hover:shadow-lg hover:shadow-[#0066FF]/10 transition-all duration-300 transform hover:-translate-y-0.5 group"
                  onClick={(e) => {
                    e.preventDefault();

                    // Get the hidden agenda section and button
                    const hiddenAgenda = document.querySelector('.hidden-agenda');
                    const button = e.currentTarget;
                    const buttonText = button.querySelector('span');
                    const buttonIcon = button.querySelector('svg');

                    if (!hiddenAgenda || !buttonText || !buttonIcon) return;

                    // Check if the agenda is currently expanded
                    const isExpanded = hiddenAgenda.getAttribute('data-expanded') === 'true';

                    if (!isExpanded) {
                      // Expand the agenda
                      gsap.to(hiddenAgenda, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        onComplete: () => {
                          // Update the button text and icon
                          buttonText.textContent = 'Hide Day 3 Schedule';
                          // Rotate the icon
                          gsap.to(buttonIcon, {
                            rotation: 180,
                            duration: 0.3,
                            ease: 'power1.out'
                          });
                          // Mark as expanded
                          hiddenAgenda.setAttribute('data-expanded', 'true');

                          // Refresh ScrollTrigger to ensure related events section remains visible
                          if (typeof window !== 'undefined') {
                            ScrollTrigger.refresh();
                          }
                        }
                      });
                    } else {
                      // Collapse the agenda
                      gsap.to(hiddenAgenda, {
                        height: 0,
                        opacity: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        onComplete: () => {
                          // Update the button text and icon
                          buttonText.textContent = 'View Day 3 Schedule';
                          // Rotate the icon back
                          gsap.to(buttonIcon, {
                            rotation: 0,
                            duration: 0.3,
                            ease: 'power1.out'
                          });
                          // Mark as collapsed
                          hiddenAgenda.setAttribute('data-expanded', 'false');

                          // Refresh ScrollTrigger to ensure related events section remains visible
                          if (typeof window !== 'undefined') {
                            ScrollTrigger.refresh();
                          }
                        }
                      });
                    }
                  }}
                >
                  <span>View Day 3 Schedule</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>


          </div>

          {/* Sub-Events tab content */}
          <div className={`tab-pane ${activeTab === subEventsData?.tabId ? 'block' : 'hidden'}`}>
            {/* Sub-Events Introduction Section */}
            <div className="content-section mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 flex items-center justify-center mb-4 sub-events-icon">
                  <svg
                    className="w-8 h-8 text-[#0066FF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 sub-events-title">Talent & Innovation Showcase</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-full mx-auto mb-6"></div>
                <p className="text-gray-600 max-w-xl mx-auto sub-events-description text-lg">
                  IICQuest 3.0 features two major showcase events that bring together students, industry professionals, and the tech community. Explore these opportunities to connect, learn, and grow.
                </p>
              </div>
            </div>

            {/* Sub-Events Detailed Sections */}
            {event.subEvents && event.subEvents.length > 0 ? (
              <div className="space-y-16">
                {event.subEvents.map((subEvent, index) => (
                  <div
                    key={subEvent.id || index}
                    id={`${subEvent.id}-details`}
                    className="content-section bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Hero Banner */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={subEvent.imageUrl || `/images/${subEvent.id}.jpg`}
                        alt={subEvent.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority={index < 2}
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#0066FF] text-sm font-medium text-white mb-3 w-24 text-center">
                          {subEvent.category}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{subEvent.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>
                              {typeof subEvent.date === 'string'
                                ? subEvent.date
                                : `${subEvent.date.month} ${subEvent.date.day}, 2025`}
                              {subEvent.time ? ` • ${subEvent.time}` : ''}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            </svg>
                            <span>{subEvent.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                      {/* Description with formatted sections */}
                      <div className="prose prose-lg max-w-none">
                        {subEvent.id === 'job-fair' ? (
                          <>
                            <p className="text-gray-700 leading-relaxed mb-6">
                              Job Fair is a dedicated space for bridging the gap between emerging talent and real-world opportunities.
                              Hosted alongside the hackathon, this fair brings together top students and leading tech companies,
                              startups, and organizations from across the region.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Attend?</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <h4 className="text-lg font-bold text-[#0066FF] mb-3">For Employers</h4>
                                <p className="text-gray-700">
                                  Discover skilled candidates with real project experience, technical acumen, and collaborative
                                  spirit—all in one place.
                                </p>
                              </div>

                              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                <h4 className="text-lg font-bold text-[#5045E8] mb-3">For Students</h4>
                                <p className="text-gray-700">
                                  Get access to exclusive internship and job openings, and network directly with recruiters
                                  and company representatives.
                                </p>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect?</h3>
                            <ul className="space-y-3 mb-6">
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#0066FF] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Company booths & career counselors</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#0066FF] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>On-the-spot interview screenings</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#0066FF] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Networking opportunities with tech founders & hiring managers</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#0066FF] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Shortlisting for internships and entry-level tech roles</span>
                              </li>
                            </ul>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mt-8">
                              <p className="text-gray-700 italic">
                                Open to all final-year and interested undergraduate and graduate students.
                              </p>
                            </div>
                          </>
                        ) : subEvent.id === 'project-exhibition' ? (
                          <>
                            <p className="text-gray-700 leading-relaxed mb-6">
                              The Project Exhibition at IICQuest 3.0 celebrates the creativity, hard work, and technical prowess of
                              graduating students. This platform allows students to present their academic projects to a wide audience,
                              including peers, faculty, industry professionals, and recruiters.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
                            <ul className="space-y-3 mb-8">
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#5045E8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Live project demonstrations and prototypes</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#5045E8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Interactive Q&A sessions with industry experts</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#5045E8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Real-time feedback and improvement suggestions</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#5045E8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Opportunities for collaboration and networking</span>
                              </li>
                              <li className="flex items-start">
                                <svg className="w-5 h-5 text-[#5045E8] mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Recognition for outstanding and socially impactful projects</span>
                              </li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Visit?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center">
                                <svg className="w-10 h-10 text-[#5045E8] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                                <p className="text-gray-700">Get inspired by student-led innovation</p>
                              </div>
                              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center">
                                <svg className="w-10 h-10 text-[#5045E8] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-gray-700">Discover practical solutions to real-world problems</p>
                              </div>
                              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center">
                                <svg className="w-10 h-10 text-[#5045E8] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <p className="text-gray-700">Connect with the next generation of innovators and problem solvers</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-700 leading-relaxed">{subEvent.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-section bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#0066FF]/10 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sub-Events Available</h3>
                <p className="text-gray-600 max-w-lg mx-auto">
                  There are currently no sub-events scheduled for this event. Please check back later for updates.
                </p>
              </div>
            )}


          </div>

          {/* Gallery tab content */}
          <div className={`tab-pane ${activeTab === galleryData?.tabId ? 'block' : 'hidden'}`}>
            <div className={galleryData?.containerClasses}>
              {/* Decorative elements - fixed positioning */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="fixed-size-circle absolute top-0 right-0 bg-[#0066FF]/5 rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl"></div>
                <div className="fixed-size-circle absolute bottom-0 left-0 bg-[#5045E8]/5 rounded-full translate-y-1/4 -translate-x-1/4 blur-3xl"></div>
                <div className="fixed-size-circle absolute top-1/2 left-1/2 bg-gradient-to-br from-[#0066FF]/3 to-[#5045E8]/3 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

                {/* Subtle pattern overlay with fixed size */}
                <div className="absolute inset-0 opacity-5"
                     style={{
                       backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%230066FF\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                       backgroundSize: '20px 20px'
                     }}>
                </div>
              </div>

              <div className={galleryData?.header?.containerClasses}>
                <div className={galleryData?.header?.icon?.containerClasses}>
                  <svg
                    className={galleryData?.header?.icon?.classes}
                    fill="none"
                    stroke="currentColor"
                    viewBox={galleryData?.header?.icon?.viewBox}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap={galleryData?.header?.icon?.path?.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={galleryData?.header?.icon?.path?.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      strokeWidth={galleryData?.header?.icon?.path?.strokeWidth}
                      d={galleryData?.header?.icon?.path?.d}
                    ></path>
                  </svg>
                </div>
                <h2 className={galleryData?.header?.title?.classes}>{galleryData?.header?.title?.text}</h2>
                <div className={galleryData?.header?.divider?.classes}></div>
                <p className={galleryData?.header?.description?.classes}>
                  {galleryData?.header?.description?.text}
                </p>
              </div>

              {/* Gallery Grid */}
              <div ref={galleryRef} className={galleryData?.grid?.containerClasses}>
                {event.galleryImages && event.galleryImages.length > 0 ? (
                  // Get filtered images based on active filter
                  getFilteredImages().length > 0 ? (
                    // Map through the filtered gallery images
                    getFilteredImages().map((image) => (
                      <div
                        key={image.id}
                        className={galleryData?.grid?.item?.containerClasses}
                        onClick={() => {
                          setSelectedImage(image);
                          setLightboxOpen(true);
                        }}
                      >
                        <div className={galleryData?.grid?.item?.imageContainer?.classes}>
                          <Image
                            src={image.imageUrl}
                            alt={image.title}
                            fill
                            className={galleryData?.grid?.item?.image?.classes}
                            sizes={galleryData?.grid?.item?.image?.sizes}
                            quality={95}
                          />

                          <div className={galleryData?.grid?.item?.overlay?.classes}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // This case should never happen now, but keeping a simplified version
                    <div className="col-span-full text-center py-16">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#0066FF]/10 to-[#5045E8]/10 flex items-center justify-center mb-6 shadow-inner">
                        <svg className="w-12 h-12 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Images Found</h3>
                      <p className="text-gray-600 max-w-md mx-auto text-lg">
                        No images are currently available.
                      </p>
                    </div>
                  )
                ) : (
                  // Fallback content if no gallery images exist
                  <div className="col-span-full text-center py-16">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#0066FF]/10 to-[#5045E8]/10 flex items-center justify-center mb-6 shadow-inner">
                      <svg className="w-12 h-12 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Gallery Images Available</h3>
                    <p className="text-gray-600 max-w-md mx-auto text-lg">
                      Photos from the event will be available here after the event concludes. Check back later for updates.
                    </p>
                  </div>
                )}
              </div>


            </div>

            {/* Lightbox/Modal for Gallery Images */}
            {lightboxOpen && selectedImage && (
              <div
                className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm ${galleryData?.lightbox?.containerClasses}`}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
                onClick={(e) => {
                  // Close modal when clicking outside the content
                  if (e.target === e.currentTarget) {
                    setLightboxOpen(false);
                  }
                }}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#0066FF]/10 blur-3xl"></div>
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#5045E8]/10 blur-3xl"></div>
                </div>

                <div
                  className={galleryData?.lightbox?.contentClasses}
                  ref={(el) => {
                    // Animate the modal when it appears
                    if (el && typeof window !== 'undefined') {
                      gsap.from(el, {
                        y: galleryData?.animations?.lightbox?.open?.scale ? 50 : 0,
                        opacity: galleryData?.animations?.lightbox?.open?.opacity || 0,
                        scale: galleryData?.animations?.lightbox?.open?.scale || 1,
                        duration: galleryData?.animations?.lightbox?.open?.duration || 0.5,
                        ease: galleryData?.animations?.lightbox?.open?.ease || 'power3.out'
                      });
                    }
                  }}
                >
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-xl hover:scale-110 transform"
                    onClick={() => setLightboxOpen(false)}
                    aria-label="Close modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  {/* Image container with auto height */}
                  <div className={galleryData?.lightbox?.imageContainer?.classes}>
                    <div className="relative w-full max-h-[80vh] flex items-center justify-center p-4">
                      <div className="relative" style={{ maxWidth: '100%', maxHeight: '80vh' }}>
                        <Image
                          src={selectedImage.imageUrl}
                          alt={selectedImage.title}
                          width={1200}
                          height={800}
                          className="object-contain max-h-[80vh] transition-opacity duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                          quality={100}
                          priority
                        />
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
