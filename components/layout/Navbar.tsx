"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileNav from '../ui/MobileNav';
import { useHasMounted } from '../../hooks/useHasMounted';

const Navbar: React.FC = () => {
  // Always initialize menu as closed to prevent flash on page load
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  // Prevent menu flash on page load
  const isInitialRender = useRef(true);

  // Initialize screen size state and add resize listener
  useEffect(() => {
    // Function to check if screen is mobile
    const checkIsMobile = () => {
      // 768px is the md breakpoint in Tailwind CSS
      const isMobileView = window.innerWidth < 768;

      // On first render, just set the state without any side effects
      if (isInitialRender.current) {
        isInitialRender.current = false;
        // Ensure menu is closed on initial load for mobile
        if (isMobileView && isMenuOpen) {
          setIsMenuOpen(false);
        }
      }

      // Close menu if screen size changes to desktop
      if (!isMobileView && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Check initial screen size
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/90 shadow-md backdrop-blur-lg' : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="container flex justify-between items-center h-20">
          <Link href="/" className="text-[#0066FF] font-bold text-2xl relative z-50">
            Innovation Lab.
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-[#0066FF] font-semibold' : 'text-gray-800 hover:text-[#0066FF]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                pathname === '/about' ? 'text-[#0066FF] font-semibold' : 'text-gray-800 hover:text-[#0066FF]'
              }`}
            >
              About
            </Link>
            {/* <Link
              href="/programs"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/programs') ? 'text-[#0066FF] font-semibold' : 'text-gray-800 hover:text-[#0066FF]'
              }`}
            >
              Programs
            </Link> */}
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/events') ? 'text-[#0066FF] font-semibold' : 'text-gray-800 hover:text-[#0066FF]'
              }`}
            >
              Events
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${
                pathname === '/contact' ? 'text-[#0066FF] font-semibold' : 'text-gray-800 hover:text-[#0066FF]'
              }`}
            >
              Contact
            </Link>
          </nav>

          <button
            className="md:hidden relative z-50"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation - Only render when client-side mounted with a slight delay */}
      {hasMounted && (
        <div className={`md:hidden ${isInitialRender.current ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <MobileNav isOpen={isMenuOpen} onClose={closeMenu} />
        </div>
      )}
    </>
  );
};

export default Navbar;
