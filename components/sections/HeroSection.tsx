"use client";

import React, { useRef, forwardRef, RefObject } from 'react';
import AnimatedButton from '../ui/AnimatedButton';
import Image from 'next/image';
import { useHeroAnimation } from '@/hooks/useGSAPAnimations';

const HeroSection = forwardRef<HTMLDivElement>((_, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Use the enhanced hero animation hook
  useHeroAnimation(sectionRef as RefObject<HTMLElement>);

  // Polaroid images removed

  // Decorative elements removed to eliminate sparkle effects

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
      className="relative w-full min-h-screen overflow-hidden mt-20"
      id="hero-section"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home_hero.JPG"
          alt="Innovation Lab Hero Background"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
        {/* Black overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-5 z-10"></div>

      {/* Decorative elements removed to eliminate sparkle effects */}

      {/* Polaroid images removed */}

      {/* Hero content with improved spacing and visual hierarchy */}
      <div className="container relative z-40 flex flex-col items-center justify-center min-h-screen text-center pt-16 pb-32 md:pt-20 md:pb-36 lg:pt-24 lg:pb-40 px-6 md:px-8">
        <div className="flex flex-col items-center opacity-0">
          <div className="bg-[#EEAE22] text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full mb-6 md:mb-8 lg:mb-10 shadow-lg">
            <p className="text-xs md:text-sm font-medium tracking-wide">Where Ideas Get Shaped</p>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black text-white mb-6 md:mb-8 lg:mb-10 max-w-4xl leading-tight tracking-tight">
          <div className="hero-heading-line opacity-0">Innovation Lab</div>
        </h1>

        <p className="hero-heading-line text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-8 md:mb-10 lg:mb-12 opacity-0 px-4 leading-relaxed">
          At the heart of Itahari International College, the Innovation Lab is a dynamic ecosystem empowering students to transform bold ideas into real-world solutions through technology, creativity, and collaboration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <AnimatedButton
            href="https://docs.google.com/forms/d/e/1FAIpQLSfDn9Evo7cRpeGIe45MWdvbYKRB3rj8wpVjNGV5FwwFnBGPRg/viewform"
            size="lg"
            variant="primary"
            className="hero-button relative z-30 mt-2 font-bold shadow-xl bg-[#0066FF] text-white hover:bg-[#0055DD] px-8 py-3 md:px-10 md:py-4 opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            REGISTER
          </AnimatedButton>

          <AnimatedButton
            href="/events/iic-quest-3.0"
            size="lg"
            variant="secondary"
            className="hero-button relative z-30 mt-2 font-bold shadow-xl bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-3 md:px-10 md:py-4 opacity-100"
          >
            READ MORE
          </AnimatedButton>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full" preserveAspectRatio="none">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
          ></path>
        </svg>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
