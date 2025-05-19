import React from 'react';
import FAQItem from '../ui/FAQItem';

// Import JSON data
import faqData from '@/data/sections/about/faq.json';

const FAQSection: React.FC = () => {
  // Use FAQs data from JSON
  const faqs = faqData.faqs;

  return (
    <section className={faqData.sectionClasses}>
      {/* V-shaped top */}
      <div className={faqData.background.vShapedTop.containerClasses}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={faqData.background.vShapedTop.viewBox}
          className={faqData.background.vShapedTop.svgClasses}
          style={faqData.background.vShapedTop.svgStyle}
        >
          <path
            d={faqData.background.vShapedTop.path.d}
            fill={faqData.background.vShapedTop.path.fill}
            fillOpacity={faqData.background.vShapedTop.path.fillOpacity}
          ></path>
        </svg>
      </div>

      {/* Background pattern */}
      <div className={faqData.background.pattern.containerClasses}>
        <div className="absolute inset-0" style={faqData.background.pattern.style}></div>
      </div>

      {/* Floating decorative elements */}
      {faqData.background.decorativeElements.map((element, index) => (
        <div
          key={index}
          className={element.classes}
          style={element.style}
        ></div>
      ))}

      <div className={faqData.content.containerClasses}>
        <div className={faqData.content.header.containerClasses}>
          <span className={faqData.content.header.badge.classes}>
            {faqData.content.header.badge.text}
          </span>
          <h2 className={faqData.content.header.title.classes}>
            {faqData.content.header.title.text}
          </h2>
          <p className={faqData.content.header.description.classes}>
            {faqData.content.header.description.text}
          </p>

          {/* Decorative line */}
          <div className={faqData.content.header.decorativeLine.classes}></div>
        </div>

        {/* FAQ content with decorative elements */}
        <div className={faqData.content.faqContent.containerClasses}>
          {/* Decorative side elements */}
          {faqData.content.faqContent.decorativeElements.sideElements.map((element, index) => (
            <div
              key={index}
              className={element.classes}
              style={element.style}
            ></div>
          ))}

          {/* Vertical line */}
          <div className={faqData.content.faqContent.decorativeElements.verticalLine.classes}></div>

          <div className={faqData.content.faqContent.faqListClasses}>
            {faqs.map((faq, index) => (
              <div key={index} className="animate-fadeInUp" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                />
              </div>
            ))}
          </div>

          {/* Additional help section */}
          <div className={faqData.content.faqContent.additionalHelp.containerClasses}>
            <div className={faqData.content.faqContent.additionalHelp.wrapperClasses}>
              <div className={faqData.content.faqContent.additionalHelp.icon.containerClasses}>
                <svg
                  width="28"
                  height="28"
                  viewBox={faqData.content.faqContent.additionalHelp.icon.viewBox}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {faqData.content.faqContent.additionalHelp.icon.paths.map((path, pathIndex) => (
                    <path
                      key={pathIndex}
                      d={path.d}
                      stroke={path.stroke}
                      strokeWidth={path.strokeWidth}
                      strokeLinecap={path.strokeLinecap as "round" | "inherit" | "butt" | "square" | undefined}
                      strokeLinejoin={path.strokeLinejoin as "round" | "inherit" | "miter" | "bevel" | undefined}
                    />
                  ))}
                </svg>
              </div>
              <div>
                <h3 className={faqData.content.faqContent.additionalHelp.content.title.classes}>
                  {faqData.content.faqContent.additionalHelp.content.title.text}
                </h3>
                <p className={faqData.content.faqContent.additionalHelp.content.description.classes}>
                  {faqData.content.faqContent.additionalHelp.content.description.text}
                </p>
                <button className={faqData.content.faqContent.additionalHelp.content.button.classes} onClick={() => {
                  window.location.href = '/contact';
                }}>
                  {faqData.content.faqContent.additionalHelp.content.button.text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* V-shaped bottom */}
      <div className={faqData.background.vShapedBottom.containerClasses}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={faqData.background.vShapedBottom.viewBox}
          className={faqData.background.vShapedBottom.svgClasses}
          style={faqData.background.vShapedBottom.svgStyle}
        >
          <path
            d={faqData.background.vShapedBottom.path.d}
            fill={faqData.background.vShapedBottom.path.fill}
            fillOpacity={faqData.background.vShapedBottom.path.fillOpacity}
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default FAQSection;
