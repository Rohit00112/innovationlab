"use client";

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScroll from '../ui/SmoothScroll';
import ScrollToTop from '../ui/ScrollToTop';
import { useHoverAnimations } from '@/hooks/useGSAPAnimations';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Use hover animations hook
  useHoverAnimations();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
