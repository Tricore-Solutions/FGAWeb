import React, { memo } from 'react';

const Preloader = memo(({
  fullPage = true,
  className = '',
  containerClassName = '',
  size = 'md',
  isFadingOut = false
}) => {
  // Size mapping for the preloader image
  const sizeClasses = {
    sm: 'w-48 h-48',      // 192px × 192px
    md: 'w-72 h-72',      // 288px × 288px (default)
    lg: 'w-96 h-96'       // 384px × 384px
  };

  // Preloader content with loader.gif - optimized for performance
  const preloaderContent = (
    <div className={`flex flex-col items-center justify-center ${containerClassName}`.trim()}>
      <img
        src="/videos/loader.gif"
        alt="Loading..."
        className={`${sizeClasses[size]} ${className}`.trim()}
        role="status"
        aria-label="Loading"
        loading="eager"
        decoding="async"
      />
    </div>
  );

  // Full page overlay - centered on screen (default behavior for preloaders)
  // The entire preloader (white background + gif) fades out together
  if (fullPage) {
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
          isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ willChange: 'opacity' }}
      >
        {preloaderContent}
      </div>
    );
  }

  // Inline mode - just the preloader, no overlay
  return preloaderContent;
});

Preloader.displayName = 'Preloader';

export default Preloader;

