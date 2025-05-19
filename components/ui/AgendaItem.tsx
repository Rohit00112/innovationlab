'use client';

import React from 'react';

interface AgendaItemProps {
  time: string;
  title: string;
  description: string;
  day?: string;
  date?: string;
  isFirst?: boolean;
  isSpecial?: boolean;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  time,
  title,
  description,
  day,
  isFirst = false,
  isSpecial = false
}) => {
  // Special styling for all-day events like "Hackathon Continues"
  if (isSpecial) {
    return (
      <div className={`flex flex-col bg-gradient-to-r from-[#0066FF] to-[#5045E8] text-white rounded-lg p-5 my-4 shadow-md hover:shadow-lg transition-shadow duration-300 ${isFirst ? 'mt-6' : ''}`}>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-white/90">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex border-l-4 border-[#0066FF] pl-4 py-4 mb-4 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${isFirst ? 'mt-6' : ''}`}>
      <div className="w-24 flex-shrink-0">
        <div className="text-[#0066FF] font-bold">{time}</div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default AgendaItem;
