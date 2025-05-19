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

interface AgendaTableProps {
  items: AgendaItem[];
  dayTitle: string;
  dayDate: string;
}

const AgendaTable: React.FC<AgendaTableProps> = ({ items, dayTitle, dayDate }) => {
  return (
    <div className="mb-16 relative">
      {/* Day Header with Gradient Background */}
      <div className="bg-gradient-to-r from-[#0066FF] to-[#5045E8] rounded-xl p-5 mb-6 shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <h3 className="text-2xl font-bold text-white relative z-10 flex items-center">
          <span className="mr-3">{dayTitle}</span>
          <span className="text-lg font-medium opacity-90">{dayDate}</span>
        </h3>
      </div>

      {items.some(item => item.isSpecial) ? (
        // Special all-day event (like "Hackathon Continues")
        <div className="bg-[#2B5A1B] text-white text-center py-8 px-6 rounded-xl mb-4 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <h4 className="text-2xl font-bold relative z-10">
            {items.find(item => item.isSpecial)?.title || 'Hackathon Continues'}
          </h4>
          <p className="text-white/80 mt-2">Full day event</p>
        </div>
      ) : (
        // Regular table for events with enhanced styling
        <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th scope="col" className="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                  Time
                </th>
                <th scope="col" className="w-2/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event Details
                </th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => !item.isSpecial).map((item, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}
                >
                  <td className="px-6 py-5 text-sm font-medium text-[#0066FF] border-r border-gray-200">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {item.time}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-800">
                    {item.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Decorative element */}
      <div className="absolute -bottom-6 right-12 w-12 h-12 rounded-full bg-[#0066FF]/10 blur-xl"></div>
    </div>
  );
};

export default AgendaTable;
