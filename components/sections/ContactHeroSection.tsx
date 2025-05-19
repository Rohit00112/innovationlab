"use client";

import React, { useRef, useEffect, useState } from 'react';
// Removed unused import
// import Button from '../ui/Button';
import Image from 'next/image';
import { gsap } from 'gsap';

// Import JSON data
import heroData from '@/data/sections/contact/hero.json';

const ContactHeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Refs for button hover animations
  const sendMessageBtnRef = useRef<HTMLAnchorElement>(null);
  const findLocationBtnRef = useRef<HTMLAnchorElement>(null);

  // Store reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Button hover animation functions
  const setupButtonHoverEffects = () => {
    // Only setup if the buttons exist and if user doesn't prefer reduced motion
    if (prefersReducedMotion) return;

    // Setup for Send Message button
    if (sendMessageBtnRef.current) {
      // Create hover in animation
      sendMessageBtnRef.current.addEventListener('mouseenter', () => {
        gsap.to(sendMessageBtnRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.5)",
          boxShadow: "0 10px 25px rgba(0, 102, 255, 0.3)",
        });

        // Create a pulse effect on hover
        gsap.to(sendMessageBtnRef.current, {
          boxShadow: "0 10px 25px rgba(0, 102, 255, 0.5)",
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Create hover out animation
      sendMessageBtnRef.current.addEventListener('mouseleave', () => {
        gsap.killTweensOf(sendMessageBtnRef.current);
        gsap.to(sendMessageBtnRef.current, {
          scale: 1,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    // Setup for Find Location button
    if (findLocationBtnRef.current) {
      // Create hover in animation
      findLocationBtnRef.current.addEventListener('mouseenter', () => {
        gsap.to(findLocationBtnRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.5)",
          backgroundColor: "rgba(255, 255, 255, 0.15)"
        });

        // Create a subtle border glow effect
        gsap.to(findLocationBtnRef.current, {
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });

      // Create hover out animation
      findLocationBtnRef.current.addEventListener('mouseleave', () => {
        gsap.killTweensOf(findLocationBtnRef.current);
        gsap.to(findLocationBtnRef.current, {
          scale: 1,
          backgroundColor: "transparent",
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
  };

  // Initialize animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(reducedMotion);

    // Create a timeline for staggered animations
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: prefersReducedMotion ? 0.5 : 0.8
      }
    });

    // Animate title with a subtle effect
    // Since we want the title to be visible immediately, we'll just add a subtle animation
    if (titleRef.current) {
      const titleElement = titleRef.current;

      // Apply a subtle highlight animation instead of opacity
      tl.fromTo(
        titleElement,
        { textShadow: "0 0 0 rgba(255,255,255,0)" },
        {
          textShadow: "0 0 10px rgba(255,255,255,0.3)",
          duration: 1.2,
          ease: "power2.out"
        },
        0.2
      );

      // Add a subtle scale effect
      tl.fromTo(
        titleElement,
        { scale: 0.98 },
        {
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)"
        },
        0.2
      );
    }

    // Animate subtitle - make sure it's visible immediately
    if (subtitleRef.current) {
      // First make it visible immediately
      subtitleRef.current.style.opacity = '1';

      // Then animate it
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0.8, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.6
      );
    }

    // Animate buttons
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll('a');
      tl.fromTo(
        buttons,
        { opacity: 0, y: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.5)"
        },
        0.8
      );
    }

    // No image container or decorative elements animations needed

    // Setup button hover effects after initial animations
    setupButtonHoverEffects();

    return () => {
      // Clean up animations
      tl.kill();

      // Clean up button hover animations
      // Store refs in variables to avoid the "ref value will likely have changed" warning
      const sendMessageBtn = sendMessageBtnRef.current;
      const findLocationBtn = findLocationBtnRef.current;

      if (sendMessageBtn) {
        gsap.killTweensOf(sendMessageBtn);
      }
      if (findLocationBtn) {
        gsap.killTweensOf(findLocationBtn);
      }
    };
  }, [prefersReducedMotion, setupButtonHoverEffects]);

  return (
    <section
      ref={sectionRef}
      className={heroData.sectionClasses}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroData.content.backgroundImage.src}
          alt={heroData.content.backgroundImage.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />

        {/* Dark overlay for text readability */}
        <div className={heroData.background.overlay.classes}></div>

        {/* Subtle pattern overlay */}
        <div className={heroData.background.pattern.containerClasses}>
          <div className={heroData.background.pattern.innerClasses}></div>
        </div>
      </div>

      <div className={heroData.content.containerClasses}>
        <div className={heroData.content.wrapperClasses}>
          {/* Centered content */}
          <div className={heroData.content.mainContent.containerClasses}>
            <span className={heroData.content.mainContent.badge.classes}>
              {heroData.content.mainContent.badge.text}
            </span>
            <div className={heroData.content.mainContent.title.containerClasses}>
              <h1
                ref={titleRef}
                className={heroData.content.mainContent.title.textClasses}
              >
                {heroData.content.mainContent.title.text.split('<br />')[0]}<br />{heroData.content.mainContent.title.text.split('<br />')[1]}
              </h1>
            </div>
            <p
              ref={subtitleRef}
              className={heroData.content.mainContent.description.classes}
            >
              {heroData.content.mainContent.description.text}
            </p>
            <div
              ref={buttonsRef}
              className={heroData.content.mainContent.buttons.containerClasses}
            >
              <a
                ref={sendMessageBtnRef}
                href={heroData.content.mainContent.buttons.sendMessage.href}
                className={heroData.content.mainContent.buttons.sendMessage.classes}
              >
                {heroData.content.mainContent.buttons.sendMessage.text}
              </a>

              <a
                ref={findLocationBtnRef}
                href={heroData.content.mainContent.buttons.findLocation.href}
                className={heroData.content.mainContent.buttons.findLocation.classes}
              >
                {heroData.content.mainContent.buttons.findLocation.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;
