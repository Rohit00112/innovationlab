import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  borderColor,
}) => {
  const borderStyles = borderColor 
    ? `border-l-[10px] border-l-[${borderColor}]` 
    : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${borderStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
