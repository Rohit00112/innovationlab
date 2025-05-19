"use client";

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Hook for animating elements on scroll with advanced options
export const useScrollAnimation = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  options = {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out',
    threshold: 0.1,
    once: true,
    delay: 0,
    markers: false, // For debugging
    immediate: false, // Whether to play animations immediately without scroll trigger
  }
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const items = element.querySelectorAll('.animate-gsap');

    // Set initial state
    gsap.set(items, { opacity: 0, y: options.y });

    // Create a timeline for the section
    const tl = gsap.timeline({
      paused: !options.immediate, // Only pause if not immediate
      defaults: { ease: options.ease }
    });

    // Add animations to the timeline
    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: options.duration,
      stagger: options.stagger,
      delay: options.delay,
    });

    // Create ScrollTrigger only if not immediate
    if (!options.immediate) {
      ScrollTrigger.create({
        trigger: element,
        start: `top ${(1 - options.threshold) * 100}%`,
        markers: options.markers,
        onEnter: () => {
          tl.play();
        },
        onLeaveBack: !options.once
          ? () => {
              tl.reverse();
            }
          : undefined,
        once: options.once,
      });
    }

    return () => {
      // Clean up
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [elementRef, options]);
};

// Hook for hero section animations with enhanced effects
export const useHeroAnimation = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const taglineElement = element.querySelector('.hero-tagline');
    const tagline = taglineElement ? taglineElement.parentElement : null;
    const headingLines = element.querySelectorAll('.hero-heading-line');
    const buttons = element.querySelectorAll('.hero-button');
    const decorativeElements = element.querySelectorAll('.hero-decorative-element');
    const backgroundGradient = element.querySelector('.hero-bg-gradient');

    // Create a master timeline for hero animations with improved easing
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Start floating animations after the main sequence completes
        animateFloatingElements();
      }
    });

    // Optional background animation
    if (backgroundGradient) {
      tl.fromTo(
        backgroundGradient,
        { opacity: 0 },
        { opacity: 1, duration: 1.5 },
        0
      );
    }

    // Animate tagline container with improved timing
    if (tagline) {
      tl.fromTo(
        tagline,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        0.3
      );
    }

    // Animate each line of heading text separately with precise staggered timing
    headingLines.forEach((line, index) => {
      tl.fromTo(
        line,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        },
        0.5 + (index * 0.2) // Staggered timing with 0.2s delay between lines
      );
    });

    // Animate buttons with slight bounce effect and staggered timing
    if (buttons.length > 0) {
      // First ensure buttons are visible
      gsap.set(buttons, { opacity: 1, visibility: 'visible' });

      // Then animate them with staggered timing
      tl.fromTo(
        buttons,
        { y: 30 },
        {
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)'
        },
        1.5 // Start after heading animations
      );
    }

    // Decorative elements animation removed to eliminate sparkle effects

    // Polaroid animations removed

    // Function to handle floating animations
    const animateFloatingElements = () => {
      // Floating animations for polaroids removed

      // Floating animation for decorative elements removed to eliminate sparkle effects
    };

    return () => {
      // Clean up all animations
      tl.kill();
      gsap.killTweensOf(decorativeElements);
    };
  }, [elementRef]);
};

// Hook for card animations with enhanced effects
export const useCardAnimation = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  options = {
    immediate: false, // Whether to play animations immediately without scroll trigger
  }
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const cards = element.querySelectorAll('.card-item');
    const sectionTitle = element.querySelector('.section-title');
    const sectionDescription = element.querySelector('.section-description');

    // Create a master timeline for the section
    const tl = gsap.timeline({
      paused: !options.immediate, // Only pause if not immediate
      defaults: { ease: 'power3.out' }
    });

    // Add section title and description animations if they exist
    if (sectionTitle) {
      tl.fromTo(
        sectionTitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0
      );
    }

    if (sectionDescription) {
      tl.fromTo(
        sectionDescription,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.2
      );
    }

    // Set initial state for cards
    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transformOrigin: 'center bottom'
    });

    // Add card animations to the timeline with staggered effect
    tl.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)',
    }, 0.4);

    // If not immediate, create ScrollTrigger
    if (!options.immediate) {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        // end: 'bottom 20%',
        // scrub: 0.5, // Uncomment for scroll-based animation
        onEnter: () => {
          tl.play();
        },
        once: true,
        // markers: true, // Uncomment for debugging
      });
    }

    // Add hover animations to cards
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
          boxShadow: '0 10px 25px rgba(0, 102, 255, 0.15)',
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
      // Clean up
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });

      // Remove event listeners
      cards.forEach((card) => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, [elementRef]);
};

