"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../ui/Button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProgramBenefit {
  title: string;
  description: string;
  icon: string;
}

interface ProgramMentor {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

interface RelatedProgram {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ProgramDetailsProps {
  program: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    imageUrl: string;
    duration: string;
    startDate: string;
    location: string;
    eligibility: string[];
    benefits: ProgramBenefit[];
    curriculum: string[];
    mentors?: ProgramMentor[];
    relatedPrograms: RelatedProgram[];
  };
}

const ProgramDetailsPage: React.FC<ProgramDetailsProps> = ({ program }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const mentorsRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);
  
  // Set up animations
  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        heroRef.current.querySelectorAll('.hero-title, .hero-tagline, .hero-description, .hero-cta'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
      );
    }
    
    // Tab content animations
    const animateTabContent = (element: HTMLElement) => {
      gsap.fromTo(
        element.querySelectorAll('.animate-tab-item'),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    };
    
    if (overviewRef.current && activeTab === 'overview') {
      animateTabContent(overviewRef.current);
    }
    
    if (curriculumRef.current && activeTab === 'curriculum') {
      animateTabContent(curriculumRef.current);
    }
    
    if (mentorsRef.current && activeTab === 'mentors') {
      animateTabContent(mentorsRef.current);
    }
    
    if (applyRef.current && activeTab === 'apply') {
      animateTabContent(applyRef.current);
    }
    
    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeTab]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div ref={heroRef} className="relative pt-20">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={program.imageUrl}
            alt={program.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0066FF]/80 to-[#21409A]/90"></div>
        </div>
        
        <div className="container relative z-10 py-20 md:py-28">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 hero-title">
              {program.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 hero-tagline">
              {program.tagline}
            </p>
            <p className="text-lg text-white/80 mb-8 hero-description">
              {program.description.substring(0, 150)}...
            </p>
            <div className="flex flex-wrap gap-4 hero-cta">
              <Button 
                href="#apply" 
                variant="primary"
                className="bg-white text-[#0066FF] hover:bg-white/90"
              >
                Apply Now
              </Button>
              <Button 
                href="#overview" 
                variant="outline"
                className="border-white/70 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Program quick info */}
        <div className="bg-white py-6 shadow-md relative z-10">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">{program.duration}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold text-gray-900">{program.startDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{program.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="sticky top-20 bg-white shadow-sm z-30">
        <div className="container">
          <div className="flex overflow-x-auto py-4 gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-medium whitespace-nowrap pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#0066FF] text-[#0066FF]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`text-sm font-medium whitespace-nowrap pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-[#0066FF] text-[#0066FF]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Curriculum
            </button>
            {program.mentors && (
              <button
                onClick={() => setActiveTab('mentors')}
                className={`text-sm font-medium whitespace-nowrap pb-2 px-1 border-b-2 transition-colors ${
                  activeTab === 'mentors'
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Mentors
              </button>
            )}
            <button
              onClick={() => setActiveTab('apply')}
              className={`text-sm font-medium whitespace-nowrap pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'apply'
                  ? 'border-[#0066FF] text-[#0066FF]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container py-12">
        {/* Overview Tab */}
        <div 
          ref={overviewRef}
          className={`${activeTab === 'overview' ? 'block' : 'hidden'}`}
          id="overview"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 animate-tab-item">Program Overview</h2>
              <div className="prose prose-lg max-w-none animate-tab-item">
                <p>{program.description}</p>
              </div>
              
              <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-900 animate-tab-item">Program Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {program.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4 animate-tab-item">
                    <div className="w-12 h-12 rounded-lg bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={benefit.icon}></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-700">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm animate-tab-item">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Eligibility</h3>
                <ul className="space-y-3">
                  {program.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#0066FF] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-[#0066FF] to-[#5045E8] rounded-xl p-6 text-white shadow-lg animate-tab-item">
                <h3 className="text-xl font-bold mb-4">Ready to Apply?</h3>
                <p className="mb-6">Applications for the next cohort are now open. Don't miss this opportunity to accelerate your innovation journey.</p>
                <Button 
                  href="#apply" 
                  variant="primary"
                  className="w-full bg-white text-[#0066FF] hover:bg-white/90"
                  onClick={() => setActiveTab('apply')}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related Programs */}
          <div className="mt-16 animate-tab-item">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Related Programs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {program.relatedPrograms.map((relatedProgram, index) => (
                <Link 
                  key={index} 
                  href={`/programs/${relatedProgram.id}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={relatedProgram.imageUrl}
                      alt={relatedProgram.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                      {relatedProgram.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {relatedProgram.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;
