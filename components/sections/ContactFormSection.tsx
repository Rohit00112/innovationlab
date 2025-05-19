"use client";

import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import JSON data
import contactFormData from '@/data/sections/contact/form.json';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Innovation Lab coordinates
const INNOVATION_LAB_COORDINATES = {
  lat: 26.655715311078577,
  lng: 87.30237694989367
};

const ContactFormSection: React.FC = () => {
  // Refs for animation
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formItemsRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const contactItemsRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '',
    phone: ''
  });

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '',
    phone: ''
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Store reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Setup contact item hover animations
  const setupContactItemHoverEffects = () => {
    if (!contactItemsRef.current || prefersReducedMotion) return;

    const contactItems = contactItemsRef.current.querySelectorAll('.contact-item');

    contactItems.forEach(item => {
      // Create hover in animation
      item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('.icon-container');
        const content = item.querySelector('.content');

        gsap.to(item, {
          backgroundColor: 'rgba(0, 102, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px',
          duration: 0.3,
          ease: "power2.out"
        });

        if (icon) {
          gsap.to(icon, {
            backgroundColor: 'rgba(0, 102, 255, 0.2)',
            scale: 1.05,
            duration: 0.4,
            ease: "back.out(1.5)"
          });
        }

        if (content) {
          gsap.to(content, {
            x: 5,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      // Create hover out animation
      item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('.icon-container');
        const content = item.querySelector('.content');

        gsap.to(item, {
          backgroundColor: 'transparent',
          borderRadius: '0px',
          padding: '0px',
          duration: 0.3,
          ease: "power2.out"
        });

        if (icon) {
          gsap.to(icon, {
            backgroundColor: 'rgba(239, 246, 255, 1)',
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        }

        if (content) {
          gsap.to(content, {
            x: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });
  };

  // Initialize animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(reducedMotion);
    const animationDuration = reducedMotion ? 0.4 : 0.8;

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
        { opacity: 1, y: 0, duration: animationDuration },
        0
      );
    }

    // Animate form
    if (formRef.current) {
      tl.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: animationDuration,
          ease: "power3.out"
        },
        0.2
      );
    }

    // Animate form items
    if (formItemsRef.current) {
      const items = formItemsRef.current.querySelectorAll('.form-item');
      tl.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        },
        0.3
      );
    }

    // Animate contact info
    if (contactInfoRef.current) {
      tl.fromTo(
        contactInfoRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: animationDuration,
          ease: "power3.out"
        },
        0.3
      );
    }

    // Animate contact items with staggered effect
    if (contactItemsRef.current) {
      const items = contactItemsRef.current.querySelectorAll('.contact-item');
      tl.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(1.2)"
        },
        0.4
      );
    }

    // Animate map with a scale effect
    if (mapRef.current) {
      tl.fromTo(
        mapRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: animationDuration,
          ease: "back.out(1.2)"
        },
        0.6
      );

      // Add subtle floating animation to map
      if (!reducedMotion) {
        // Get the address card overlay
        const addressCard = mapRef.current.querySelector('.map-address-card');

        // Animate the map with a subtle floating effect
        gsap.to(mapRef.current, {
          y: "10px",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1
        });

        // Animate the address card if it exists
        if (addressCard) {
          gsap.to(addressCard, {
            y: "-8px",
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.5
          });
        }
      }
    }

    // Setup contact item hover animations after initial animations
    setTimeout(() => {
      setupContactItemHoverEffects();
    }, 1000);

    return () => {
      // Clean up animations
      if (tl) tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // Clean up contact item hover animations
      if (contactItemsRef.current) {
        const contactItems = contactItemsRef.current.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
          item.removeEventListener('mouseenter', () => {});
          item.removeEventListener('mouseleave', () => {});
        });
      }
    };
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
      isValid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    // Validate phone (optional)
    if (formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit form data to the server
  const submitFormToServer = async (formData: typeof formData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous submission states
    setSubmitError('');

    if (validateForm()) {
      try {
        // Set loading state
        setIsSubmitting(true);

        // Submit form data to server
        const response = await submitFormToServer(formData);

        if (response.success) {
          // Show success message
          setIsSubmitted(true);

          // Animate success state
          if (formRef.current) {
            gsap.to(formRef.current, {
              y: 10,
              opacity: 0.8,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                // Reset form
                setFormData({
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                  company: '',
                  phone: ''
                });

                // Animate form back in
                gsap.to(formRef.current, {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out",
                  delay: 0.2
                });
              }
            });
          } else {
            // Fallback if animation fails
            setFormData({
              name: '',
              email: '',
              subject: '',
              message: '',
              company: '',
              phone: ''
            });
          }

          // Reset success message after 5 seconds
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        }
      } catch (error) {
        // Handle submission error
        console.error('Form submission error:', error);
        setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');

        // Shake the form to indicate error
        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { x: -10 },
            {
              x: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.3)"
            }
          );
        }
      } finally {
        // Reset loading state
        setIsSubmitting(false);
      }
    } else {
      // Shake the form to indicate validation errors
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: -5 },
          {
            x: 0,
            duration: 0.4,
            ease: "elastic.out(1, 0.3)"
          }
        );
      }
    }
  };

  return (
    <section ref={sectionRef} className={contactFormData.sectionClasses} id={contactFormData.sectionId}>
      <div className={contactFormData.container.classes}>
        <div className={contactFormData.layout.classes}>
          {/* Contact Form */}
          <div className={contactFormData.form.containerClasses}>
            <div className={contactFormData.form.boxClasses}>
              {/* Decorative elements */}
              {contactFormData.form.decorativeElements.map((element, index) => (
                <div key={index} className={element.classes}></div>
              ))}

              <div className={contactFormData.form.content.containerClasses}>
                <h2 ref={titleRef} className={contactFormData.form.content.title.classes}>
                  {contactFormData.form.content.title.text}
                </h2>

                {/* Success message */}
                {isSubmitted && (
                  <div className={contactFormData.form.content.successMessage.containerClasses} role="alert">
                    <div className="flex items-center">
                      <svg
                        className={contactFormData.form.content.successMessage.icon.classes}
                        fill="none"
                        stroke="currentColor"
                        viewBox={contactFormData.form.content.successMessage.icon.viewBox}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap={contactFormData.form.content.successMessage.icon.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                          strokeLinejoin={contactFormData.form.content.successMessage.icon.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                          strokeWidth={contactFormData.form.content.successMessage.icon.strokeWidth}
                          d={contactFormData.form.content.successMessage.icon.path}
                        ></path>
                      </svg>
                      <span>{contactFormData.form.content.successMessage.text}</span>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {submitError && (
                  <div className={contactFormData.form.content.errorMessage.containerClasses} role="alert">
                    <div className="flex items-center">
                      <svg
                        className={contactFormData.form.content.errorMessage.icon.classes}
                        fill="none"
                        stroke="currentColor"
                        viewBox={contactFormData.form.content.errorMessage.icon.viewBox}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap={contactFormData.form.content.errorMessage.icon.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                          strokeLinejoin={contactFormData.form.content.errorMessage.icon.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                          strokeWidth={contactFormData.form.content.errorMessage.icon.strokeWidth}
                          d={contactFormData.form.content.errorMessage.icon.path}
                        ></path>
                      </svg>
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}

              <form ref={formRef} onSubmit={handleSubmit} aria-label={contactFormData.form.content.form.ariaLabel} noValidate>
                <div ref={formItemsRef} className={contactFormData.form.content.form.fields.containerClasses}>
                  {/* Name Field */}
                  <div className="flex flex-col form-item">
                    <label htmlFor={contactFormData.form.content.form.fields.name.id} className={contactFormData.form.content.form.fields.name.labelClasses}>
                      {contactFormData.form.content.form.fields.name.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={contactFormData.form.content.form.fields.name.type}
                      id={contactFormData.form.content.form.fields.name.id}
                      name={contactFormData.form.content.form.fields.name.name}
                      value={formData.name}
                      onChange={handleChange}
                      className={`${contactFormData.form.content.form.fields.name.inputClasses} ${errors.name ? contactFormData.form.content.form.fields.name.errorClasses : 'border-gray-300'}`}
                      placeholder={contactFormData.form.content.form.fields.name.placeholder}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <p id="name-error" className={contactFormData.form.content.form.fields.name.errorMessageClasses}>{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col form-item">
                    <label htmlFor={contactFormData.form.content.form.fields.email.id} className={contactFormData.form.content.form.fields.email.labelClasses}>
                      {contactFormData.form.content.form.fields.email.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={contactFormData.form.content.form.fields.email.type}
                      id={contactFormData.form.content.form.fields.email.id}
                      name={contactFormData.form.content.form.fields.email.name}
                      value={formData.email}
                      onChange={handleChange}
                      className={`${contactFormData.form.content.form.fields.email.inputClasses} ${errors.email ? contactFormData.form.content.form.fields.email.errorClasses : 'border-gray-300'}`}
                      placeholder={contactFormData.form.content.form.fields.email.placeholder}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className={contactFormData.form.content.form.fields.email.errorMessageClasses}>{errors.email}</p>}
                  </div>
                </div>

                {/* Subject Field */}
                <div className={contactFormData.form.content.form.fields.subject.containerClasses}>
                  <label htmlFor={contactFormData.form.content.form.fields.subject.id} className={contactFormData.form.content.form.fields.subject.labelClasses}>
                    {contactFormData.form.content.form.fields.subject.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={contactFormData.form.content.form.fields.subject.type}
                    id={contactFormData.form.content.form.fields.subject.id}
                    name={contactFormData.form.content.form.fields.subject.name}
                    value={formData.subject}
                    onChange={handleChange}
                    className={`${contactFormData.form.content.form.fields.subject.inputClasses} ${errors.subject ? contactFormData.form.content.form.fields.subject.errorClasses : 'border-gray-300'}`}
                    placeholder={contactFormData.form.content.form.fields.subject.placeholder}
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && <p id="subject-error" className={contactFormData.form.content.form.fields.subject.errorMessageClasses}>{errors.subject}</p>}
                </div>

                {/* Message Field */}
                <div className={contactFormData.form.content.form.fields.message.containerClasses}>
                  <label htmlFor={contactFormData.form.content.form.fields.message.id} className={contactFormData.form.content.form.fields.message.labelClasses}>
                    {contactFormData.form.content.form.fields.message.label} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id={contactFormData.form.content.form.fields.message.id}
                    name={contactFormData.form.content.form.fields.message.name}
                    value={formData.message}
                    onChange={handleChange}
                    rows={contactFormData.form.content.form.fields.message.rows}
                    className={`${contactFormData.form.content.form.fields.message.inputClasses} ${errors.message ? contactFormData.form.content.form.fields.message.errorClasses : 'border-gray-300'}`}
                    placeholder={contactFormData.form.content.form.fields.message.placeholder}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  ></textarea>
                  {errors.message && <p id="message-error" className={contactFormData.form.content.form.fields.message.errorMessageClasses}>{errors.message}</p>}
                </div>

                <Button
                  variant={contactFormData.form.content.form.submitButton.variant as "primary" | "secondary" | "outline" | undefined}
                  size={contactFormData.form.content.form.submitButton.size as "sm" | "md" | "lg" | undefined}
                  className={contactFormData.form.content.form.submitButton.classes}
                  disabled={isSubmitting}
                  type={contactFormData.form.content.form.submitButton.type as "button" | "submit" | "reset" | undefined}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className={contactFormData.form.content.form.submitButton.loadingState.icon.classes}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox={contactFormData.form.content.form.submitButton.loadingState.icon.viewBox}
                      >
                        <circle
                          className={contactFormData.form.content.form.submitButton.loadingState.icon.circle.classes}
                          cx={contactFormData.form.content.form.submitButton.loadingState.icon.circle.cx}
                          cy={contactFormData.form.content.form.submitButton.loadingState.icon.circle.cy}
                          r={contactFormData.form.content.form.submitButton.loadingState.icon.circle.r}
                          stroke={contactFormData.form.content.form.submitButton.loadingState.icon.circle.stroke}
                          strokeWidth={contactFormData.form.content.form.submitButton.loadingState.icon.circle.strokeWidth}
                        ></circle>
                        <path
                          className={contactFormData.form.content.form.submitButton.loadingState.icon.path.classes}
                          fill={contactFormData.form.content.form.submitButton.loadingState.icon.path.fill}
                          d={contactFormData.form.content.form.submitButton.loadingState.icon.path.d}
                        ></path>
                      </svg>
                      {contactFormData.form.content.form.submitButton.loadingState.text}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className={contactFormData.form.content.form.submitButton.normalState.icon.classes}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox={contactFormData.form.content.form.submitButton.normalState.icon.viewBox}
                        stroke="currentColor"
                      >
                        <path
                          d={contactFormData.form.content.form.submitButton.normalState.icon.path.d}
                          strokeLinecap={contactFormData.form.content.form.submitButton.normalState.icon.path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                          strokeLinejoin={contactFormData.form.content.form.submitButton.normalState.icon.path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                          strokeWidth={contactFormData.form.content.form.submitButton.normalState.icon.path.strokeWidth}
                        ></path>
                      </svg>
                      {contactFormData.form.content.form.submitButton.normalState.text}
                    </span>
                  )}
                </Button>
              </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className={contactFormData.contactInfo.containerClasses}>
            <div ref={contactInfoRef} className={contactFormData.contactInfo.boxClasses}>
              {/* Decorative elements */}
              {contactFormData.contactInfo.decorativeElements.map((element, index) => (
                <div key={index} className={element.classes}></div>
              ))}

              <div className={contactFormData.contactInfo.content.containerClasses}>
                <h2 className={contactFormData.contactInfo.content.title.classes}>
                  {contactFormData.contactInfo.content.title.text}
                </h2>
                <p className={contactFormData.contactInfo.content.description.classes}>
                  {contactFormData.contactInfo.content.description.text}
                </p>

              <div ref={contactItemsRef} className={contactFormData.contactInfo.content.contactItems.containerClasses}>
                {/* Email */}
                <div className={contactFormData.contactInfo.content.contactItems.email.containerClasses}>
                  <div className={contactFormData.contactInfo.content.contactItems.email.icon.containerClasses}>
                    <svg
                      width="24"
                      height="24"
                      viewBox={contactFormData.contactInfo.content.contactItems.email.icon.viewBox}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {contactFormData.contactInfo.content.contactItems.email.icon.paths.map((path, index) => (
                        <path
                          key={index}
                          d={path.d}
                          stroke={path.stroke}
                          strokeWidth={path.strokeWidth}
                          strokeMiterlimit={path.strokeMiterlimit}
                          strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                          strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                        />
                      ))}
                    </svg>
                  </div>
                  <div className={contactFormData.contactInfo.content.contactItems.email.content.containerClasses}>
                    <h3 className={contactFormData.contactInfo.content.contactItems.email.content.title.classes}>
                      {contactFormData.contactInfo.content.contactItems.email.content.title.text}
                    </h3>
                    <a
                      href={contactFormData.contactInfo.content.contactItems.email.content.link.href}
                      className={contactFormData.contactInfo.content.contactItems.email.content.link.classes}
                    >
                      {contactFormData.contactInfo.content.contactItems.email.content.link.text}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className={contactFormData.contactInfo.content.contactItems.phone.containerClasses}>
                  <div className={contactFormData.contactInfo.content.contactItems.phone.icon.containerClasses}>
                    <svg
                      width="24"
                      height="24"
                      viewBox={contactFormData.contactInfo.content.contactItems.phone.icon.viewBox}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {contactFormData.contactInfo.content.contactItems.phone.icon.paths.map((path, index) => (
                        <path
                          key={index}
                          d={path.d}
                          stroke={path.stroke}
                          strokeWidth={path.strokeWidth}
                          strokeMiterlimit={path.strokeMiterlimit}
                        />
                      ))}
                    </svg>
                  </div>
                  <div className={contactFormData.contactInfo.content.contactItems.phone.content.containerClasses}>
                    <h3 className={contactFormData.contactInfo.content.contactItems.phone.content.title.classes}>
                      {contactFormData.contactInfo.content.contactItems.phone.content.title.text}
                    </h3>
                    <a
                      href={contactFormData.contactInfo.content.contactItems.phone.content.link.href}
                      className={contactFormData.contactInfo.content.contactItems.phone.content.link.classes}
                    >
                      {contactFormData.contactInfo.content.contactItems.phone.content.link.text}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className={contactFormData.contactInfo.content.contactItems.address.containerClasses}>
                  <div className={contactFormData.contactInfo.content.contactItems.address.icon.containerClasses}>
                    <svg
                      width="24"
                      height="24"
                      viewBox={contactFormData.contactInfo.content.contactItems.address.icon.viewBox}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {contactFormData.contactInfo.content.contactItems.address.icon.paths.map((path, index) => (
                        <path
                          key={index}
                          d={path.d}
                          stroke={path.stroke}
                          strokeWidth={path.strokeWidth}
                        />
                      ))}
                    </svg>
                  </div>
                  <div className={contactFormData.contactInfo.content.contactItems.address.content.containerClasses}>
                    <h3 className={contactFormData.contactInfo.content.contactItems.address.content.title.classes}>
                      {contactFormData.contactInfo.content.contactItems.address.content.title.text}
                    </h3>
                    <p
                      className={contactFormData.contactInfo.content.contactItems.address.content.address.classes}
                      dangerouslySetInnerHTML={{ __html: contactFormData.contactInfo.content.contactItems.address.content.address.text }}
                    ></p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section with margins */}
      <div id={contactFormData.sectionId} className={contactFormData.map.containerClasses}>
        <div className={contactFormData.container.classes}>
          <div className={contactFormData.map.header.wrapperClasses}>
            <div>
              <h2 className={contactFormData.map.header.content.title.classes}>
                {contactFormData.map.header.content.title.text}
              </h2>
              <p className={contactFormData.map.header.content.description.classes}>
                {contactFormData.map.header.content.description.text}
              </p>
            </div>
            <div className={contactFormData.map.header.buttons.containerClasses}>
              <a
                href={`https://maps.google.com/?q=${INNOVATION_LAB_COORDINATES.lat},${INNOVATION_LAB_COORDINATES.lng}`}
                target={contactFormData.map.header.buttons.getDirections.target}
                rel={contactFormData.map.header.buttons.getDirections.rel}
                className={contactFormData.map.header.buttons.getDirections.classes}
              >
                <svg
                  className={contactFormData.map.header.buttons.getDirections.icon.classes}
                  fill="none"
                  stroke="currentColor"
                  viewBox={contactFormData.map.header.buttons.getDirections.icon.viewBox}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {contactFormData.map.header.buttons.getDirections.icon.paths.map((path, index) => (
                    <path
                      key={index}
                      d={path.d}
                      strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      strokeWidth={path.strokeWidth}
                    ></path>
                  ))}
                </svg>
                {contactFormData.map.header.buttons.getDirections.text}
              </a>
              <button
                className={contactFormData.map.header.buttons.zoomMap.classes}
                onClick={() => {
                  if (mapRef.current) {
                    // Animate map zoom effect
                    gsap.to(mapRef.current, {
                      scale: 1.02,
                      duration: 0.5,
                      ease: "power2.out",
                      yoyo: true,
                      repeat: 1
                    });
                  }
                }}
              >
                <svg
                  className={contactFormData.map.header.buttons.zoomMap.icon.classes}
                  fill="none"
                  stroke="currentColor"
                  viewBox={contactFormData.map.header.buttons.zoomMap.icon.viewBox}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {contactFormData.map.header.buttons.zoomMap.icon.paths.map((path, index) => (
                    <path
                      key={index}
                      d={path.d}
                      strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      strokeWidth={path.strokeWidth}
                    ></path>
                  ))}
                </svg>
                {contactFormData.map.header.buttons.zoomMap.text}
              </button>
            </div>
          </div>
        </div>

        <div ref={mapRef} className={contactFormData.map.mapContainer.classes}>
          <div className={contactFormData.map.mapContainer.overlay.classes}></div>
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.3040468045287!2d${INNOVATION_LAB_COORDINATES.lng}!3d${INNOVATION_LAB_COORDINATES.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6c3912a93715%3A0x9e87b26012C23F0E!2sInnovation%20Lab!5e0!3m2!1sen!2snp!4v1647891702983!5m2!1sen!2snp&markers=color:red|label:I|${INNOVATION_LAB_COORDINATES.lat},${INNOVATION_LAB_COORDINATES.lng}`}
            width={contactFormData.map.mapContainer.iframe.width}
            height={contactFormData.map.mapContainer.iframe.height}
            style={contactFormData.map.mapContainer.iframe.style}
            allowFullScreen={contactFormData.map.mapContainer.iframe.allowFullScreen}
            loading={contactFormData.map.mapContainer.iframe.loading as "lazy" | "eager" | undefined}
            referrerPolicy={contactFormData.map.mapContainer.iframe.referrerPolicy as React.HTMLAttributeReferrerPolicy | undefined}
            title={contactFormData.map.mapContainer.iframe.title}
            aria-label={contactFormData.map.mapContainer.iframe.ariaLabel}
          ></iframe>

          {/* Map overlay with address card */}
          <div className={contactFormData.map.mapContainer.addressCard.classes}>
            <h3 className={contactFormData.map.mapContainer.addressCard.title.classes}>
              {contactFormData.map.mapContainer.addressCard.title.text}
            </h3>
            <p
              className={contactFormData.map.mapContainer.addressCard.address.classes}
              dangerouslySetInnerHTML={{ __html: contactFormData.map.mapContainer.addressCard.address.text }}
            ></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