// Hook for enhanced hover animations with multiple element types
export const useHoverAnimations = () => {
  useEffect(() => {
    // Enhanced buttons hover effect
    const buttons = document.querySelectorAll('.gsap-hover-button');

    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          boxShadow: '0 8px 20px rgba(0, 102, 255, 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        });

        // Animate any child icons or arrows
        const icon = button.querySelector('svg');
        if (icon) {
          gsap.to(icon, {
            x: 5,
            duration: 0.2,
            ease: 'power1.out',
          });
        }
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: '0 4px 10px rgba(0, 102, 255, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });

        // Reset icon animation
        const icon = button.querySelector('svg');
        if (icon) {
          gsap.to(icon, {
            x: 0,
            duration: 0.2,
            ease: 'power1.out',
          });
        }
      });

      // Add click animation
      button.addEventListener('mousedown', () => {
        gsap.to(button, {
          scale: 0.98,
          duration: 0.1,
          ease: 'power2.out',
        });
      });

      button.addEventListener('mouseup', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.1,
          ease: 'power2.out',
        });
      });
    });

    // Enhanced cards hover effect with depth
    const cards = document.querySelectorAll('.gsap-hover-card');

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          boxShadow: '0 15px 30px rgba(0, 102, 255, 0.15)',
          duration: 0.4,
          ease: 'power3.out',
        });

        // Animate card content if present
        const cardTitle = card.querySelector('h3, h4');
        const cardImage = card.querySelector('img');
        const cardButton = card.querySelector('.program-card-button');

        if (cardTitle) {
          gsap.to(cardTitle, {
            color: '#0066FF',
            duration: 0.3,
          });
        }

        if (cardImage) {
          gsap.to(cardImage, {
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out',
          });
        }

        if (cardButton) {
          gsap.to(cardButton, {
            x: 5,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.4,
          ease: 'power3.out',
        });

        // Reset card content animations
        const cardTitle = card.querySelector('h3, h4');
        const cardImage = card.querySelector('img');
        const cardButton = card.querySelector('.program-card-button');

        if (cardTitle) {
          gsap.to(cardTitle, {
            color: '#333333',
            duration: 0.3,
          });
        }

        if (cardImage) {
          gsap.to(cardImage, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }

        if (cardButton) {
          gsap.to(cardButton, {
            x: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });
    });

    // Testimonial cards hover effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: '0 12px 30px rgba(0, 102, 255, 0.12)',
          duration: 0.4,
          ease: 'power2.out',
        });

        // Animate quote mark if present
        const quoteMark = card.querySelector('.quote-mark');
        if (quoteMark) {
          gsap.to(quoteMark, {
            opacity: 0.3,
            scale: 1.2,
            rotation: 10,
            duration: 0.4,
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
          duration: 0.4,
          ease: 'power2.out',
        });

        // Reset quote mark animation
        const quoteMark = card.querySelector('.quote-mark');
        if (quoteMark) {
          gsap.to(quoteMark, {
            opacity: 0.1,
            scale: 1,
            rotation: 0,
            duration: 0.4,
          });
        }
      });
    });

    return () => {
      // Clean up (no need to remove event listeners as elements will be destroyed)
      // But we can kill any ongoing animations
      gsap.killTweensOf('.gsap-hover-button, .gsap-hover-card, .testimonial-card');
    };
  }, []);
};

// Hook for testimonial carousel animations
export const useTestimonialAnimation = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const testimonials = element.querySelectorAll('.testimonial-card');
    const sectionTitle = element.querySelector('.section-title');
    const sectionDescription = element.querySelector('.section-description');
    const controls = element.querySelectorAll('.carousel-control');

    // Create a master timeline for the section
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    // Add section title and description animations
    if (sectionTitle) {
      tl.fromTo(
        sectionTitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0
      );
    }

    if (sectionDescription) {
      tl.fromTo(
        sectionDescription,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.2
      );
    }

    // Set initial state for testimonials
    gsap.set(testimonials, {
      opacity: 0,
      y: 40,
      scale: 0.95
    });

    // Add testimonial animations to the timeline with staggered effect
    tl.to(testimonials, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)',
    }, 0.4);

    // Animate controls if they exist
    if (controls.length > 0) {
      gsap.set(controls, { opacity: 0, y: 20 });

      tl.to(controls, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.8);
    }

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        tl.play();
      },
      once: true,
    });

    // Add subtle floating animation to testimonials
    testimonials.forEach((testimonial, index) => {
      gsap.to(testimonial, {
        y: index % 2 === 0 ? '5' : '-5',
        duration: 3 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1,
      });
    });

    return () => {
      // Clean up
      tl.kill();
      gsap.killTweensOf(testimonials);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [elementRef]);
};

