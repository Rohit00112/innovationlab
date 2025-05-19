import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  category: string;
  categoryColor: string;
  isFeatured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location,
  description,
  imageUrl,
  category,
  categoryColor,
  isFeatured = false,
}) => {
  return (
    <div className={`flex flex-col bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${isFeatured ? 'lg:flex-row' : ''}`}>
      {/* Event Image */}
      <div className={`relative ${isFeatured ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-48'}`}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white font-semibold shadow-sm ${categoryColor}`}>
          {category}
        </div>
      </div>

      {/* Event Content */}
      <div className={`flex flex-col p-6 ${isFeatured ? 'lg:w-1/2 lg:p-8' : ''}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#4B5563" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{time}</span>
          </div>
        </div>

        <h3 className={`font-bold ${isFeatured ? 'text-2xl mb-3' : 'text-xl mb-2'} text-gray-900`}>
          {title}
        </h3>

        <div className="flex items-center gap-1 text-sm text-gray-700 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#4B5563" strokeWidth="1.5"/>
            <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="#4B5563" strokeWidth="1.5"/>
          </svg>
          <span>{location}</span>
        </div>

        <p className={`text-gray-800 ${isFeatured ? 'text-base mb-6' : 'text-sm mb-4'} line-clamp-2`}>
          {description}
        </p>

        <Link
          href={`/events/${id}`}
          className={`mt-auto inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isFeatured ? 'bg-[#0055D4] text-white hover:bg-[#004BBB]' : 'bg-white text-[#0055D4] border border-[#0055D4] hover:bg-blue-50'}`}
        >
          {isFeatured ? 'Register Now' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
