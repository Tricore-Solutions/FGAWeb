import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  id,
  name
}) => {
  // Base styles common to all input states
  // Using px-4 py-2 (16px horizontal, 8px vertical) from design system
  const baseStyles = 'w-full px-4 py-2 rounded-lg transition-all duration-fast';
  
  // Text and background colors
  const textStyles = 'text-river-bed bg-white';
  
  // Border styles - show red border if error exists
  // Error state: 2px solid red border (from design system)
  // Default state: 1px solid Geyser color (#d5e0e1)
  const borderStyles = error 
    ? 'border-2 border-red-500' 
    : 'border border-geyser';
  
  // Focus state: 2px box shadow using Gulf Stream color (#80b3b4)
  // Only apply focus shadow if no error (error border takes priority)
  const focusStyles = error
    ? 'focus:outline-none'
    : 'focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]';
  
  // Combine all styles
  const inputClasses = `${baseStyles} ${textStyles} ${borderStyles} ${focusStyles} ${className}`.trim();
  
  return (
    <div className="w-full">
      {/* Input field */}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
      />
      
      {/* Error message - displayed below input when error exists */}
      {/* Acceptance Criteria: Input shows validation errors correctly */}
      {error && (
        <p 
          className="mt-1 text-sm text-red-500"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

