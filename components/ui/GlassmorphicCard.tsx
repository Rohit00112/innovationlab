"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  animationDelay?: number;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  animationDelay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Base styles for the glassmorphic card
  const baseStyles = `
    relative overflow-hidden rounded-2xl
    bg-white/80 backdrop-blur-lg
    border border-white/20
    shadow-lg
    ${className}
  `;

  // Add hover effect if enabled
  useEffect(() => {
    if (!hoverEffect || !cardRef.current) return;

    const card = cardRef.current;
    
    // Create hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        boxShadow: '0 20px 40px rgba(0, 102, 255, 0.15)',
        y: -5,
        scale: 1.01,
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        boxShadow: '0 10px 30px rgba(0, 102, 255, 0.1)',
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    // Add entrance animation with delay
    gsap.fromTo(
      card,
      { 
        y: 30, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: animationDelay,
        ease: 'power3.out',
      }
    );
    
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(card);
    };
  }, [hoverEffect, animationDelay]);

  return (
    <div ref={cardRef} className={baseStyles}>
      {/* Glassmorphic effect elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#0066FF]/10 to-[#5045E8]/10 blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#5045E8]/10 to-[#0066FF]/10 blur-xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphicCard;
