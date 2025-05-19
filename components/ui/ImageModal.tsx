'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, title, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Animation for opening and closing the modal
  useEffect(() => {
    if (isOpen && overlayRef.current && contentRef.current) {
      // Reset opacity for animation
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0, y: 20, scale: 0.95 });

      // Animate in
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.5)"
      }, "-=0.2");
    }
  }, [isOpen]);

  // Handle close animation
  const handleClose = () => {
    if (overlayRef.current && contentRef.current) {
      const tl = gsap.timeline({
        onComplete: onClose
      });
      tl.to(contentRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.4,
        ease: "power3.in"
      });
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2");
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        ref={modalRef}
        className="relative max-w-5xl w-full overflow-hidden"
        style={{
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div
          ref={contentRef}
          className="bg-black/50 rounded-xl shadow-2xl overflow-hidden backdrop-filter backdrop-blur-sm"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm shadow-xl hover:scale-110 transform"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="relative w-full bg-black/30 flex items-center justify-center">
            {/* Loading spinner with improved visibility */}
            <div className={`absolute inset-0 flex items-center justify-center z-10 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${!loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 border-4 border-white/20 border-t-white/90 rounded-full animate-spin mb-4"></div>
                <p className="text-white/90 text-sm font-medium">Loading image...</p>
              </div>
            </div>

            {/* Image container with dynamic height adjustment */}
            <div className="relative w-full flex items-center justify-center p-4">
              <div
                className="relative"
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(100vh - 120px)',
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={800}
                  className={`object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    maxHeight: 'calc(100vh - 120px)',
                    width: 'auto',
                    height: 'auto'
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  priority
                  onLoad={() => setLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
