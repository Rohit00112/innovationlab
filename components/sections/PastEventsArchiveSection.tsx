"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ModernEventCard from '../ui/ModernEventCard';
import SearchBar from '../ui/SearchBar';

interface PastEventsArchiveSectionProps {
  activeYear: string;
  activeCategory: string;
  onYearChange: (year: string) => void;
  onCategoryChange: (category: string) => void;
}

const PastEventsArchiveSection: React.FC<PastEventsArchiveSectionProps> = ({
  activeYear,
  activeCategory,
  onYearChange,
  onCategoryChange
}) => {
  // Sample past events data
  const pastEvents = [
    {
      id: 'tech-summit-2023',
      title: 'Tech Summit 2023',
      date: {
        month: 'Nov',
        day: '15',
        time: '09:00 A.M',
        year: '2023'
      },
      location: 'Innovation Hub, Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      category: 'conference',
      resources: {
        recordings: true,
        presentations: true,
        photos: true
      }
    },
    {
      id: 'ai-workshop-2023',
      title: 'AI Workshop Series',
      date: {
        month: 'Oct',
        day: '05',
        time: '10:00 A.M',
        year: '2023'
      },
      location: 'Digital Campus, Pokhara',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      category: 'workshop',
      resources: {
        recordings: true,
        presentations: true,
        photos: false
      }
    },
    {
      id: 'startup-weekend-2023',
      title: 'Startup Weekend 2023',
      date: {
        month: 'Sept',
        day: '22',
        time: '08:30 A.M',
        year: '2023'
      },
      location: 'Business Hub, Lalitpur',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
      category: 'hackathon',
      resources: {
        recordings: false,
        presentations: true,
        photos: true
      }
    },
    {
      id: 'innovation-forum-2023',
      title: 'Innovation Forum 2023',
      date: {
        month: 'Aug',
        day: '10',
        time: '11:00 A.M',
        year: '2023'
      },
      location: 'Convention Center, Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
      category: 'conference',
      resources: {
        recordings: true,
        presentations: true,
        photos: true
      }
    },
    {
      id: 'tech-meetup-july-2023',
      title: 'Tech Meetup July 2023',
      date: {
        month: 'July',
        day: '25',
        time: '06:00 P.M',
        year: '2023'
      },
      location: 'Innovation Lab Campus',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop',
      category: 'meetup',
      resources: {
        recordings: false,
        presentations: true,
        photos: true
      }
    },
    {
      id: 'design-thinking-workshop-2022',
      title: 'Design Thinking Workshop',
      date: {
        month: 'Dec',
        day: '12',
        time: '10:00 A.M',
        year: '2022'
      },
      location: 'Creative Hub, Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
      category: 'workshop',
      resources: {
        recordings: true,
        presentations: true,
        photos: true
      }
    },
    {
      id: 'tech-summit-2022',
      title: 'Tech Summit 2022',
      date: {
        month: 'Nov',
        day: '18',
        time: '09:00 A.M',
        year: '2022'
      },
      location: 'Innovation Hub, Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      category: 'conference',
      resources: {
        recordings: true,
        presentations: true,
        photos: true
      }
    },
    {
      id: 'hackathon-2022',
      title: 'Hackathon 2022',
      date: {
        month: 'Oct',
        day: '08',
        time: '08:00 A.M',
        year: '2022'
      },
      location: 'Tech Campus, Pokhara',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      category: 'hackathon',
      resources: {
        recordings: false,
        presentations: true,
        photos: true
      }
    },
  ];

  // Filter years
  const years = ['all', '2023', '2022', '2021'];

  // Filter categories
  const categories = ['all', 'conference', 'workshop', 'hackathon', 'meetup'];

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter events based on active filters and search query
  const filteredEvents = pastEvents.filter(event => {
    const yearMatch = activeYear === 'all' || event.date.year === activeYear;
    const categoryMatch = activeCategory === 'all' || event.category === activeCategory;

    // Search query filter
    let searchMatch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      searchMatch =
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
    }

    return yearMatch && categoryMatch && searchMatch;
  });

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Browse Past Events
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Explore our archive of past events and access recordings, presentations, and resources.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8 filter-item">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search past events..."
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
            {/* Year filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Year</h3>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => onYearChange(year)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 filter-item ${
                      activeYear === year
                        ? 'bg-[#0066FF] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year === 'all' ? 'All Years' : year}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 filter-item ${
                      activeCategory === category
                        ? 'bg-[#0066FF] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div key={index} className="event-card">
              <ModernEventCard
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                imageUrl={event.imageUrl}
              />
              {/* Resources badges */}
              <div className="flex gap-2 mt-3 px-2">
                {event.resources.recordings && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Recording
                  </span>
                )}
                {event.resources.presentations && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Slides
                  </span>
                )}
                {event.resources.photos && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Photos
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PastEventsArchiveSection;
