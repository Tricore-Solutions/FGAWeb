import React, { useCallback, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

// Ripple Button Component
const RippleButton = ({ text, onClick, disabled = false, className = '', type = 'button' }) => {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const createRipple = useCallback(
    (event) => {
      if (isHovered || !buttonRef.current || !rippleRef.current || disabled) return;
      setIsHovered(true);
      const button = buttonRef.current;
      const ripple = rippleRef.current;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.remove("ripple-leave");
      ripple.classList.add("ripple-enter");
    },
    [isHovered, disabled],
  );

  const removeRipple = useCallback((event) => {
    if (event.target !== event.currentTarget || !buttonRef.current || !rippleRef.current) return;
    setIsHovered(false);
    const ripple = rippleRef.current;
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.remove("ripple-enter");
    ripple.classList.add("ripple-leave");
    const handleAnimationEnd = () => {
      if (ripple) {
        ripple.classList.remove("ripple-leave");
        ripple.removeEventListener("animationend", handleAnimationEnd);
      }
    };
    ripple.addEventListener("animationend", handleAnimationEnd);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!buttonRef.current || !rippleRef.current || !isHovered || disabled) return;
      const ripple = rippleRef.current;
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
    },
    [isHovered, disabled],
  );

  return (
    <>
      <button
        ref={buttonRef}
        type={type}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`relative flex items-center justify-center overflow-hidden rounded-full bg-gulf-stream px-4 py-2 md:px-6 md:py-3 text-base font-medium uppercase text-white transition-colors duration-[600ms] ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-white'} ${className}`}
        onMouseEnter={(e) => {
          if (e.target === e.currentTarget && !disabled) {
            createRipple(e);
          }
        }}
        onMouseLeave={(e) => {
          if (e.target === e.currentTarget && !disabled) {
            removeRipple(e);
          }
        }}
        onMouseMove={handleMouseMove}
      >
        <span className="relative z-[2]">{text}</span>
        <span ref={rippleRef} className="ripple" />
      </button>
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          background-color: rgba(255, 255, 255, 0.3);
          z-index: 1;
          opacity: 0;
          transition: transform 50ms linear;
        }
        .ripple-enter {
          animation: ripple-enter 600ms ease-out forwards;
        }
        .ripple-leave {
          animation: ripple-leave 600ms ease-out forwards;
        }
        @keyframes ripple-enter {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes ripple-leave {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

const Button = ({ text, onClick, variant = 'primary', disabled = false, className = '', type = 'button', primaryColor = '#80b3b4' }) => {
  // Ripple variant uses separate component
  if (variant === 'ripple') {
    return (
      <RippleButton
        text={text}
        onClick={onClick}
        disabled={disabled}
        className={className}
        type={type}
      />
    );
  }

  // Slide arrow variant has a special structure
  if (variant === 'slide-arrow') {
    return (
      <button
        type={type}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`group relative rounded-full border border-white bg-white p-2 text-xl font-semibold ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      >
        <div
          className={`absolute left-0 top-0 flex h-full w-11 items-center justify-end rounded-full transition-all duration-200 ease-in-out ${disabled ? '' : 'group-hover:w-full'}`}
          style={{ backgroundColor: primaryColor }}
        >
          <span className="mr-3 text-white transition-all duration-200 ease-in-out">
            <ArrowRight size={20} />
          </span>
        </div>
        <span className={`relative left-4 z-10 whitespace-nowrap px-8 font-semibold text-black transition-all duration-200 ease-in-out ${disabled ? '' : 'group-hover:-left-3 group-hover:text-white'}`}>
          {text}
        </span>
      </button>
    );
  }

  // Base styles common to all other variants
  // Using lg spacing token (1.5rem / 24px) for padding on desktop, smaller on mobile
  const baseStyles = 'px-4 py-4 md:px-6 md:py-6 rounded-full text-sm md:text-base font-medium transition-all duration-fast';
  
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

