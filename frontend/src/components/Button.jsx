import React from 'react';

const Button = ({ text, onClick, variant = 'primary' }) => {
  // Base styles common to all variants
  // Using Tailwind arbitrary value: px-[0.75rem] = md token (12px) from design system
  const baseStyles = 'px-[0.75rem] py-[0.75rem] rounded-full font-medium transition-all duration-fast cursor-pointer';
  
  // Text color and shadow - different for outline variant
  const textStyles = variant === 'outline' 
    ? 'text-gulf-stream font-bold' // Outline uses gulf-stream text color with bold text (defined in tailwind.config.js)
    : 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]';
  
  // Variant-specific styles using Tailwind classes
  const variantStyles = {
    primary: 'bg-gulf-stream hover:opacity-90 hover:-translate-y-1 hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.2)]',
    secondary: 'bg-gray-500 hover:bg-gray-600 hover:-translate-y-1 hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.2)]',
    danger: 'bg-red-500 hover:bg-red-600 hover:-translate-y-1 hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.2)]',
    outline: 'bg-transparent border-3 border-gulf-stream hover:bg-gulf-stream hover:text-white',
  };

  // Combine base and variant styles
  const className = `${baseStyles} ${textStyles} ${variantStyles[variant] || variantStyles.primary}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {text}
    </button>
  );
};

export default Button;