// Hook for core values section animations
export const useCoreValuesAnimation = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const valueCards = element.querySelectorAll('.value-card');
    const sectionTitle = element.querySelector('.section-title');
    const sectionDescription = element.querySelector('.section-description');
    const highlightBox = element.querySelector('.mt-20'); // The innovation approach highlight box
    const tags = element.querySelectorAll('.px-4.py-2.bg-white.rounded-full');
    const indicators = element.querySelectorAll('.w-12.h-1.bg-gray-200');

    // Create a master timeline for the section
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    // Add section title and description animations
    if (sectionTitle) {
      tl.fromTo(
        sectionTitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0
      );
    }

    if (sectionDescription) {
      tl.fromTo(
        sectionDescription,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.2
      );
    }

    // Set initial state for value cards
    gsap.set(valueCards, {
      opacity: 0,
      y: 40,
      scale: 0.95
    });

    // Add value card animations to the timeline with staggered effect
    tl.to(valueCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)',
    }, 0.6);

    // Animate indicators with a delay
    if (indicators.length) {
      gsap.set(indicators, { width: 0 });
      tl.to(indicators, {
        width: 48, // 12rem
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.inOut',
      }, 1.2);
    }

    // Animate the highlight box if it exists
    if (highlightBox) {
      gsap.set(highlightBox, { opacity: 0, y: 40 });
      tl.to(highlightBox, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
      }, 1.4);

      // Animate tags with a staggered effect
      if (tags.length) {
        gsap.set(tags, { opacity: 0, scale: 0.8, y: 10 });
        tl.to(tags, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        }, 1.8);
      }
    }

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        tl.play();
      },
      once: true,
    });

    // Add enhanced hover animations to value cards
    valueCards.forEach((card) => {
      const iconContainer = card.querySelector('.icon-container');
      const cardTitle = card.querySelector('h3');
      const indicator = card.querySelector('.w-12.h-1');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
          boxShadow: '0 15px 30px rgba(0, 102, 255, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });

        // Animate card icon if present
        if (iconContainer) {
          gsap.to(iconContainer, {
            scale: 1.1,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            duration: 0.3,
          });
        }

        // Animate title
        if (cardTitle) {
          gsap.to(cardTitle, {
            color: '#0066FF',
            duration: 0.3,
          });
        }

        // Animate indicator
        if (indicator) {
          gsap.to(indicator, {
            backgroundColor: '#0066FF',
            width: 64, // Expand on hover
            duration: 0.3,
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });

        // Reset card icon animation
        if (iconContainer) {
          gsap.to(iconContainer, {
            scale: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            duration: 0.3,
          });
        }

        // Reset title color
        if (cardTitle) {
          gsap.to(cardTitle, {
            color: '#1f2937', // gray-900
            duration: 0.3,
          });
        }

        // Reset indicator
        if (indicator) {
          gsap.to(indicator, {
            backgroundColor: '#e5e7eb', // gray-200
            width: 48,
            duration: 0.3,
          });
        }
      });
    });

    // Add subtle floating animation to the highlight box
    if (highlightBox) {
      gsap.to(highlightBox, {
        y: '-8px',
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });
    }

    return () => {
      // Clean up
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });

      // Kill any ongoing animations
      gsap.killTweensOf(valueCards);
      gsap.killTweensOf(highlightBox);
      gsap.killTweensOf(tags);
      gsap.killTweensOf(indicators);

      // Remove event listeners
      valueCards.forEach((card) => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, [elementRef]);
};

// Hook for About page section animations with staggered text and floating elements
export const useAboutPageAnimations = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  options = {
    staggerDelay: 0.25, // 0.2-0.3s delay between elements
    floatRange: 10, // ±10px range for floating animations
    textDuration: 0.8,
    floatDuration: 3,
    threshold: 0.15,
    once: true,
    immediate: false, // Whether to play animations immediately without scroll trigger
  }
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Select all text elements to animate
    const headings = element.querySelectorAll('.animate-heading');
    const paragraphs = element.querySelectorAll('.animate-text');
    const decorativeElements = element.querySelectorAll('.decorative-element');
    const stats = element.querySelectorAll('.animate-stat');
    const buttons = element.querySelectorAll('.animate-button');
    const images = element.querySelectorAll('.animate-image');

    // Create a master timeline for the section
    const tl = gsap.timeline({
      paused: !options.immediate, // Only pause if not immediate
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Start floating animations after the main sequence completes
        if (decorativeElements.length > 0) {
          animateFloatingElements();
        }
      }
    });

    // Animate headings with staggered timing
    if (headings.length > 0) {
      tl.fromTo(
        headings,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'power2.out'
        },
        0
      );
    }

    // Animate paragraphs with staggered timing
    if (paragraphs.length > 0) {
      tl.fromTo(
        paragraphs,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'power2.out'
        },
        0.3
      );
    }

    // Animate stats with staggered timing
    if (stats.length > 0) {
      tl.fromTo(
        stats,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'back.out(1.2)'
        },
        0.6
      );
    }

    // Animate buttons
    if (buttons.length > 0) {
      tl.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: 0.15,
          ease: 'back.out(1.2)'
        },
        0.8
      );
    }

    // Animate images
    if (images.length > 0) {
      tl.fromTo(
        images,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: options.textDuration * 1.2,
          stagger: 0.2,
          ease: 'power2.out'
        },
        0.4
      );
    }

    // Function to handle floating animations for decorative elements
    const animateFloatingElements = () => {
      if (decorativeElements.length === 0) return;

      decorativeElements.forEach((element, index) => {
        // Create random but controlled floating animation
        const yDistance = (index % 2 === 0 ? 1 : -1) * (5 + (index % 3) * 2); // Varies between ±5-±10px
        const xDistance = (index % 3 === 0 ? 1 : -1) * (3 + (index % 2) * 3); // Varies between ±3-±9px
        const rotationAmount = (index % 2 === 0 ? -1 : 1) * (index % 3 + 1); // Varies between ±1-±3 degrees

        gsap.to(element, {
          y: yDistance,
          x: xDistance,
          rotation: rotationAmount,
          duration: options.floatDuration + (index * 0.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2
        });
      });
    };

    // Create ScrollTrigger only if not immediate
    if (!options.immediate) {
      ScrollTrigger.create({
        trigger: element,
        start: `top ${(1 - options.threshold) * 100}%`,
        onEnter: () => {
          tl.play();
        },
        onLeaveBack: !options.once
          ? () => {
              tl.reverse();
            }
          : undefined,
        once: options.once,
      });
    }

    return () => {
      // Clean up
      tl.kill();
      gsap.killTweensOf(decorativeElements);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [elementRef, options]);
};

