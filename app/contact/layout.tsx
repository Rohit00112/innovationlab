"use client";

import React, { useEffect } from 'react';
import { initScrollAnimations } from '../animations';

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize scroll animations when the component mounts with immediate option
    const cleanup = initScrollAnimations({ immediate: true });

    // Clean up when the component unmounts
    return cleanup;
  }, []);

  return (
    <main>
      {children}
    </main>
  );
}
