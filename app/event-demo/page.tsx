import React from 'react';
import ModernEventCard from '@/components/ui/ModernEventCard';

export default function EventDemoPage() {
  const sampleEvent = {
    id: 'iic-quest-3-0',
    title: 'IIC Quest 3.0',
    date: {
      month: 'June',
      day: '11',
      time: '08:00 A.M',
    },
    location: 'Itahari International College',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Modern Event Card Demo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ModernEventCard
            id={sampleEvent.id}
            title={sampleEvent.title}
            date={sampleEvent.date}
            location={sampleEvent.location}
            imageUrl={sampleEvent.imageUrl}
          />

          <ModernEventCard
            id="tech-workshop"
            title="Tech Workshop 2023"
            date={{
              month: 'July',
              day: '15',
              time: '10:00 A.M',
            }}
            location="Innovation Hub, Kathmandu"
            imageUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
          />

          <ModernEventCard
            id="coding-bootcamp"
            title="Coding Bootcamp"
            date={{
              month: 'Aug',
              day: '05',
              time: '09:30 A.M',
            }}
            location="Digital Campus, Pokhara"
            imageUrl="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
          />
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Full Width Event Card</h2>
          <ModernEventCard
            id="featured-event"
            title="Innovation Lab Presents IIC Quest 3.0"
            date={{
              month: 'June',
              day: '11',
              time: '08:00 A.M',
            }}
            location="Itahari International College"
            imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            fullWidth={true}
          />
        </div>
      </div>
    </main>
  );
}