// Hook for Events page animations with staggered text and floating elements
export const useEventsPageAnimations = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  options = {
    staggerDelay: 0.25, // 0.2-0.3s delay between elements
    floatRange: 10, // ±10px range for floating animations
    textDuration: 0.8,
    floatDuration: 3,
    threshold: 0.15,
    once: true,
  }
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Select all text elements to animate
    const headings = element.querySelectorAll('.animate-heading');
    const paragraphs = element.querySelectorAll('.animate-text');
    const decorativeElements = element.querySelectorAll('.decorative-element');
    const stats = element.querySelectorAll('.animate-stat');
    const buttons = element.querySelectorAll('.animate-button');
    const images = element.querySelectorAll('.animate-image');
    const cards = element.querySelectorAll('.animate-card');

    // Create a master timeline for the section
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Start floating animations after the main sequence completes
        if (decorativeElements.length > 0) {
          animateFloatingElements();
        }
      }
    });

    // Animate headings with staggered timing
    if (headings.length > 0) {
      tl.fromTo(
        headings,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'power2.out'
        },
        0
      );
    }

    // Animate paragraphs with staggered timing
    if (paragraphs.length > 0) {
      tl.fromTo(
        paragraphs,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'power2.out'
        },
        0.3
      );
    }

    // Animate stats with staggered timing
    if (stats.length > 0) {
      tl.fromTo(
        stats,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'back.out(1.2)'
        },
        0.6
      );
    }

    // Animate buttons
    if (buttons.length > 0) {
      tl.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: 0.15,
          ease: 'back.out(1.2)'
        },
        0.8
      );
    }

    // Animate images
    if (images.length > 0) {
      tl.fromTo(
        images,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: options.textDuration * 1.2,
          stagger: 0.2,
          ease: 'power2.out'
        },
        0.4
      );
    }

    // Animate cards
    if (cards.length > 0) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'back.out(1.2)'
        },
        0.5
      );
    }

    // Function to handle floating animations for decorative elements
    const animateFloatingElements = () => {
      if (decorativeElements.length === 0) return;

      decorativeElements.forEach((element, index) => {
        // Create random but controlled floating animation
        const yDistance = (index % 2 === 0 ? 1 : -1) * (5 + (index % 3) * 2); // Varies between ±5-±10px
        const xDistance = (index % 3 === 0 ? 1 : -1) * (3 + (index % 2) * 3); // Varies between ±3-±9px
        const rotationAmount = (index % 2 === 0 ? -1 : 1) * (index % 3 + 1); // Varies between ±1-±3 degrees

        gsap.to(element, {
          y: yDistance,
          x: xDistance,
          rotation: rotationAmount,
          duration: options.floatDuration + (index * 0.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2
        });
      });
    };

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: `top ${(1 - options.threshold) * 100}%`,
      onEnter: () => {
        tl.play();
      },
      onLeaveBack: !options.once
        ? () => {
            tl.reverse();
          }
        : undefined,
      once: options.once,
    });

    return () => {
      // Clean up
      tl.kill();
      gsap.killTweensOf(decorativeElements);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [elementRef, options]);
};

