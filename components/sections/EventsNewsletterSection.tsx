"use client";

import React, { useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { gsap } from 'gsap';

// Import JSON data
import newsletterData from '@/data/sections/events/newsletter.json';

const EventsNewsletterSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      // Animate the form with a subtle float effect
      gsap.to(formRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Animate the decorative elements
      const decorativeElements = sectionRef.current.querySelectorAll('.decorative-element');
      decorativeElements.forEach((element) => {
        gsap.to(element, {
          y: gsap.utils.random(-8, 8),
          x: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 1)
        });
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    alert('Subscription successful! Thank you for subscribing to our newsletter.');
  };

  return (
    <section ref={sectionRef} className={newsletterData.sectionClasses}>
      {/* Background pattern */}
      <div className={newsletterData.background.pattern.containerClasses}>
        <div className="absolute inset-0" style={newsletterData.background.pattern.style}></div>
      </div>

      {/* Floating decorative elements */}
      {newsletterData.background.decorativeElements.map((element, index) => (
        <div key={index} className={element.classes}></div>
      ))}

      <div className={newsletterData.content.containerClasses}>
        <div className={newsletterData.content.wrapperClasses}>
          <h2 className={newsletterData.content.title.classes}>
            {newsletterData.content.title.text}
          </h2>
          <p className={newsletterData.content.description.classes}>
            {newsletterData.content.description.text}
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className={newsletterData.content.form.containerClasses}>
            <div className={newsletterData.content.form.inputContainer.classes}>
              <input
                type={newsletterData.content.form.input.type}
                placeholder={newsletterData.content.form.input.placeholder}
                className={newsletterData.content.form.input.classes}
                required={newsletterData.content.form.input.required}
                aria-label="Email address"
              />
              <Button
                variant={newsletterData.content.form.button.variant as "primary" | "secondary" | "outline" | undefined}
                size={newsletterData.content.form.button.size as "sm" | "md" | "lg" | undefined}
                className={newsletterData.content.form.button.classes}
                type="submit"
              >
                {newsletterData.content.form.button.text}
              </Button>
            </div>
            <p className={newsletterData.content.form.disclaimer.classes}>
              {newsletterData.content.form.disclaimer.text}
            </p>
          </form>

          <div ref={featuresRef} className={newsletterData.content.features.containerClasses}>
            {newsletterData.content.features.items.map((feature, index) => (
              <div key={index} className={feature.containerClasses}>
                <div className={feature.icon.containerClasses}>
                  <svg
                    width={feature.icon.svg.width}
                    height={feature.icon.svg.height}
                    viewBox={feature.icon.svg.viewBox}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d={feature.icon.svg.path.d}
                      stroke={feature.icon.svg.path.stroke}
                      strokeWidth={feature.icon.svg.path.strokeWidth}
                      strokeLinecap={feature.icon.svg.path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={feature.icon.svg.path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                    />
                  </svg>
                </div>
                <h3 className={feature.title.classes}>
                  {feature.title.text}
                </h3>
                <p className={feature.description.classes}>
                  {feature.description.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsNewsletterSection;
