"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  arrow?: boolean;
  target?: string;
  rel?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  href,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  arrow = false,
  target,
  rel,
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Define base styles based on variant and size
  const variantStyles = {
    primary: 'bg-[#0066FF] text-white hover:bg-[#0055DD]',
    secondary: 'bg-[#EEAE22] text-white hover:bg-[#D99E12]',
    outline: 'bg-transparent border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/5',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  // Combine all styles
  const buttonStyles = `
    inline-flex items-center justify-center font-semibold rounded-md shadow-md transition-all
    ${variantStyles[variant]} ${sizeStyles[size]} ${className}
  `;

  useEffect(() => {
    if (!buttonRef.current) return;

    // Create hover animation
    const button = buttonRef.current;
    let glowAnimation: gsap.core.Tween;

    button.addEventListener('mouseenter', () => {
      // Scale up the button
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(1.5)',
      });

      // Add glowing effect based on variant
      if (variant === 'primary') {
        gsap.to(button, {
          boxShadow: "0 0 20px rgba(0, 102, 255, 0.6), 0 0 30px rgba(0, 102, 255, 0.3)",
          duration: 0.4,
          ease: "power2.out"
        });

        // Create a pulsing glow effect
        glowAnimation = gsap.to(button, {
          boxShadow: "0 0 25px rgba(0, 102, 255, 0.7), 0 0 35px rgba(0, 102, 255, 0.4)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      } else if (variant === 'secondary') {
        gsap.to(button, {
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)",
          duration: 0.4,
          ease: "power2.out"
        });

        // Create a pulsing glow effect for secondary buttons
        glowAnimation = gsap.to(button, {
          boxShadow: "0 0 25px rgba(255, 255, 255, 0.6), 0 0 35px rgba(255, 255, 255, 0.4)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      } else if (variant === 'outline') {
        gsap.to(button, {
          boxShadow: "0 0 15px rgba(0, 102, 255, 0.4)",
          duration: 0.4,
          ease: "power2.out"
        });

        // Create a pulsing glow effect for outline buttons
        glowAnimation = gsap.to(button, {
          boxShadow: "0 0 20px rgba(0, 102, 255, 0.5)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          x: 5,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    button.addEventListener('mouseleave', () => {
      // Kill any ongoing glow animations
      if (glowAnimation) {
        glowAnimation.kill();
      }

      // Reset button style
      gsap.to(button, {
        scale: 1,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: 'power2.out',
      });

      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Add click animation
    button.addEventListener('mousedown', () => {
      gsap.to(button, {
        scale: 0.95,
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

    return () => {
      // Clean up
      gsap.killTweensOf(button);
      // Store ref in variable to avoid the "ref value will likely have changed" warning
      const arrow = arrowRef.current;
      if (arrow) {
        gsap.killTweensOf(arrow);
      }
    };
  }, [variant]);

  return (
    <Link
      href={href}
      ref={buttonRef}
      className={buttonStyles}
      target={target}
      rel={rel}
    >
      {children}

      {arrow && (
        <svg
          ref={arrowRef}
          className="w-5 h-5 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </Link>
  );
};

export default AnimatedButton;
