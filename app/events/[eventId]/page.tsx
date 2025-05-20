import React from 'react';
import EventDetailsPage from '@/components/pages/EventDetailsPage';
import Layout from '@/components/layout/Layout';
import { notFound } from 'next/navigation';

// Sample event data - in a real app, this would come from a database or API
const events = [
  {
    id: 'iic-quest-3.0',
    title: 'IIC Quest 3.0',
    tagline: 'Innovation Lab Presents',
    date: {
      month: 'June',
      day: '11',
      time: '07:00 A.M',
    },
    location: 'Itahari International College',
    description: 'IICQuest 3.0 stands as the third chapter in the growing legacy of innovation organized by Innovation Lab at Itahari International College. Evolving from the foundations of IICQuest 1.0 and 2.0, this year’s program offers a dynamic 3-day experience centered around a 36-hours hackathon that empowers students to build impactful, real-world solutions. This event will be commenced on June 11, 2025 and will end on June 13, 2025.Complementing the hackathon is a Talent and Innovation Showcase featuring a Job Fair and Project Exhibition, creating opportunities for industry interaction, career exploration, and academic recognition. IICQuest 3.0 is not just a continuation—it is a platform where innovation meets opportunity where code meets cause, and where student potential finds its purpose.',
    expectations: [
      'Networking opportunities with like-minded professionals',
      'Hands-on collaborative sessions with industry experts',
      'Practical skills and knowledge you can apply immediately',
      'Certificate and recognization'
    ],
    imageUrl: '/images/event_detail_hero.JPG',
    agendaItems: [
      // Day 1 - June 11, Wednesday
      {
        day: 'Day 1',
        date: 'June 11, Wednesday',
        time: '07:00 A.M',
        title: 'Participants arrival at Itahari International College',
        description: 'Participants arrival at Itahari International College',
        isHidden: false
      },
      {
        day: 'Day 1',
        date: 'June 11, Wednesday',
        time: '09:30 A.M',
        title: 'Hackathon Theme Introduction',
        description: 'Hackathon Theme Introduction',
        isHidden: false
      },
      {
        day: 'Day 1',
        date: 'June 11, Wednesday',
        time: '12:00 P.M',
        title: 'Proposal Submission & Hackathon Kickoff',
        description: 'Proposal Submission & Hackathon Kickoff',
        isHidden: false
      },

      // Day 2 - June 12, Thursday
      {
        day: 'Day 2',
        date: 'June 12, Thursday',
        time: 'All Day',
        title: 'Hackathon Continues',
        description: 'Hackathon Continues',
        isHidden: false,
        isSpecial: true
      },

      // Day 3 - June 13, Friday
      {
        day: 'Day 3',
        date: 'June 13, Friday',
        time: '07:00 A.M',
        title: 'Presentation & Demo Starts',
        description: 'Presentation & Demo Starts',
        isHidden: true
      },
      {
        day: 'Day 3',
        date: 'June 13, Friday',
        time: '12:00 P.M',
        title: 'Submission',
        description: 'Submission',
        isHidden: true
      },
      {
        day: 'Day 3',
        date: 'June 13, Friday',
        time: '12:30 P.M',
        title: 'Panel Discussion',
        description: 'Panel Discussion',
        isHidden: true
      },
      {
        day: 'Day 3',
        date: 'June 13, Friday',
        time: '01:30 P.M',
        title: 'Formal & Informal Programs',
        description: 'Formal & Informal Programs',
        isHidden: true
      },
      {
        day: 'Day 3',
        date: 'June 13, Friday',
        time: '02:00 P.M',
        title: 'Winner Announcement & Prize Distribution',
        description: 'Winner Announcement & Prize Distribution',
        isHidden: true
      },
      {
        day: 'Day 3',
        date: 'June 13, Friday',
        time: '04:00 P.M',
        title: 'Departure from College',
        description: 'Departure from College',
        isHidden: true
      }
    ],
    subEvents: [
      {
        id: 'job-fair',
        title: 'Job Fair',
        description: 'Job Fair is a dedicated space for bridging the gap between emerging talent and real-world opportunities. Hosted alongside the hackathon, this fair brings together top students and leading tech companies, startups, and organizations from across the region. For Employers: Discover skilled candidates with real project experience, technical acumen, and collaborative spirit—all in one place. For Students: Get access to exclusive internship and job openings, and network directly with recruiters and company representatives. What to Expect? Company booths & career counselors, on-the-spot interview screenings, networking opportunities with tech founders & hiring managers, shortlisting for internships and entry-level tech roles. Open to all final-year and interested undergraduate and graduate students.',
        date: {
          month: 'June',
          day: '12',
          time: '10:00 A.M',
        },
        location: 'Itahari International College',
        imageUrl: '/images/job_fair.JPG',
        category: 'Career'
      },
      {
        id: 'project-exhibition',
        title: 'Project Exhibition',
        description: 'The Project Exhibition at IICQuest 3.0 celebrates the creativity, hard work, and technical prowess of graduating students. This platform allows students to present their academic projects to a wide audience, including peers, faculty, industry professionals, and recruiters. Highlights include live project demonstrations and prototypes, interactive Q&A sessions with industry experts, real-time feedback and improvement suggestions, opportunities for collaboration and networking, and recognition for outstanding and socially impactful projects. Why Visit? Get inspired by student-led innovation, discover practical solutions to real-world problems, and connect with the next generation of innovators and problem solvers.',
        date: {
          month: 'June',
          day: '11-13',
          time: '11:00 A.M',
        },
        location: 'Itahari International College',
        imageUrl: '/images/project_exhibition.JPG',
        category: 'Innovation'
      },

    ],
    galleryImages: [
      {
        id: 'gallery-1',
        imageUrl: '/event_gallery1.JPG',
        title: 'Opening Keynote',
        description: 'The opening keynote session with industry leaders discussing innovation trends.',
        category: 'Keynote'
      },
      {
        id: 'gallery-2',
        imageUrl: '/event_gallery2.JPG',
        title: 'Workshop Session',
        description: 'Hands-on workshop on emerging technologies led by expert facilitators.',
        category: 'Workshop'
      },
      {
        id: 'gallery-3',
        imageUrl: '/event_gallery3.JPG',
        title: 'Coding Challenge',
        description: 'Participants engaged in the live coding challenge competition.',
        category: 'Competition'
      },
      {
        id: 'gallery-4',
        imageUrl: '/event_gallery4.JPG',
        title: 'Panel Discussion',
        description: 'Expert panel discussing the future of technology and innovation.',
        category: 'Discussion'
      },
      {
        id: 'gallery-5',
        imageUrl: '/event_gallery5.JPG',
        title: 'Networking Session',
        description: 'Attendees connecting and sharing ideas during the networking break.',
        category: 'Networking'
      },
      {
        id: 'gallery-6',
        imageUrl: '/event_gallery6.JPG',
        title: 'Project Showcase',
        description: 'Innovative projects being presented by talented participants.',
        category: 'Showcase'
      }
    ],
    relatedEvents: [
      {
        id: 'tech-workshop',
        title: 'Tech Workshop 2023',
        date: {
          month: 'July',
          day: '15',
          time: '10:00 A.M',
        },
        location: 'Innovation Hub, Kathmandu',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'coding-bootcamp',
        title: 'Coding Bootcamp',
        date: {
          month: 'Aug',
          day: '05',
          time: '09:30 A.M',
        },
        location: 'Digital Campus, Pokhara',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'creative-clash',
        title: 'Creative Clash',
        date: {
          month: 'Sept',
          day: '20',
          time: '11:00 A.M',
        },
        location: 'Design Studio, Lalitpur',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
      }
    ]
  }
];

// Following the Next.js 15 documentation for dynamic routes
export default async function EventDetails({
  params
}: {
  params: Promise<{ eventId: string }>
}) {
  // In Next.js 15, params is a Promise that must be awaited
  const { eventId } = await params;

  // Find the event with the matching ID
  const event = events.find(event => event.id === eventId);

  // If no event is found, return 404
  if (!event) {
    notFound();
  }

  return (
    <Layout>
      <EventDetailsPage event={event} />
    </Layout>
  );
}
