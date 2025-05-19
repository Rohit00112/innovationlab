import React from 'react';
import Link from 'next/link';

interface CalendarEventProps {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  categoryColor: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({
  id,
  title,
  date,
  time,
  category,
  categoryColor,
}) => {
  return (
    <Link href={`/events/${id}`} className="group">
      <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center min-w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <span className="text-xs font-medium text-gray-600">{date.split(' ')[0]}</span>
          <span className="text-xl font-bold text-gray-900">{date.split(' ')[1].replace(',', '')}</span>
          <span className="text-xs font-medium text-gray-600">{date.split(' ')[2]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block w-2 h-2 rounded-full ${categoryColor}`}></span>
            <span className="text-xs font-medium text-gray-700">{category}</span>
          </div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#0055D4] transition-colors duration-300 mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{time}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const EventsCalendarSection: React.FC = () => {
  // Sample calendar events data
  const calendarEvents = [
    {
      id: 'tech-summit-2023',
      title: 'Innovation Tech Summit 2023',
      date: 'Nov 15, 2023',
      time: '9:00 AM - 5:00 PM',
      category: 'Conference',
      categoryColor: 'bg-[#0066FF]',
    },
    {
      id: 'ai-workshop',
      title: 'AI for Startups Workshop',
      date: 'Nov 22, 2023',
      time: '2:00 PM - 4:00 PM',
      category: 'Workshop',
      categoryColor: 'bg-[#5045E8]',
    },
    {
      id: 'startup-pitch',
      title: 'Startup Pitch Competition',
      date: 'Dec 5, 2023',
      time: '3:00 PM - 6:00 PM',
      category: 'Competition',
      categoryColor: 'bg-[#EEAE22]',
    },
    {
      id: 'sustainability-forum',
      title: 'Sustainability Innovation Forum',
      date: 'Dec 12, 2023',
      time: '10:00 AM - 1:00 PM',
      category: 'Forum',
      categoryColor: 'bg-[#00C853]',
    },
    {
      id: 'networking-night',
      title: 'Entrepreneur Networking Night',
      date: 'Dec 18, 2023',
      time: '6:00 PM - 8:00 PM',
      category: 'Networking',
      categoryColor: 'bg-[#EEAE22]',
    },
    {
      id: 'year-end-showcase',
      title: 'Year-End Innovation Showcase',
      date: 'Dec 22, 2023',
      time: '1:00 PM - 5:00 PM',
      category: 'Showcase',
      categoryColor: 'bg-[#0066FF]',
    },
  ];

  return (
    <section id="calendar" className="py-20 md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Calendar Info */}
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Events Calendar</h2>
            <p className="text-base text-gray-600 mb-6">
              Stay up-to-date with our upcoming events. Add them to your calendar and never miss an opportunity to learn and connect.
            </p>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#0055D4]"></span>
                  <span className="text-sm text-gray-800">Conferences & Summits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#4538D9]"></span>
                  <span className="text-sm text-gray-800">Workshops & Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#D99B22]"></span>
                  <span className="text-sm text-gray-800">Competitions & Networking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#00A344]"></span>
                  <span className="text-sm text-gray-800">Forums & Seminars</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link
                  href="/events/calendar"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#0055D4] text-white text-sm font-medium rounded-md hover:bg-[#004BBB] transition-colors"
                >
                  View Full Calendar
                </Link>
              </div>
            </div>
          </div>

          {/* Calendar Events */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded hover:bg-gray-100" aria-label="Previous month">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 19L8 12L15 5" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-800">November - December 2023</span>
                  <button className="p-1 rounded hover:bg-gray-100" aria-label="Next month">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L16 12L9 19" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-1 divide-y divide-gray-100">
                {calendarEvents.map((event) => (
                  <CalendarEvent key={event.id} {...event} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsCalendarSection;
