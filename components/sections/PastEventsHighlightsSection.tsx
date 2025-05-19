"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PastEventsHighlightsSection: React.FC = () => {
  // Sample highlights data
  const highlights = [
    {
      id: 'tech-summit-2023',
      title: 'Tech Summit 2023',
      description: 'Our flagship annual conference brought together over 500 innovators, entrepreneurs, and industry leaders to discuss the future of technology and innovation.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      stats: {
        attendees: '500+',
        speakers: '25',
        workshops: '12'
      },
      testimonial: {
        quote: 'The Tech Summit was an incredible experience. The quality of speakers and networking opportunities were exceptional.',
        author: 'Rahul Sharma',
        role: 'CEO, TechNova'
      }
    },
    {
      id: 'hackathon-2022',
      title: 'Hackathon 2022',
      description: 'A 48-hour coding marathon that challenged participants to develop innovative solutions to real-world problems. The event saw participation from over 200 developers forming 50 teams.',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      stats: {
        attendees: '200+',
        teams: '50',
        projects: '45'
      },
      testimonial: {
        quote: 'The hackathon was well-organized and provided a great platform for showcasing our skills and creativity.',
        author: 'Priya Patel',
        role: 'Software Developer'
      }
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Event Highlights
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Take a look at some of our most impactful past events and their outcomes.
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-20">
          {highlights.map((highlight, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center highlight-item ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={highlight.imageUrl}
                    alt={highlight.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between">
                    <div className="text-white">
                      <p className="text-sm font-medium text-white/80">Attendees</p>
                      <p className="text-2xl font-bold">{highlight.stats.attendees}</p>
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-medium text-white/80">
                        {highlight.stats.speakers ? 'Speakers' : 'Teams'}
                      </p>
                      <p className="text-2xl font-bold">
                        {highlight.stats.speakers || highlight.stats.teams}
                      </p>
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-medium text-white/80">
                        {highlight.stats.workshops ? 'Workshops' : 'Projects'}
                      </p>
                      <p className="text-2xl font-bold">
                        {highlight.stats.workshops || highlight.stats.projects}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{highlight.title}</h3>
                <p className="text-lg text-gray-700 mb-6">{highlight.description}</p>
                
                {/* Testimonial */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 relative">
                  {/* Quote icon */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  <p className="text-gray-700 italic mb-4">{highlight.testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                      {highlight.testimonial.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{highlight.testimonial.author}</p>
                      <p className="text-sm text-gray-600">{highlight.testimonial.role}</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href={`/events/${highlight.id}`} 
                  className="inline-flex items-center text-[#0066FF] font-medium hover:underline"
                >
                  View Event Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastEventsHighlightsSection;
