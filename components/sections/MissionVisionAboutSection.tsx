"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// Import JSON data
import missionVisionData from '@/data/sections/home/missionVision.json';

const MissionVisionAboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Initialize animations that play immediately on component mount
  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title and description
    const titleElements = sectionRef.current.querySelectorAll('.animate-title');
    const cardElements = sectionRef.current.querySelectorAll('.animate-card');

    // Create a timeline for the animations
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // Animate title elements
    tl.fromTo(
      titleElements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
      0
    );

    // Animate cards with staggered effect
    tl.fromTo(
      cardElements,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' },
      0.4
    );

    // Add hover animations to cards
    cardElements.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
          boxShadow: '0 15px 30px rgba(0, 102, 255, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    return () => {
      // Clean up animations
      tl.kill();
      gsap.killTweensOf([...titleElements, ...cardElements]);
    };
  }, []);

  return (
    <section ref={sectionRef} className={missionVisionData.sectionClasses}>
      {/* Background pattern */}
      <div className={`absolute inset-0 ${missionVisionData.background.pattern.opacity}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("${missionVisionData.background.pattern.url}")`,
        }}></div>
      </div>

      {/* Floating decorative elements */}
      {missionVisionData.background.decorativeElements.map((element, index) => (
        <div
          key={index}
          className={`${element.position} ${element.background} animate-float`}
          style={{ animationDelay: index === 1 ? '1.5s' : '0s' }}
        ></div>
      ))}

      <div className="container relative z-10">
        {/* Section header */}
        <div className={missionVisionData.header.classes}>
          <span className={`${missionVisionData.header.badge.classes} animate-title`}>
            {missionVisionData.header.badge.text}
          </span>
          <h2 className={`${missionVisionData.header.title.classes} animate-title`}>
            {missionVisionData.header.title.text}
          </h2>
          <p className={`${missionVisionData.header.description.classes} animate-title`}>
            {missionVisionData.header.description.text}
          </p>

          {/* Decorative line */}
          <div className={missionVisionData.header.decorativeLine.classes}></div>
        </div>

        <div ref={cardsRef} className={missionVisionData.cards.containerClasses}>
          {/* Map through cards from JSON data */}
          {missionVisionData.cards.items.map((card, index) => (
            <div
              key={index}
              className={`${missionVisionData.cards.cardClasses} hover-lift transition-all duration-500 animate-card`}
            >
              {/* Decorative elements */}
              <div className={card.decorativeElements.topBar.classes}></div>
              <div className={card.decorativeElements.topCircle.classes}></div>
              <div className={card.decorativeElements.bottomCircle.classes}></div>

              <div className="flex items-center gap-5 mb-8">
                <div className={card.header.iconContainer.classes}>
                  <svg width="32" height="32" viewBox={card.header.icon.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {card.header.icon.paths.map((path, pathIndex) => (
                      <path
                        key={pathIndex}
                        d={path.d}
                        stroke={path.stroke}
                        strokeWidth={path.strokeWidth}
                        strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                        strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      />
                    ))}
                  </svg>
                </div>
                <h2 className={card.header.title.classes}>
                  {card.header.title.text}
                  <span className={card.header.title.underline.classes}></span>
                </h2>
              </div>

              <p className={card.description.classes}>
                {card.description.text}
              </p>

              <ul className="space-y-4 text-base leading-relaxed text-[#333333] font-medium">
                {card.listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${item.checkmark.bgColor} flex items-center justify-center mr-3`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L20 7" stroke={item.checkmark.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionAboutSection;