// Hook for Events hero section with timeline-based sequential animations
export const useEventsHeroAnimation = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const tagline = element.querySelector('.hero-tagline');
    const heading = element.querySelector('.hero-heading');
    const description = element.querySelector('.hero-description');
    const buttons = element.querySelectorAll('.hero-button');
    const heroImage = element.querySelector('.hero-image');
    const decorativeElements = element.querySelectorAll('.decorative-element');
    const backgroundElements = element.querySelectorAll('.bg-element');

    // Create a master timeline for hero animations
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Start floating animations after the main sequence completes
        animateFloatingElements();
      }
    });

    // Animate background elements if they exist
    if (backgroundElements.length > 0) {
      tl.fromTo(
        backgroundElements,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0
      );
    }

    // Animate tagline with improved timing
    if (tagline) {
      tl.fromTo(
        tagline,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.3
      );
    }

    // Animate heading
    if (heading) {
      tl.fromTo(
        heading,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.5
      );
    }

    // Animate description
    if (description) {
      tl.fromTo(
        description,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      );
    }

    // Animate buttons with staggered timing
    if (buttons.length > 0) {
      tl.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'back.out(1.2)'
        },
        0.9
      );
    }

    // Animate hero image with slight bounce effect
    if (heroImage) {
      tl.fromTo(
        heroImage,
        { opacity: 0, scale: 0.9, x: 30 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: 'back.out(1.2)'
        },
        0.7
      );
    }

    // Animate decorative elements if they exist
    if (decorativeElements.length > 0) {
      tl.fromTo(
        decorativeElements,
        {
          opacity: 0,
          scale: 0.8,
          y: (i) => i % 2 === 0 ? 30 : -30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out'
        },
        1.1
      );
    }

    // Function to handle floating animations
    const animateFloatingElements = () => {
      // Add floating animation to decorative elements if they exist
      if (decorativeElements.length > 0) {
        decorativeElements.forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? '10' : '-10',
            x: index % 3 === 0 ? '8' : index % 3 === 1 ? '-8' : '0',
            rotation: index % 2 === 0 ? '-=2' : '+=2',
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          });
        });
      }
    };

    return () => {
      // Clean up all animations
      tl.kill();
      gsap.killTweensOf(decorativeElements);
    };
  }, [elementRef]);
};

// Hook for event card animations with enhanced hover effects
export const useEventCardAnimations = () => {
  useEffect(() => {
    // Select all event cards
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach((card) => {
      // Create hover animation context
      const cardImage = card.querySelector('.card-image');
      const cardTitle = card.querySelector('.card-title');
      const cardOverlay = card.querySelector('.card-overlay');
      const cardButton = card.querySelector('.card-button');
      const cardIcons = card.querySelectorAll('.card-icon');

      // Mouse enter animation
      card.addEventListener('mouseenter', () => {
        // Main card animation
        gsap.to(card, {
          y: -15,
          scale: 1.03,
          boxShadow: '0 15px 30px rgba(0, 102, 255, 0.15)',
          duration: 0.4,
          ease: 'power2.out',
        });

        // Image animation
        if (cardImage) {
          gsap.to(cardImage, {
            scale: 1.1,
            duration: 0.7,
            ease: 'power2.out',
          });
        }

        // Overlay animation
        if (cardOverlay) {
          gsap.to(cardOverlay, {
            opacity: 1,
            duration: 0.3,
          });
        }

        // Title animation
        if (cardTitle) {
          gsap.to(cardTitle, {
            color: '#0066FF',
            duration: 0.3,
          });
        }

        // Button animation
        if (cardButton) {
          gsap.to(cardButton, {
            y: -5,
            boxShadow: '0 5px 15px rgba(0, 102, 255, 0.2)',
            duration: 0.4,
          });
        }

        // Icons animation with stagger
        if (cardIcons.length > 0) {
          gsap.to(cardIcons, {
            scale: 1.2,
            backgroundColor: 'rgba(0, 102, 255, 0.2)',
            duration: 0.3,
            stagger: 0.1,
          });
        }
      });

      // Mouse leave animation
      card.addEventListener('mouseleave', () => {
        // Main card animation
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.4,
          ease: 'power2.out',
        });

        // Image animation
        if (cardImage) {
          gsap.to(cardImage, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }

        // Overlay animation
        if (cardOverlay) {
          gsap.to(cardOverlay, {
            opacity: 0,
            duration: 0.3,
          });
        }

        // Title animation
        if (cardTitle) {
          gsap.to(cardTitle, {
            color: '#333333',
            duration: 0.3,
          });
        }

        // Button animation
        if (cardButton) {
          gsap.to(cardButton, {
            y: 0,
            boxShadow: 'none',
            duration: 0.4,
          });
        }

        // Icons animation
        if (cardIcons.length > 0) {
          gsap.to(cardIcons, {
            scale: 1,
            backgroundColor: 'rgba(0, 102, 255, 0.1)',
            duration: 0.3,
            stagger: 0.05,
          });
        }
      });
    });

    return () => {
      // Clean up by removing event listeners
      eventCards.forEach((card) => {
        card.replaceWith(card.cloneNode(true));
      });

      // Kill any ongoing animations
      gsap.killTweensOf('.event-card, .card-image, .card-title, .card-overlay, .card-button, .card-icon');
    };
  }, []);
};

