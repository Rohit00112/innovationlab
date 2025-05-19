"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Initialize GSAP animations
export const initGSAPAnimations = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return () => {};

  // Configure defaults
  gsap.config({
    nullTargetWarn: false,
  });

  // Initialize smooth scrolling
  initSmoothScroll();

  // Return cleanup function
  return () => {
    // Kill all ScrollTrigger instances to prevent memory leaks
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    // Kill all GSAP animations
    gsap.killTweensOf("*");
  };
};

// Smooth scroll function for navigation links
export const initSmoothScroll = () => {
  // Get all navigation links that point to sections on the same page
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        const target = document.querySelector(targetId);
        if (target) {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: target,
              offsetY: 80, // Account for fixed header
            },
            ease: "power3.inOut",
          });
        }
      }
    });
  });
};

// Hero section animations
export const animateHeroSection = (sectionRef: React.RefObject<HTMLElement>) => {
  if (!sectionRef.current) return;

  const section = sectionRef.current;
  const tagline = section.querySelector(".hero-tagline");
  const heading = section.querySelector(".hero-heading");
  const button = section.querySelector(".hero-button");
  const polaroids = section.querySelectorAll(".hero-polaroid");

  // Create a timeline for hero animations
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Animate hero elements
  tl.fromTo(
    tagline,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 }
  )
    .fromTo(
      heading,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.6"
    )
    .fromTo(
      button,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.6"
    );

  // Animate polaroids with staggered effect
  gsap.fromTo(
    polaroids,
    { 
      opacity: 0, 
      scale: 0.8,
      rotation: (i) => (i % 2 === 0 ? -10 : 10) 
    },
    { 
      opacity: 1, 
      scale: 1,
      rotation: (i) => (i % 2 === 0 ? -5 : 5),
      duration: 1.2,
      stagger: 0.15,
      ease: "back.out(1.7)",
      delay: 0.5
    }
  );

  // Add floating animation to polaroids
  polaroids.forEach((polaroid, index) => {
    gsap.to(polaroid, {
      y: (index % 2 === 0) ? "10" : "-10",
      rotation: (index % 2 === 0) ? "-=2" : "+=2",
      duration: 3 + index * 0.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
};

// Section fade-in animation with ScrollTrigger
export const animateSectionFadeIn = (sectionRef: React.RefObject<HTMLElement>, options = {}) => {
  if (!sectionRef.current) return;

  const section = sectionRef.current;
  const defaultOptions = {
    y: 50,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Create ScrollTrigger for the section
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    onEnter: () => {
      // Animate section title and description
      const title = section.querySelector(".section-title");
      const description = section.querySelector(".section-description");
      const elements = section.querySelectorAll(".animate-gsap");

      const tl = gsap.timeline();

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: mergedOptions.y },
          { opacity: 1, y: 0, duration: mergedOptions.duration }
        );
      }

      if (description) {
        tl.fromTo(
          description,
          { opacity: 0, y: mergedOptions.y },
          { opacity: 1, y: 0, duration: mergedOptions.duration },
          "-=0.8"
        );
      }

      if (elements.length > 0) {
        tl.fromTo(
          elements,
          { opacity: 0, y: mergedOptions.y },
          { 
            opacity: 1, 
            y: 0, 
            duration: mergedOptions.duration,
            stagger: mergedOptions.stagger,
            ease: mergedOptions.ease
          },
          "-=0.8"
        );
      }
    },
    once: true,
  });
};

// Animate cards with staggered effect
export const animateCards = (cardsRef: React.RefObject<HTMLElement>) => {
  if (!cardsRef.current) return;

  const cards = cardsRef.current.querySelectorAll(".card-item");

  ScrollTrigger.create({
    trigger: cardsRef.current,
    start: "top 80%",
    onEnter: () => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    },
    once: true,
  });
};

// Add hover animations to elements
export const addHoverAnimations = () => {
  // Buttons hover effect
  const buttons = document.querySelectorAll(".gsap-hover-button");
  
  buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
  
  // Cards hover effect
  const cards = document.querySelectorAll(".gsap-hover-card");
  
  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
};

// Parallax scrolling effect
export const createParallaxEffect = (elements: NodeListOf<Element>, speed = 0.5) => {
  elements.forEach((element) => {
    gsap.to(element, {
      y: () => -window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
};
