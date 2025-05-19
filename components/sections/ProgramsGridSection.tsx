"use client";

import React, { useRef, useEffect, useState } from 'react';
import ProgramCard from '../ui/ProgramCard';
import SearchBar from '../ui/SearchBar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProgramsGridSectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProgramsGridSection: React.FC<ProgramsGridSectionProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Program data with categories
  const programs = [
    {
      title: 'Startup Accelerator',
      description: 'A 12-week program designed to help early-stage startups develop their ideas into viable businesses through mentorship, workshops, and networking.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/startup-accelerator',
      category: 'startup'
    },
    {
      title: 'Research Lab',
      description: 'Access cutting-edge technology and collaborate with experts to develop innovative solutions to complex problems in various domains.',
      imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/research-lab',
      category: 'research'
    },
    {
      title: 'Student Innovation',
      description: 'Empowering students to develop their entrepreneurial skills and innovative ideas through workshops, mentorship, and hands-on projects.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      link: '/programs/student-innovation',
      category: 'education'
    },
    {
      title: 'Corporate Innovation',
      description: 'Helping established companies foster a culture of innovation and develop new products, services, and business models.',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/corporate-innovation',
      category: 'corporate'
    },
    {
      title: 'Summer Enrichment',
      description: 'Intensive summer programs for students to explore emerging technologies and develop practical skills in a collaborative environment.',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/summer-enrichment',
      category: 'education'
    },
    {
      title: 'Workshops & Training',
      description: 'Specialized workshops and training sessions on various topics related to technology, entrepreneurship, and innovation.',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      link: '/programs/workshops',
      category: 'education'
    },
  ];

  // Filter categories
  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'startup', name: 'Startup Programs' },
    { id: 'research', name: 'Research Programs' },
    { id: 'education', name: 'Educational Programs' },
    { id: 'corporate', name: 'Corporate Programs' },
  ];

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter programs based on active category and search query
  const filteredPrograms = programs
    .filter(program => activeCategory === 'all' || program.category === activeCategory)
    .filter(program => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        program.title.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query)
      );
    });

  // Set up card animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate cards when they come into view
    const cards = sectionRef.current.querySelectorAll('.program-card');

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredPrograms]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24 bg-white"
      id="programs-grid"
    >
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Explore Our Programs
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            From startup incubation to corporate innovation, we offer a wide range of programs to support innovators at every stage.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-12">
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search programs..."
              className="filter-item"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 filter-item ${
                  activeCategory === category.id
                    ? 'bg-[#0066FF] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Programs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program, index) => (
            <div key={index} className="program-card opacity-0">
              <ProgramCard
                title={program.title}
                description={program.description}
                imageUrl={program.imageUrl}
                link={program.link}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No programs found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsGridSection;
