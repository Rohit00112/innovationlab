"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

interface TeamCategory {
  id: string;
  name: string;
  members: TeamMember[];
}

const TeamMembersSection: React.FC = () => {
  // Team data
  const teamCategories: TeamCategory[] = [
    {
      id: 'leadership',
      name: 'Leadership Team',
      members: [
        {
          id: 'john-smith',
          name: 'John Smith',
          role: 'CEO & Founder',
          bio: 'John has over 15 years of experience in technology and innovation. He founded Innovation Lab with a vision to create a space where ideas could flourish and innovators could thrive.',
          imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        {
          id: 'sarah-johnson',
          name: 'Sarah Johnson',
          role: 'COO',
          bio: 'Sarah oversees the day-to-day operations of Innovation Lab. With a background in business management and startup acceleration, she ensures our programs run smoothly and effectively.',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        {
          id: 'michael-chen',
          name: 'Michael Chen',
          role: 'CTO',
          bio: 'Michael leads our technology initiatives and research programs. His expertise in emerging technologies helps guide our innovation strategy and technical mentorship programs.',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com'
          }
        }
      ]
    },
    {
      id: 'mentors',
      name: 'Mentors & Advisors',
      members: [
        {
          id: 'emily-wong',
          name: 'Emily Wong',
          role: 'Startup Advisor',
          bio: 'Emily has founded and exited three successful tech startups. She now mentors early-stage founders, helping them navigate the challenges of building a company.',
          imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com'
          }
        },
        {
          id: 'david-patel',
          name: 'David Patel',
          role: 'Technology Mentor',
          bio: 'David specializes in AI and machine learning. He helps startups implement cutting-edge technology solutions and build scalable tech infrastructure.',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com'
          }
        },
        {
          id: 'lisa-rodriguez',
          name: 'Lisa Rodriguez',
          role: 'Marketing Strategist',
          bio: 'Lisa helps startups develop effective marketing strategies. Her expertise in growth marketing has helped numerous companies achieve rapid user acquisition and retention.',
          imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        {
          id: 'james-wilson',
          name: 'James Wilson',
          role: 'Investment Advisor',
          bio: 'James has over a decade of experience in venture capital. He advises startups on fundraising strategies and helps connect them with potential investors.',
          imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com'
          }
        }
      ]
    },
    {
      id: 'staff',
      name: 'Program Staff',
      members: [
        {
          id: 'alex-kim',
          name: 'Alex Kim',
          role: 'Program Manager',
          bio: 'Alex oversees our startup accelerator program, coordinating mentorship sessions, workshops, and demo days for participating startups.',
          imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com'
          }
        },
        {
          id: 'priya-patel',
          name: 'Priya Patel',
          role: 'Education Coordinator',
          bio: 'Priya manages our educational programs, including workshops, training sessions, and student innovation initiatives.',
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        {
          id: 'marcus-johnson',
          name: 'Marcus Johnson',
          role: 'Research Lead',
          bio: 'Marcus leads our research initiatives, collaborating with academic institutions and industry partners on cutting-edge innovation projects.',
          imageUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
          socialLinks: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com'
          }
        }
      ]
    }
  ];

  // State for active category
  const [activeCategory, setActiveCategory] = useState<string>('leadership');

  // Get active category data
  const activeCategoryData = teamCategories.find(category => category.id === activeCategory) || teamCategories[0];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Our Team
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Meet the dedicated professionals who make Innovation Lab a hub for creativity, innovation, and growth.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {teamCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-[#0066FF] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-selected={activeCategory === category.id}
              role="tab"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Team members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCategoryData.members.map((member) => (
            <div key={member.id} className="team-member bg-white rounded-xl shadow-md overflow-hidden">
              {/* Member image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Member info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[#0066FF] font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">{member.bio}</p>
                
                {/* Social links */}
                {member.socialLinks && (
                  <div className="flex gap-3">
                    {member.socialLinks.linkedin && (
                      <a 
                        href={member.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#0066FF] transition-colors"
                        aria-label={`${member.name}'s LinkedIn profile`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a 
                        href={member.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#0066FF] transition-colors"
                        aria-label={`${member.name}'s Twitter profile`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {member.socialLinks.github && (
                      <a 
                        href={member.socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#0066FF] transition-colors"
                        aria-label={`${member.name}'s GitHub profile`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembersSection;
