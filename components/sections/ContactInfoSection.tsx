"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import GlassmorphicCard from '../ui/GlassmorphicCard';
import ContactSocialLinks from '../ui/ContactSocialLinks';

const ContactInfoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Initialize animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Create a timeline for staggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Animate title
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0
      );
    }

    // Animate map
    if (mapRef.current) {
      tl.fromTo(
        mapRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)"
        },
        0.3
      );
    }

    // Animate info items
    if (infoRef.current) {
      const items = infoRef.current.querySelectorAll('.info-item');
      tl.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out"
        },
        0.2
      );

      // Animate social links
      const socialLinks = infoRef.current.querySelector('.social-links-container');
      if (socialLinks) {
        tl.fromTo(
          socialLinks,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
          },
          0.6
        );
      }
    }

    return () => {
      // Clean up animations
      if (tl) tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="location"
      className="py-20 md:py-24 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#0066FF]/5 to-[#5045E8]/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#5045E8]/5 to-[#0066FF]/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 opacity-0"
          >
            Our Location & Contact Details
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Visit our innovation hub or reach out through any of the contact methods below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div ref={mapRef} className="opacity-0">
            <GlassmorphicCard className="p-4 h-full">
              <div className="rounded-xl overflow-hidden h-[400px] shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.95047974322!2d-122.43913217412156!3d37.76200627428706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1652364518279!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Innovation Lab Location"
                  aria-label="Map showing Innovation Lab location"
                ></iframe>
              </div>
            </GlassmorphicCard>
          </div>

          {/* Contact Information */}
          <div ref={infoRef}>
            <GlassmorphicCard className="p-8 md:p-10 h-full">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">Contact Information</h3>

              <div className="space-y-8">
                {/* Address */}
                <div className="info-item flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF]/10 to-[#5045E8]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#0066FF" strokeWidth="1.5"/>
                      <path d="M3.62 8.49C5.59 -0.169 18.42 -0.159 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="#0066FF" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Visit Our Office</h4>
                    <p className="text-gray-700">
                      123 Innovation Street<br />
                      Tech District, San Francisco<br />
                      CA 94103, United States
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="info-item flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF]/10 to-[#5045E8]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#0066FF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#0066FF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h4>
                    <a href="mailto:info@innovationlab.com" className="text-[#0066FF] hover:underline">info@innovationlab.com</a>
                    <p className="text-gray-600 mt-1 text-sm">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="info-item flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF]/10 to-[#5045E8]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="#0066FF" strokeWidth="1.5" strokeMiterlimit="10"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h4>
                    <a href="tel:+11234567890" className="text-[#0066FF] hover:underline">+1 (123) 456-7890</a>
                    <p className="text-gray-600 mt-1 text-sm">Mon-Fri from 9am to 6pm</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="info-item pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h4>
                  <div className="social-links-container">
                    <ContactSocialLinks
                      size="md"
                      iconColor="text-[#0066FF]"
                      hoverColor="hover:text-[#5045E8]"
                    />
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection;
