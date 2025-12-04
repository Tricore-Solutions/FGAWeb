import React from 'react';

const Button = ({ text, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }) => {
  // Base styles common to all variants
  // Using lg spacing token (1.5rem / 24px) for padding
  const baseStyles = 'px-6 py-6 rounded-full font-medium transition-all duration-fast';
  
  // Cursor and disabled styles
  const cursorStyles = disabled 
    ? 'cursor-not-allowed opacity-50' 
    : 'cursor-pointer';
  
  // Text color and shadow - different for outline variant
  const textStyles = variant === 'outline' 
    ? 'text-gulf-stream font-bold' // Outline uses gulf-stream text color with bold text (defined in tailwind.config.js)
    : 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]';
  
  // Variant-specific styles using Tailwind classes
  const variantStyles = {
    primary: disabled 
      ? 'bg-gulf-stream' 
      : 'bg-gulf-stream hover:opacity-90 hover:-translate-y-1 hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.2)]',
    secondary: disabled
      ? 'bg-gray-500'
      : 'bg-gray-500 hover:bg-gray-600 hover:-translate-y-1 hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.2)]',
    danger: disabled
      ? 'bg-red-500'
      : 'bg-red-500 hover:bg-red-600 hover:-translate-y-1 hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.2)]',
    outline: disabled
      ? 'bg-transparent border-3 border-gulf-stream'
      : 'bg-transparent border-3 border-gulf-stream hover:bg-gulf-stream hover:text-white',
  };

  // Combine base and variant styles
  const combinedClassName = `${baseStyles} ${cursorStyles} ${textStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {text}
    </button>
  );
};

export default Button;