// Advanced animations hook for Events page with 3D effects and parallax
export const useAdvancedEventsAnimations = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  options = {
    staggerDelay: 0.25,
    perspective: 1000,
    rotationIntensity: 5,
    threshold: 0.15,
    once: true,
  }
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Select elements to animate
    const headings = element.querySelectorAll('.animate-heading');
    const paragraphs = element.querySelectorAll('.animate-text');
    const decorativeElements = element.querySelectorAll('.decorative-element');
    const cards = element.querySelectorAll('.animate-card');
    const buttons = element.querySelectorAll('.animate-button');
    const images = element.querySelectorAll('.animate-image');
    const parallaxElements = element.querySelectorAll('.parallax-element');
    const particles = element.querySelectorAll('.particle');

    // Create a master timeline
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Start particle animations
        if (particles.length > 0) {
          animateParticles();
        }

        // Start parallax effects
        if (parallaxElements.length > 0) {
          setupParallaxEffects();
        }
      }
    });

    // Animate headings with 3D effect
    if (headings.length > 0) {
      tl.fromTo(
        headings,
        {
          opacity: 0,
          y: 50,
          rotationX: -15,
          transformPerspective: options.perspective
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.9,
          stagger: options.staggerDelay,
          ease: 'back.out(1.7)'
        },
        0
      );
    }

    // Animate paragraphs with staggered fade
    if (paragraphs.length > 0) {
      tl.fromTo(
        paragraphs,
        {
          opacity: 0,
          y: 30,
          transformPerspective: options.perspective
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: options.staggerDelay,
          ease: 'power2.out'
        },
        0.3
      );
    }

    // Animate cards with 3D effect
    if (cards.length > 0) {
      tl.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          rotationY: -5,
          transformPerspective: options.perspective,
          transformOrigin: "center center"
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.9,
          stagger: options.staggerDelay,
          ease: 'back.out(1.2)'
        },
        0.4
      );

      // Add hover effect to cards
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            rotationY: options.rotationIntensity,
            rotationX: -options.rotationIntensity / 2,
            y: -15,
            scale: 1.03,
            boxShadow: '0 20px 30px rgba(0, 102, 255, 0.15)',
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: options.perspective,
            transformOrigin: "center center"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            y: 0,
            scale: 1,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            duration: 0.4,
            ease: 'power2.out',
          });
        });
      });
    }

    // Animate buttons with bounce effect
    if (buttons.length > 0) {
      tl.fromTo(
        buttons,
        {
          opacity: 0,
          y: 20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        },
        0.7
      );
    }

    // Animate images with reveal effect
    if (images.length > 0) {
      tl.fromTo(
        images,
        {
          opacity: 0,
          scale: 0.9,
          clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
        },
        {
          opacity: 1,
          scale: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.inOut'
        },
        0.3
      );
    }

    // Function to animate particles
    const animateParticles = () => {
      if (particles.length === 0) return;

      particles.forEach((particle, index) => {
        const xMovement = (index % 2 === 0) ? gsap.utils.random(-100, 100) : gsap.utils.random(-100, 100);
        const yMovement = gsap.utils.random(-150, -50);
        const rotation = gsap.utils.random(-360, 360);
        const duration = gsap.utils.random(10, 20);
        const delay = gsap.utils.random(0, 5);

        gsap.to(particle, {
          x: xMovement,
          y: yMovement,
          rotation: rotation,
          opacity: 0,
          duration: duration,
          delay: delay,
          ease: 'none',
          repeat: -1,
          repeatRefresh: true,
          onRepeat: () => {
            gsap.set(particle, { x: 0, y: 0, opacity: gsap.utils.random(0.3, 0.7) });
          }
        });
      });
    };

    // Function to set up parallax effects
    const setupParallaxEffects = () => {
      if (parallaxElements.length === 0) return;

      parallaxElements.forEach((element, index) => {
        const depth = element.getAttribute('data-depth') || (index % 3 + 1) * 0.2;

        ScrollTrigger.create({
          trigger: element.parentElement || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const yProgress = (self.progress - 0.5) * 2; // -1 to 1 range
            gsap.to(element, {
              y: yProgress * 100 * Number(depth),
              duration: 0.5,
              ease: 'none',
              overwrite: 'auto'
            });
          }
        });
      });
    };

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: `top ${(1 - options.threshold) * 100}%`,
      onEnter: () => {
        tl.play();
      },
      onLeaveBack: !options.once
        ? () => {
            tl.reverse();
          }
        : undefined,
      once: options.once,
    });

    return () => {
      // Clean up
      tl.kill();
      gsap.killTweensOf([...decorativeElements, ...particles, ...parallaxElements]);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element ||
            (trigger.vars.trigger && trigger.vars.trigger.parentNode === element)) {
          trigger.kill();
        }
      });

      // Remove event listeners from cards
      cards.forEach((card) => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, [elementRef, options]);
};

