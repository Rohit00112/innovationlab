"use client";

import React, { useState, useRef, forwardRef, RefObject } from 'react';
import TestimonialCard from '../ui/TestimonialCard';
import { useTestimonialAnimation } from '@/hooks/useGSAPAnimations';

// Import JSON data
import testimonialsData from '@/data/sections/home/testimonials.json';

const TestimonialsSection = forwardRef<HTMLDivElement>((_, ref) => {
  // Use testimonials data from JSON
  const testimonials = testimonialsData.testimonials;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Use the testimonial animation hook
  useTestimonialAnimation(sectionRef as RefObject<HTMLElement>);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cards = scrollRef.current.querySelectorAll('.testimonial-card');
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.querySelector('.testimonial-card')?.clientWidth || 0;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < testimonials.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  // Check if there's only one testimonial
  const isSingleTestimonial = testimonials.length === 1;

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
      className={testimonialsData.sectionClasses}
      id={testimonialsData.sectionId}
    >
      {/* Background gradient overlay */}
      <div className={testimonialsData.background.gradient.classes}></div>

      {/* Background pattern */}
      <div className={testimonialsData.background.pattern.classes}></div>

      {/* Floating decorative elements */}
      {testimonialsData.background.decorativeElements.map((element, index) => (
        <div key={index} className={element.classes}></div>
      ))}

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className={`${testimonialsData.header.containerClasses} max-w-3xl w-full`}>
          <h2 className={testimonialsData.header.title.classes}>
            {testimonialsData.header.title.text}
          </h2>
          <p className={testimonialsData.header.description.classes}>
            {testimonialsData.header.description.text}
          </p>
        </div>

        {isSingleTestimonial ? (
          // Single testimonial perfectly centered layout
          <div className="flex justify-center items-center w-full max-w-3xl mx-auto">
            <div className="w-full transform transition-all duration-500 hover:scale-[1.02]">
              <div className="relative mx-auto">
                {/* Decorative elements for single testimonial */}
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#0066FF]/20 to-[#5045E8]/20 blur-md"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#5045E8]/20 to-[#0066FF]/20 blur-md"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-xl -z-10"></div>

                <TestimonialCard
                  quote={testimonials[0].quote}
                  name={testimonials[0].name}
                  role={testimonials[0].role}
                  imageUrl={testimonials[0].imageUrl}
                />
              </div>
            </div>
          </div>
        ) : (
          // Multiple testimonials carousel layout
          <>
            <div
              ref={scrollRef}
              className={testimonialsData.testimonialCarousel.containerClasses}
              onScroll={handleScroll}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className={testimonialsData.testimonialCarousel.cardClasses}>
                  <TestimonialCard
                    quote={testimonial.quote}
                    name={testimonial.name}
                    role={testimonial.role}
                    imageUrl={testimonial.imageUrl}
                  />
                </div>
              ))}
            </div>

            {/* Navigation controls - only shown for multiple testimonials */}
            <div className={testimonialsData.testimonialCarousel.navigation.containerClasses}>
              {/* Navigation dots */}
              <div className={testimonialsData.testimonialCarousel.navigation.dots.containerClasses}>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`${testimonialsData.testimonialCarousel.navigation.dots.buttonClasses.base} ${
                      activeIndex === index
                        ? testimonialsData.testimonialCarousel.navigation.dots.buttonClasses.active
                        : testimonialsData.testimonialCarousel.navigation.dots.buttonClasses.inactive
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow navigation for larger screens */}
              <div className={testimonialsData.testimonialCarousel.navigation.arrows.containerClasses}>
                <button
                  onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
                  className={testimonialsData.testimonialCarousel.navigation.arrows.buttonClasses}
                  aria-label="Previous testimonial"
                  disabled={activeIndex === 0}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d={testimonialsData.testimonialCarousel.navigation.arrows.prevArrow.path}
                      stroke={testimonialsData.testimonialCarousel.navigation.arrows.prevArrow.stroke}
                      strokeWidth={testimonialsData.testimonialCarousel.navigation.arrows.prevArrow.strokeWidth}
                      strokeLinecap={testimonialsData.testimonialCarousel.navigation.arrows.prevArrow.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={testimonialsData.testimonialCarousel.navigation.arrows.prevArrow.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scrollToIndex(Math.min(testimonials.length - 1, activeIndex + 1))}
                  className={testimonialsData.testimonialCarousel.navigation.arrows.buttonClasses}
                  aria-label="Next testimonial"
                  disabled={activeIndex === testimonials.length - 1}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d={testimonialsData.testimonialCarousel.navigation.arrows.nextArrow.path}
                      stroke={testimonialsData.testimonialCarousel.navigation.arrows.nextArrow.stroke}
                      strokeWidth={testimonialsData.testimonialCarousel.navigation.arrows.nextArrow.strokeWidth}
                      strokeLinecap={testimonialsData.testimonialCarousel.navigation.arrows.nextArrow.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={testimonialsData.testimonialCarousel.navigation.arrows.nextArrow.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add custom styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: ${testimonialsData.testimonialCarousel.scrollbarStyles.hideScrollbar.msOverflowStyle};  /* IE and Edge */
          scrollbar-width: ${testimonialsData.testimonialCarousel.scrollbarStyles.hideScrollbar.scrollbarWidth};  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          ${testimonialsData.testimonialCarousel.scrollbarStyles.hideScrollbar.webkitScrollbar};  /* Chrome, Safari and Opera */
        }
      `}</style>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;
