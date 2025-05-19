"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProgramCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  imageUrl,
  link,
}) => {
  return (
    <div className="flex flex-col w-full bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group gsap-hover-card h-full border border-gray-100 relative">
      <div className="w-full h-[180px] md:h-[220px] lg:h-[240px] relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col gap-4 p-5 md:p-7 flex-grow">
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-300">{title}</h3>
          <p className="text-sm md:text-base leading-relaxed text-gray-700">{description}</p>
        </div>
        <div className="mt-auto pt-5">
          <span className="text-[#0066FF] font-medium text-sm md:text-base inline-flex items-center gap-2 program-card-button">
            <span>Learn More</span>
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <Link href={link} className="absolute inset-0 z-10" aria-label={`Learn more about ${title}`}></Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
