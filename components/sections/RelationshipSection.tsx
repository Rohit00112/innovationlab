import React from 'react';
import Image from 'next/image';

// Import JSON data
import relationshipData from '@/data/sections/about/relationship.json';

const RelationshipSection: React.FC = () => {
  return (
    <section className={relationshipData.sectionClasses}>
      {/* Background pattern */}
      <div className={relationshipData.background.pattern.containerClasses}>
        <div className="absolute inset-0" style={relationshipData.background.pattern.style}></div>
      </div>

      {/* Floating decorative elements */}
      {relationshipData.background.decorativeElements.map((element, index) => (
        <div key={index} className={element.classes}></div>
      ))}

      <div className={relationshipData.content.containerClasses}>
        <div className={relationshipData.content.wrapperClasses}>
          {/* Left image */}
          <div className={relationshipData.content.leftImage.containerClasses}>
            <div className={relationshipData.content.leftImage.overlay.classes}></div>
            <Image
              src={relationshipData.content.leftImage.image.src}
              alt={relationshipData.content.leftImage.image.alt}
              fill
              className={relationshipData.content.leftImage.image.classes}
              sizes={relationshipData.content.leftImage.image.sizes}
            />
            <div className={relationshipData.content.leftImage.caption.containerClasses}>
              <div className={relationshipData.content.leftImage.caption.line.classes}></div>
              <p className={relationshipData.content.leftImage.caption.title.classes}>
                {relationshipData.content.leftImage.caption.title.text}
              </p>
              <p className={relationshipData.content.leftImage.caption.subtitle.classes}>
                {relationshipData.content.leftImage.caption.subtitle.text}
              </p>
            </div>

            {/* Decorative elements on the image */}
            <div className={relationshipData.content.leftImage.decorativeElement.containerClasses}>
              <div className={relationshipData.content.leftImage.decorativeElement.innerCircle.classes}>
                <svg width="24" height="24" viewBox={relationshipData.content.leftImage.decorativeElement.icon.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d={relationshipData.content.leftImage.decorativeElement.icon.path} fill={relationshipData.content.leftImage.decorativeElement.icon.fill}/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className={relationshipData.content.rightContent.containerClasses}>
            <div className={relationshipData.content.rightContent.header.containerClasses}>
              <span className={relationshipData.content.rightContent.header.badge.classes}>
                {relationshipData.content.rightContent.header.badge.text}
              </span>
              <h3 className={relationshipData.content.rightContent.header.title.classes}>
                {relationshipData.content.rightContent.header.title.text}
              </h3>
              <p className={relationshipData.content.rightContent.header.subtitle.classes}>
                {relationshipData.content.rightContent.header.subtitle.text}
              </p>
            </div>

            <div className={relationshipData.content.rightContent.paragraphs.containerClasses}>
              {relationshipData.content.rightContent.paragraphs.items.map((paragraph, index) => (
                <p key={index} className={paragraph.classes}>
                  {paragraph.text}
                </p>
              ))}
            </div>

            {/* Key benefits */}
            <div className={relationshipData.content.rightContent.benefits.containerClasses}>
              {relationshipData.content.rightContent.benefits.items.map((benefit, index) => (
                <div key={index} className={benefit.containerClasses}>
                  <div className={benefit.icon.containerClasses}>
                    <svg width="16" height="16" viewBox={benefit.icon.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d={benefit.icon.path}
                        stroke={benefit.icon.stroke}
                        strokeWidth={benefit.icon.strokeWidth}
                        strokeLinecap={benefit.icon.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                        strokeLinejoin={benefit.icon.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className={benefit.content.title.classes}>{benefit.content.title.text}</h4>
                    <p className={benefit.content.description.classes}>{benefit.content.description.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelationshipSection;
