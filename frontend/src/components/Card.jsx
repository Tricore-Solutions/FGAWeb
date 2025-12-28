import React from 'react';

const Card = ({
  title,
  description,
  image,
  children,
  imageAlt = '',
  footer,
  onClick,
  className = '',
  variant = 'default'
}) => {
  // Base styles common to all variants
  // Using rounded-lg (0.5rem / 8px) from design system
  // Check if className contains a rounded class to avoid conflicts
  const hasCustomRounded = className && /rounded-/.test(className);
  const baseStyles = `bg-white ${hasCustomRounded ? '' : 'rounded-lg'} overflow-hidden`;
  
  // No base padding - padding is applied only to content area
  const paddingStyles = '';
  
  // Variant-specific styles based on components.md specifications
  const variantStyles = {
    default: 'border border-geyser shadow-md',
    elevated: 'border border-geyser shadow-xl',
    outlined: 'border-2 border-river-bed shadow-none'
  };
  
  // Hover effects - shadow increases on hover (from components.md)
  // Using duration-fast (150ms) from tailwind.config.js
  const hoverStyles = 'transition-shadow duration-fast hover:shadow-lg';
  
  // Interactive styles (when onClick is provided)
  const interactiveStyles = onClick ? 'cursor-pointer' : '';
  
  // Combine all styles
  const cardClasses = `${baseStyles} ${paddingStyles} ${variantStyles[variant]} ${hoverStyles} ${interactiveStyles} ${className}`.trim();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      {/* Image */}
      {image && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content - Flexible structure to wrap any content */}
      <div className="p-[2rem]">
        {/* Title */}
        {title && (
          <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
            {title}
          </h3>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-oslo-gray mb-4">
            {description}
          </p>
        )}
        
        {/* Children content - Can wrap any React content */}
        {children}
        
        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-geyser">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