// Hook for creating enhanced particle effects with more options and better performance
export const useParticleEffects = <T extends HTMLElement>(
  containerRef: RefObject<T>,
  options = {
    count: 30,
    colors: ['#0066FF', '#5045E8', '#EEAE22', '#FFFFFF'],
    minSize: 5,
    maxSize: 15,
    minOpacity: 0.2,
    maxOpacity: 0.7,
    shapes: ['circle'], // 'circle', 'square', 'triangle', 'star'
    speedFactor: 1,
    respawnOnExit: true,
  }
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    const particleCount = prefersReducedMotion ? Math.min(10, options.count) : options.count;

    // Create shape SVG paths
    const shapePaths = {
      circle: '',
      square: 'M0,0 L1,0 L1,1 L0,1 Z',
      triangle: 'M0.5,0 L1,1 L0,1 Z',
      star: 'M0.5,0 L0.63,0.38 L1,0.38 L0.69,0.61 L0.82,1 L0.5,0.77 L0.18,1 L0.31,0.61 L0,0.38 L0.37,0.38 Z'
    };

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute pointer-events-none particle transform-gpu';

      // Random properties
      const size = Math.random() * (options.maxSize - options.minSize) + options.minSize;
      const color = options.colors[Math.floor(Math.random() * options.colors.length)];
      const opacity = Math.random() * (options.maxOpacity - options.minOpacity) + options.minOpacity;
      const shape = options.shapes[Math.floor(Math.random() * options.shapes.length)];

      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;

      // Apply styles
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Apply shape
      if (shape === 'circle') {
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
      } else {
        // Create SVG for more complex shapes
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1 1');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', shapePaths[shape as keyof typeof shapePaths]);
        path.setAttribute('fill', color);

        svg.appendChild(path);
        particle.appendChild(svg);
      }

      particle.style.opacity = opacity.toString();
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;

      // Add to container and store reference
      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles with reduced motion consideration
    particles.forEach((particle, index) => {
      if (prefersReducedMotion) {
        // Minimal animation for reduced motion preference
        gsap.to(particle, {
          opacity: options.minOpacity,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      } else {
        // Full animation
        const speedMultiplier = options.speedFactor;
        const xMovement = (index % 2 === 0) ? gsap.utils.random(-100, 100) : gsap.utils.random(-100, 100);
        const yMovement = gsap.utils.random(-150, -50);
        const rotation = gsap.utils.random(-360, 360);
        const duration = gsap.utils.random(10, 20) / speedMultiplier;
        const delay = gsap.utils.random(0, 5);

        gsap.to(particle, {
          x: xMovement,
          y: yMovement,
          rotation: rotation,
          opacity: 0,
          duration: duration,
          delay: delay,
          ease: 'none',
          repeat: -1,
          repeatRefresh: options.respawnOnExit,
          onRepeat: () => {
            if (options.respawnOnExit) {
              gsap.set(particle, {
                x: 0,
                y: 0,
                opacity: Math.random() * (options.maxOpacity - options.minOpacity) + options.minOpacity,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              });
            }
          }
        });
      }
    });

    // Handle window resize for responsive behavior
    const handleResize = () => {
      // Adjust particle positions if needed
      particles.forEach(particle => {
        if (Math.random() > 0.5) {
          gsap.to(particle, {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 1,
            ease: 'power1.inOut'
          });
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up
      window.removeEventListener('resize', handleResize);
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      gsap.killTweensOf(particles);
    };
  }, [containerRef, options]);
};

// Hook for advanced 3D animations with perspective effects
export const useAdvanced3DAnimations = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  options = {
    perspective: 1000,
    rotationIntensity: 5,
    parallaxIntensity: 20,
    staggerDelay: 0.25,
    textDuration: 0.8,
    respectedReducedMotion: true,
    threshold: 0.15,
  }
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      options.respectedReducedMotion &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const element = elementRef.current;

    // Select elements to animate
    const headings = element.querySelectorAll('.animate-heading');
    const paragraphs = element.querySelectorAll('.animate-text');
    const buttons = element.querySelectorAll('.animate-button');
    const images = element.querySelectorAll('.animate-image');
    const cards = element.querySelectorAll('.animate-card');
    const parallaxElements = element.querySelectorAll('.parallax-element');
    const perspective3DElements = element.querySelectorAll('.perspective-3d');
    const countdownElements = element.querySelectorAll('.countdown-element');

    // Create a master timeline
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Start 3D effects after the main sequence completes
        if (!prefersReducedMotion) {
          setup3DEffects();
          setupParallaxEffects();
        }
      }
    });

    // Animate headings with staggered timing and 3D effect
    if (headings.length > 0) {
      const headingAnimation = prefersReducedMotion
        ? { opacity: 0, y: 20 }
        : { opacity: 0, y: 50, rotationX: -15, transformPerspective: options.perspective };

      tl.fromTo(
        headings,
        headingAnimation,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'back.out(1.7)'
        },
        0
      );
    }

    // Animate paragraphs with staggered timing
    if (paragraphs.length > 0) {
      tl.fromTo(
        paragraphs,
        { opacity: 0, y: prefersReducedMotion ? 15 : 30 },
        {
          opacity: 1,
          y: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'power2.out'
        },
        0.3
      );
    }

    // Animate buttons with bounce effect
    if (buttons.length > 0) {
      const buttonAnimation = prefersReducedMotion
        ? { opacity: 0, y: 10 }
        : { opacity: 0, y: 20, scale: 0.9 };

      tl.fromTo(
        buttons,
        buttonAnimation,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: options.textDuration * 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        },
        0.7
      );
    }

    // Animate images with 3D effect
    if (images.length > 0) {
      const imageAnimation = prefersReducedMotion
        ? { opacity: 0, scale: 0.95 }
        : {
            opacity: 0,
            scale: 0.9,
            rotationY: -5,
            transformPerspective: options.perspective,
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
          };

      tl.fromTo(
        images,
        imageAnimation,
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: options.textDuration * 1.2,
          stagger: 0.2,
          ease: 'power3.inOut'
        },
        0.3
      );
    }

    // Animate cards with 3D effect
    if (cards.length > 0) {
      const cardAnimation = prefersReducedMotion
        ? { opacity: 0, y: 20 }
        : {
            opacity: 0,
            y: 60,
            rotationY: -5,
            transformPerspective: options.perspective,
            transformOrigin: "center center"
          };

      tl.fromTo(
        cards,
        cardAnimation,
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: options.textDuration,
          stagger: options.staggerDelay,
          ease: 'back.out(1.2)'
        },
        0.4
      );
    }

    // Animate countdown elements
    if (countdownElements.length > 0) {
      tl.fromTo(
        countdownElements,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: options.textDuration,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        },
        0.9
      );
    }

    // Function to set up 3D perspective effects
    const setup3DEffects = () => {
      if (perspective3DElements.length === 0) return;

      perspective3DElements.forEach((element) => {
        // Set transform style for 3D
        (element as HTMLElement).style.transformStyle = 'preserve-3d';
        (element as HTMLElement).style.perspective = `${options.perspective}px`;

        // Add mouse move event for 3D effect
        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(element, {
            rotationY: x * options.rotationIntensity,
            rotationX: -y * options.rotationIntensity,
            translateZ: 10,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: options.perspective,
          });
        });

        // Reset on mouse leave
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            rotationY: 0,
            rotationX: 0,
            translateZ: 0,
            duration: 0.7,
            ease: 'power3.out',
          });
        });
      });
    };

    // Function to set up parallax effects
    const setupParallaxEffects = () => {
      if (parallaxElements.length === 0) return;

      parallaxElements.forEach((element) => {
        const depth = parseFloat(element.getAttribute('data-depth') || '0.2');

        ScrollTrigger.create({
          trigger: element.parentElement || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const yProgress = (self.progress - 0.5) * 2; // -1 to 1 range
            gsap.to(element, {
              y: yProgress * options.parallaxIntensity * depth * 10,
              duration: 0.5,
              ease: 'none',
              overwrite: 'auto'
            });
          }
        });
      });
    };

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: element,
      start: `top ${(1 - options.threshold) * 100}%`,
      onEnter: () => {
        tl.play();
      },
      once: true,
    });

    return () => {
      // Clean up
      tl.kill();

      // Remove event listeners from 3D elements
      perspective3DElements.forEach((element) => {
        element.replaceWith(element.cloneNode(true));
      });

      // Kill all ScrollTriggers associated with this element
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element ||
            (trigger.vars.trigger && trigger.vars.trigger.parentNode === element)) {
          trigger.kill();
        }
      });
    };
  }, [elementRef, options]);
};

