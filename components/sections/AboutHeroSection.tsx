"use client";

import React from 'react';
import Image from 'next/image';

// Import JSON data
import heroData from '@/data/sections/about/hero.json';

const AboutHeroSection: React.FC = () => {
  return (
    <section className={heroData.sectionClasses}>
      {/* Decorative line */}
      <div className={heroData.decorativeLine.containerClasses}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 5" className="w-full h-full">
          <defs>
            <linearGradient
              id={heroData.decorativeLine.gradient.id}
              x1={heroData.decorativeLine.gradient.x1}
              y1={heroData.decorativeLine.gradient.y1}
              x2={heroData.decorativeLine.gradient.x2}
              y2={heroData.decorativeLine.gradient.y2}
            >
              {heroData.decorativeLine.gradient.stops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.stopColor} />
              ))}
            </linearGradient>
          </defs>
          <path
            stroke={heroData.decorativeLine.path.stroke}
            strokeWidth={heroData.decorativeLine.path.strokeWidth}
            strokeDasharray={heroData.decorativeLine.path.strokeDasharray}
            d={heroData.decorativeLine.path.d}
            className={heroData.decorativeLine.path.classes}
          />
        </svg>
      </div>

      {/* Background pattern */}
      <div className={heroData.background.pattern.containerClasses}>
        <div className="absolute inset-0" style={heroData.background.pattern.style}></div>
      </div>

      {/* Floating shapes - for GSAP animations */}
      {heroData.background.floatingShapes.map((shape, index) => (
        <div key={index} className={shape.classes}></div>
      ))}

      <div className={heroData.content.containerClasses}>
        <div className={heroData.content.wrapperClasses}>
          {/* Left content */}
          <div className={heroData.content.leftContent.containerClasses}>
            <div className={heroData.content.leftContent.badge.containerClasses}>
              <span className={heroData.content.leftContent.badge.classes}>
                {heroData.content.leftContent.badge.text}
              </span>
            </div>
            <h1 className={heroData.content.leftContent.title.containerClasses}>
              <span className={heroData.content.leftContent.title.wrapperClasses}>
                {heroData.content.leftContent.title.text}
                <span className={heroData.content.leftContent.title.underline.classes}></span>
              </span>
            </h1>

            {/* Decorative element */}
            <div className={heroData.content.leftContent.decorativeElement.containerClasses}>
              {heroData.content.leftContent.decorativeElement.blobs.map((blob, index) => (
                <div key={index} className={blob.classes}></div>
              ))}
            </div>
          </div>

          {/* Right content */}
          <div className={heroData.content.rightContent.containerClasses}>
            {heroData.content.rightContent.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={paragraph.classes}
                dangerouslySetInnerHTML={{ __html: paragraph.content }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background images with improved styling */}
      <div className={heroData.background.image.containerClasses}>
        <div className={heroData.background.image.overlayClasses}></div>
        <Image
          src={heroData.background.image.src}
          alt={heroData.background.image.alt}
          fill
          className={heroData.background.image.imageClasses}
          sizes={heroData.background.image.sizes}
          priority={heroData.background.image.priority}
        />
      </div>

      {/* Decorative elements */}
      {heroData.background.decorativeElements.map((element, index) => (
        <div key={index} className={element.classes}></div>
      ))}
    </section>
  );
};

export default AboutHeroSection;
