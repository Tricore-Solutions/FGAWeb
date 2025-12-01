import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  message,
  fullPage = false,
  inline = false,
  className = '',
  containerClassName = ''
}) => {
  // Size mapping based on design system
  // Default: w-8 h-8 (32px × 32px)
  const sizeClasses = {
    sm: 'w-4 h-4',      // 16px × 16px
    md: 'w-8 h-8',      // 32px × 32px (default)
    lg: 'w-12 h-12'     // 48px × 48px
  };

  // Border width based on size
  const borderWidthClasses = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4'
  };

  // Spinner styles
  // Border: 4px solid with Geyser color (#d5e0e1) and Gulf Stream (#80b3b4) for top border
  // Animation: Using Tailwind's built-in animate-spin class (uses CSS keyframes under the hood)
  // animate-spin applies: animation: spin 1s linear infinite with @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  const spinnerClasses = `
    ${sizeClasses[size]}
    ${borderWidthClasses[size]}
    border-geyser
    border-t-gulf-stream
    rounded-full
    animate-spin
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Spinner element - reusable core component
  const spinnerElement = (
    <div className={spinnerClasses} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Container for spinner with optional message
  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${containerClassName}`.trim()}>
      {spinnerElement}
      {message && (
        <p className="mt-4 text-oslo-gray text-sm text-center">
          {message}
        </p>
      )}
    </div>
  );

  // Inline mode - just the spinner, no wrapper
  if (inline) {
    return spinnerElement;
  }

  // Full page overlay - centered on screen
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        {spinnerContent}
      </div>
    );
  }

  // Default centered spinner - takes available space and centers content
  return (
    <div className={`w-full flex items-center justify-center min-h-[200px] ${containerClassName}`.trim()}>
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;