// Hook for countdown timer animation
export const useCountdownAnimation = (
  targetDate: Date,
  elementRef: RefObject<HTMLElement>
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const daysElement = element.querySelector('[data-countdown="days"]');
    const hoursElement = element.querySelector('[data-countdown="hours"]');
    const minutesElement = element.querySelector('[data-countdown="minutes"]');
    const secondsElement = element.querySelector('[data-countdown="seconds"]');

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

    // Function to update countdown
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Target date reached
        daysElement.textContent = '0';
        hoursElement.textContent = '0';
        minutesElement.textContent = '0';
        secondsElement.textContent = '0';
        return;
      }

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Update DOM with new values
      const updateWithAnimation = (el: Element, newValue: number) => {
        const currentValue = parseInt(el.textContent || '0', 10);
        if (currentValue !== newValue) {
          // Animate the change
          gsap.to(el, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              el.textContent = newValue.toString();
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: 'back.out(1.7)'
              });
            }
          });
        }
      };

      updateWithAnimation(daysElement, days);
      updateWithAnimation(hoursElement, hours);
      updateWithAnimation(minutesElement, minutes);
      updateWithAnimation(secondsElement, seconds);
    };

    // Initial update
    updateCountdown();

    // Set interval for countdown
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [targetDate, elementRef]);
};

export default {
  useScrollAnimation,
  useHeroAnimation,
  useCardAnimation,
  useHoverAnimations,
  useTestimonialAnimation,
  useCoreValuesAnimation,
  useAboutPageAnimations,
  useEventsPageAnimations,
  useEventsHeroAnimation,
  useEventCardAnimations,
  useAdvancedEventsAnimations,
  useParticleEffects,
  useAdvanced3DAnimations,
  useCountdownAnimation,
};
