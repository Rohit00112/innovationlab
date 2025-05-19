import React from 'react';
import ProgramDetailsPage from '@/components/pages/ProgramDetailsPage';
import Layout from '@/components/layout/Layout';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Sample program data - in a real app, this would come from a database or API
const programs = [
  {
    id: 'startup-accelerator',
    title: 'Startup Accelerator',
    tagline: 'Turning Ideas into Successful Businesses',
    description: 'Our 12-week Startup Accelerator program is designed to help early-stage startups develop their ideas into viable businesses. Through a combination of mentorship, workshops, networking events, and access to resources, we provide founders with the tools and support they need to accelerate their growth and secure funding. The program culminates in a Demo Day where startups pitch to investors and industry leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    duration: '12 Weeks',
    startDate: 'January 15, 2024',
    location: 'Innovation Lab Campus',
    eligibility: [
      'Early-stage startups with a minimum viable product',
      'Committed founding team of at least 2 members',
      'Innovative solution addressing a significant market need',
      'Potential for scalability and growth',
      'Commitment to full-time participation in the program'
    ],
    benefits: [
      {
        title: 'Expert Mentorship',
        description: 'Access to a network of experienced mentors from various industries who provide guidance and feedback.',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
      },
      {
        title: 'Funding Opportunities',
        description: 'Connections to investors and potential funding sources, including seed funding for selected startups.',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        title: 'Workspace & Resources',
        description: 'Access to our state-of-the-art facilities, including co-working space, meeting rooms, and prototyping labs.',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      },
      {
        title: 'Networking Events',
        description: 'Regular networking events with industry leaders, potential customers, and other entrepreneurs.',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
      }
    ],
    curriculum: [
      'Week 1-2: Business Model Validation',
      'Week 3-4: Product Development & User Testing',
      'Week 5-6: Market Strategy & Customer Acquisition',
      'Week 7-8: Financial Planning & Fundraising',
      'Week 9-10: Scaling & Growth Strategies',
      'Week 11-12: Pitch Preparation & Demo Day'
    ],
    mentors: [
      {
        name: 'Sarah Johnson',
        role: 'Serial Entrepreneur & Investor',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
        bio: 'Sarah has founded and exited three successful tech startups and now invests in early-stage companies.'
      },
      {
        name: 'Michael Chen',
        role: 'Product Development Expert',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
        bio: 'Michael has 15+ years of experience in product development and has helped numerous startups build scalable products.'
      },
      {
        name: 'Priya Patel',
        role: 'Marketing Strategist',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1288&q=80',
        bio: 'Priya specializes in growth marketing and has helped startups achieve rapid user acquisition and retention.'
      }
    ],
    relatedPrograms: [
      {
        id: 'research-lab',
        title: 'Research Lab',
        description: 'Access cutting-edge technology and collaborate with experts to develop innovative solutions to complex problems.',
        imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      },
      {
        id: 'corporate-innovation',
        title: 'Corporate Innovation',
        description: 'Helping established companies foster a culture of innovation and develop new products and services.',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }
    ]
  },
  {
    id: 'research-lab',
    title: 'Research Lab',
    tagline: 'Pushing the Boundaries of Innovation',
    description: 'Our Research Lab provides access to cutting-edge technology and expert collaboration to develop innovative solutions to complex problems. Researchers, entrepreneurs, and organizations can utilize our state-of-the-art facilities and equipment to prototype, test, and refine their ideas. Our team of experts provides guidance and support throughout the research and development process.',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    duration: 'Flexible',
    startDate: 'Rolling Admissions',
    location: 'Innovation Lab Campus',
    eligibility: [
      'Researchers with a clear project proposal',
      'Startups developing hardware or technology products',
      'Organizations seeking R&D support',
      'Academic institutions for collaborative research',
      'Commitment to sharing research findings'
    ],
    benefits: [
      {
        title: 'Advanced Equipment',
        description: 'Access to state-of-the-art equipment and technology for prototyping and testing.',
        icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
      },
      {
        title: 'Expert Collaboration',
        description: 'Collaboration with our team of experts in various fields of technology and innovation.',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
      },
      {
        title: 'Funding Opportunities',
        description: 'Access to research grants and funding opportunities for promising projects.',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        title: 'Intellectual Property Support',
        description: 'Guidance on intellectual property protection and commercialization strategies.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
      }
    ],
    curriculum: [
      'Project Scoping & Planning',
      'Resource Allocation & Team Formation',
      'Prototyping & Development',
      'Testing & Validation',
      'Refinement & Optimization',
      'Commercialization Strategy'
    ],
    relatedPrograms: [
      {
        id: 'startup-accelerator',
        title: 'Startup Accelerator',
        description: 'A 12-week program designed to help early-stage startups develop their ideas into viable businesses.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      },
      {
        id: 'student-innovation',
        title: 'Student Innovation',
        description: 'Empowering students to develop their entrepreneurial skills and innovative ideas.',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
      }
    ]
  }
];

// Generate metadata for this page
export async function generateMetadata({ params }: { params: Promise<{ programId: string }> }): Promise<Metadata> {
  // Await the params object to get the programId
  const resolvedParams = await params;

  // Find the program with the matching ID
  const program = programs.find(program => program.id === resolvedParams.programId);

  // If no program is found, return default metadata
  if (!program) {
    return {
      title: 'Program Not Found | Innovation Lab',
      description: 'The requested program could not be found.',
    };
  }

  return {
    title: `${program.title} | Innovation Lab Programs`,
    description: program.description.substring(0, 160) + '...',
    openGraph: {
      title: `${program.title} | Innovation Lab Programs`,
      description: program.description.substring(0, 160) + '...',
      url: `https://innovationlab.com/programs/${program.id}`,
      siteName: 'Innovation Lab',
      images: [
        {
          url: program.imageUrl,
          width: 1200,
          height: 630,
          alt: program.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function ProgramDetails({ params }: { params: Promise<{ programId: string }> }) {
  // Await the params object to get the programId
  const resolvedParams = await params;

  // Find the program with the matching ID
  const program = programs.find(program => program.id === resolvedParams.programId);

  // If no program is found, return 404
  if (!program) {
    notFound();
  }

  return (
    <Layout>
      <ProgramDetailsPage program={program} />
    </Layout>
  );
}
