"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/team', label: 'Our Team' },
    { href: '/contact', label: 'Contact' },
  ];

  // Check if we're on a desktop screen and close the menu if needed
  useEffect(() => {
    // Check if we're on desktop (md breakpoint in Tailwind is 768px)
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    // If we're on desktop and the menu is open, close it
    if (isDesktop && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Track if this is the first render
  const isFirstRender = useRef(true);

  // Set initial states immediately to prevent flash
  useEffect(() => {
    if (isFirstRender.current && !isOpen && navRef.current && backdropRef.current && linksRef.current) {
      const backdrop = backdropRef.current;
      const links = linksRef.current.querySelectorAll('li');
      const nav = navRef.current;

      // Ensure everything is hidden initially
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(links, { opacity: 0, x: 20 });
      gsap.set(nav, { x: '100%' });
    }
  }, []);

  // Handle animations when isOpen changes
  useEffect(() => {
    if (!navRef.current || !backdropRef.current || !linksRef.current) return;

    const nav = navRef.current;
    const backdrop = backdropRef.current;
    const links = linksRef.current.querySelectorAll('li');

    // Skip animations on first render to prevent flash
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isOpen) {
      // Open animation
      gsap.to(backdrop, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(nav, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      });

      gsap.fromTo(
        links,
        {
          opacity: 0,
          x: 20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.2,
          ease: 'power2.out',
        }
      );
    } else {
      // Close animation
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });

      gsap.to(links, {
        opacity: 0,
        x: 20,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.in',
      });

      gsap.to(nav, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Lock body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle link click
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-opacity duration-300`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>

      {/* Mobile navigation menu */}
      <div
        ref={navRef}
        className={`fixed top-0 right-0 bottom-0 w-[300px] bg-white shadow-xl z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform md:hidden ${isFirstRender.current && !isOpen ? 'opacity-0' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="text-[#0066FF] font-bold text-2xl" onClick={handleLinkClick}>
            Innovation Lab.
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="p-6">
          <ul ref={linksRef} className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-800 hover:text-[#0066FF] transition-colors text-lg font-medium block py-2"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact button */}
          <div className="mt-8">
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0066FF] hover:bg-blue-700 transition-colors"
              onClick={handleLinkClick}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
