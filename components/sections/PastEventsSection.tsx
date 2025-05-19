'use client';

import React, { useState } from 'react';
import Image from 'next/image';
// Removed unused import
// import Link from 'next/link';

// Import JSON data
import pastEventsData from '@/data/sections/events/pastEvents.json';
import ImageModal from '@/components/ui/ImageModal';

interface PastEventCardProps {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  category: string;
  categoryColor: string;
  onImageClick: (imageUrl: string, title: string) => void;
}

const PastEventCard: React.FC<PastEventCardProps> = ({
  // Unused parameters commented out
  // id,
  title,
  // date,
  imageUrl,
  category,
  categoryColor,
  onImageClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onImageClick(imageUrl, title);
  };

  return (
    <div
      className={`${pastEventsData.card.linkClasses} cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} image`}
    >
      <div className={pastEventsData.card.imageContainer.classes}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={pastEventsData.card.image.classes}
          sizes={pastEventsData.card.image.sizes}
        />
        <div className={pastEventsData.card.overlay.classes}></div>
        <div className={`${pastEventsData.card.category.classes} ${categoryColor}`}>
          {category}
        </div>
        <div className={pastEventsData.card.content.containerClasses}>
          <h3 className={pastEventsData.card.content.title.classes}>
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

const PastEventsSection: React.FC = () => {
  // Use past events data from JSON
  const pastEvents = pastEventsData.events;

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  // Handler for image click
  const handleImageClick = (imageUrl: string, title: string) => {
    setSelectedImage(imageUrl);
    setSelectedTitle(title);
    setModalOpen(true);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <section className={pastEventsData.sectionClasses}>
      <div className={pastEventsData.container.classes}>
        <div className={pastEventsData.header.containerClasses}>
          <div className={pastEventsData.header.content.containerClasses}>
            <h2 className={pastEventsData.header.content.title.classes}>
              {pastEventsData.header.content.title.text}
            </h2>
            <p className={pastEventsData.header.content.description.classes}>
              {pastEventsData.header.content.description.text}
            </p>
          </div>
        </div>

        <div className={pastEventsData.grid.containerClasses}>
          {pastEvents.map((event, index) => (
            <div key={event.id} className={pastEventsData.card.containerClasses} style={{ animationDelay: `${index * 0.1}s` }}>
              <PastEventCard
                {...event}
                onImageClick={handleImageClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        imageUrl={selectedImage}
        title={selectedTitle}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default PastEventsSection;
