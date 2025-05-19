import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-busy'?: boolean;
  target?: string;
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  'aria-busy': ariaBusy = false,
  target,
  rel,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#0066FF] text-white hover:bg-blue-600',
    secondary: 'bg-[#EEAE22] text-white hover:bg-yellow-500',
    outline: 'bg-transparent border border-[#0066FF] text-[#0066FF] hover:bg-blue-50',
  };

  const sizeStyles = {
    sm: 'text-sm py-2 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={buttonStyles}
        aria-busy={ariaBusy}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-busy={ariaBusy}
    >
      {children}
    </button>
  );
};

export default Button;
