import React from 'react';

interface TimelineCardProps {
  year: string;
  title: string;
  description: string;
  iconBgColor: string;
  position: 'left' | 'right';
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  year,
  title,
  description,
  iconBgColor,
  position,
}) => {
  return (
    <div className={`flex items-center ${position === 'left' ? 'flex-row-reverse' : 'flex-row'} md:px-8`}>
      <div className={`w-1/2 ${position === 'left' ? 'pr-8 md:pr-12 text-right' : 'pl-8 md:pl-12'}`}>
        <div
          className={`bg-white rounded-xl shadow-xl p-8 border border-gray-100 hover-lift transition-all duration-500 group relative overflow-hidden ${position === 'left' ? 'ml-auto' : 'mr-auto'}`}
          style={{maxWidth: '580px'}}
        >
          {/* Decorative corner accent */}
          <div className={`absolute top-0 ${position === 'left' ? 'left-0' : 'right-0'} w-16 h-16 ${iconBgColor.replace('bg-', 'bg-opacity-10 bg-')} rounded-${position === 'left' ? 'br' : 'bl'}-3xl`}></div>

          {/* Background gradient on hover */}
          <div className={`absolute inset-0 ${iconBgColor.replace('bg-', 'bg-opacity-0 bg-')} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

          <div className="flex flex-col gap-3 mb-6 relative">
            <div className={`flex items-center gap-3 ${position === 'left' ? 'justify-end' : 'justify-start'}`}>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${iconBgColor} shadow-md`}>{year}</span>
            </div>
            <h3 className={`text-2xl font-bold text-gray-900 ${position === 'left' ? 'text-right' : 'text-left'} relative group-hover:text-[#0066FF] transition-colors duration-300`}>
              {title}
              <span className={`absolute -bottom-2 ${position === 'left' ? 'right-0' : 'left-0'} w-16 h-1 bg-gradient-to-r ${position === 'left' ? 'from-transparent to-' : 'from-'} ${iconBgColor.replace('bg-', '')} transition-all duration-300 group-hover:w-full`}></span>
            </h3>
          </div>

          <p className={`text-base leading-relaxed text-gray-800 ${position === 'left' ? 'text-right' : 'text-left'}`}>
            {description}
          </p>

          {/* Learn more link */}
          <div className={`mt-6 flex ${position === 'left' ? 'justify-end' : 'justify-start'}`}>
            <button className={`text-sm font-medium ${iconBgColor.replace('bg-', 'text-')} hover:opacity-80 flex items-center transition-colors duration-300`}>
              {position === 'right' ? (
                <>
                  Learn more
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Learn more
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center z-10">
        {/* Main circle */}
        <div className={`w-20 h-20 rounded-full ${iconBgColor} flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.2734 17.9999C14.2734 17.9999 9.00001 17.7254 9.00001 13.8634C9.00001 10.0015 14.2734 9.72697 14.2734 9.72697M14.2734 9.72697C14.2734 9.72697 14.2734 8.90906 14.2734 6.00001M14.2734 9.72697L19 6.00001M4.99999 21L7.5 12L4.99999 3H19L16.5 12L19 21H4.99999Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Pulse effect */}
        <div className={`absolute w-20 h-20 rounded-full ${iconBgColor.replace('bg-', 'bg-opacity-30 bg-')} animate-pulse`} style={{ animationDuration: '3s' }}></div>

        {/* Outer ring */}
        <div className={`absolute w-28 h-28 rounded-full border-2 ${iconBgColor.replace('bg-', 'border-opacity-20 border-')} animate-spin`} style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="w-1/2"></div>
    </div>
  );
};

export default TimelineCard;
