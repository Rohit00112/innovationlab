'use client';

import React from 'react';

// Use the same interface as in EventDetailsPage.tsx
interface AgendaItem {
  time: string;
  title: string;
  description: string;
  day?: string;
  date?: string;
  isHidden?: boolean;
  isSpecial?: boolean;
}

interface AgendaTimelineProps {
  items: AgendaItem[];
  dayTitle: string;
  dayDate: string;
}

const AgendaTimeline: React.FC<AgendaTimelineProps> = ({ items, dayTitle, dayDate }) => {
  return (
    <div className="mb-16 relative">
      {/* Day Header with Gradient Background */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-[#0066FF] text-white font-bold text-xl shadow-lg">
          {dayTitle.split(' ')[1]}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {dayTitle}
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
            <span className="text-lg font-medium text-gray-600">{dayDate}</span>
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-full mt-2"></div>
        </div>
      </div>

      {items.some(item => item.isSpecial) ? (
        // Special all-day event (like "Hackathon Continues")
        <div className="bg-gradient-to-r from-[#0066FF] to-[#5045E8] text-white text-center py-8 px-6 rounded-xl mb-4 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <h4 className="text-2xl font-bold relative z-10">
            {items.find(item => item.isSpecial)?.title || 'Hackathon Continues'}
          </h4>
          <p className="text-white/80 mt-2">Full day event</p>
        </div>
      ) : (
        // Timeline style for regular events
        <div className="relative pl-10 before:content-[''] before:absolute before:left-4 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-[#0066FF] before:to-[#5045E8] before:rounded-full">
          {items.filter(item => !item.isSpecial).map((item, index) => (
            <div
              key={index}
              className="relative mb-10 last:mb-0 group"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-[#0066FF] flex items-center justify-center -translate-x-[14px] mt-1 shadow-md group-hover:scale-110 transition-transform duration-300">
                <div className="w-3 h-3 rounded-full bg-[#0066FF]"></div>
              </div>

              {/* Time badge */}
              <div className="inline-block bg-[#0066FF] text-white font-semibold px-4 py-1.5 rounded-full text-sm mb-3">
                {item.time}
              </div>

              {/* Content card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#0066FF] hover:shadow-lg transition-all duration-300 group-hover:translate-x-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h4>
                {item.description && item.description !== item.title && (
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decorative element */}
      <div className="absolute -bottom-6 right-12 w-12 h-12 rounded-full bg-[#0066FF]/10 blur-xl"></div>
    </div>
  );
};

export default AgendaTimeline;
