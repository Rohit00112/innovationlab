"use client";

// This file contains JavaScript for animations that require client-side execution
// such as scroll-triggered animations using Intersection Observer

// Function to initialize scroll animations
export function initScrollAnimations(options = { immediate: true }) {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  // If immediate is true, immediately activate all reveal elements without scroll trigger
  if (options.immediate) {
    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('active');
    });
    return;
  }

  // Otherwise, set up the Intersection Observer for scroll-triggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element is in view
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionally unobserve the element after it's been animated
        // observer.unobserve(entry.target);
      } else {
        // Optional: remove the class when the element is out of view
        // entry.target.classList.remove('active');
      }
    });
  }, {
    root: null, // Use the viewport as the root
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly offset to trigger before the element is fully in view
  });

  // Observe all elements with the 'reveal' class
  document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
  });

  return () => {
    // Cleanup function to disconnect the observer when component unmounts
    if (observer) {
      observer.disconnect();
    }
  };
}
