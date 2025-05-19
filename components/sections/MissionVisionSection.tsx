"use client";

import React, { useRef, forwardRef, RefObject } from 'react';
import { useScrollAnimation, useCardAnimation } from '@/hooks/useGSAPAnimations';

// Import JSON data
import missionVisionData from '@/data/sections/home/missionVision.json';

const MissionVisionSection = forwardRef<HTMLDivElement>((_, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Use custom hooks for animations with immediate loading
  useScrollAnimation(sectionRef as RefObject<HTMLElement>, {
    immediate: true // Set to load immediately without scroll trigger
  });
  useCardAnimation(cardsRef as RefObject<HTMLElement>, {
    immediate: true // Set to load immediately without scroll trigger
  });
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
      className={missionVisionData.sectionClasses}
      id={missionVisionData.sectionId}>
      {/* Background pattern */}
      <div className={`absolute inset-0 ${missionVisionData.background.pattern.opacity}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("${missionVisionData.background.pattern.url}")`,
        }}></div>
      </div>

      {/* Floating decorative elements */}
      {missionVisionData.background.decorativeElements.map((element, index) => (
        <div key={index} className={element.position + " " + element.background}></div>
      ))}

      <div className="container relative z-10">
        {/* Section header */}
        <div className={missionVisionData.header.classes}>
          <span className={`section-title ${missionVisionData.header.badge.classes}`}>
            {missionVisionData.header.badge.text}
          </span>
          <h2 className={`section-title ${missionVisionData.header.title.classes}`}>
            {missionVisionData.header.title.text}
          </h2>
          <p className={`section-description ${missionVisionData.header.description.classes}`}>
            {missionVisionData.header.description.text}
          </p>

          {/* Decorative line */}
          <div className={missionVisionData.header.decorativeLine.classes}></div>
        </div>

        <div
          ref={cardsRef}
          className={missionVisionData.cards.containerClasses}
        >
          {/* Map through cards from JSON data */}
          {missionVisionData.cards.items.map((card, index) => (
            <div
              key={index}
              className={`card-item ${missionVisionData.cards.cardClasses}`}
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
                        strokeLinecap={(path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined)}
                        strokeLinejoin={(path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined)}
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
});

MissionVisionSection.displayName = 'MissionVisionSection';

export default MissionVisionSection;
