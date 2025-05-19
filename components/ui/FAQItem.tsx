"use client";

import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
      <button
        className={`flex justify-between items-center w-full p-6 text-left ${isOpen ? 'bg-[#F0F4FF]' : 'bg-white'} hover:bg-[#F0F4FF] transition-all duration-300`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 flex items-center group-hover:text-[#0066FF] transition-colors duration-300">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isOpen ? 'bg-[#0066FF]' : 'bg-gray-100 group-hover:bg-[#0066FF]/10'} mr-4 transition-all duration-300`}>
            {isOpen ? (
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="w-3 h-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#0066FF]/10 transition-all duration-300`}>
          <svg
            className={`w-4 h-4 text-gray-500 group-hover:text-[#0066FF] transition-all duration-300 ${isOpen ? 'transform rotate-180 text-[#0066FF]' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
        aria-hidden={!isOpen}
      >
        <div className={`p-6 bg-white border-t border-gray-100 transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <p className="text-base leading-relaxed text-gray-600">{answer}</p>

  
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
