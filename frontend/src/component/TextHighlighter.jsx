import { useRef, useEffect, useState } from 'react';
import './TextHighlighter.css';

const TextHighlighter = ({
  children,
  trigger = 'inView',
  direction = 'left',
  color = '#80b3b4',
  className = '',
  as: Component = 'p',
  duration = 1000,
  easing = 'ease-out',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimate,
  highlighterRef
}) => {
  const containerRef = useRef(null);
  const highlightRef = useRef(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Handle different trigger types
  useEffect(() => {
    if (trigger === 'auto') {
      setIsHighlighted(true);
    } else if (trigger === 'hover') {
      // Hover is handled via CSS
      return;
    } else if (trigger === 'inView') {
      // Intersection Observer for in-view triggering
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              setIsHighlighted(true);
              if (onAnimate) onAnimate();
            }
          });
        },
        {
          threshold,
          rootMargin
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    } else if (trigger === 'ref' && highlighterRef) {
      // Expose animate method via ref
      if (highlighterRef.current) {
        highlighterRef.current.animate = () => {
          setIsHighlighted(true);
        };
      }
    }
  }, [trigger, threshold, rootMargin, onAnimate, highlighterRef]);

  // Handle ref control
  useEffect(() => {
    if (highlighterRef) {
      highlighterRef.current = {
        animate: () => setIsHighlighted(true),
        reset: () => setIsHighlighted(false)
      };
    }
  }, [highlighterRef]);

  const getDirectionClass = () => {
    switch (direction) {
      case 'right':
        return 'highlight-right';
      case 'top':
        return 'highlight-top';
      case 'bottom':
        return 'highlight-bottom';
      default:
        return 'highlight-left';
    }
  };

  const getColorStyle = () => {
    if (typeof color === 'string' && color.includes('gradient')) {
      return { background: color };
    }
    return { backgroundColor: color };
  };

  const containerClasses = `text-highlighter-container ${className} ${
    trigger === 'hover' ? 'text-highlighter-hover' : ''
  } ${isHighlighted ? 'text-highlighter-active' : ''} ${getDirectionClass()}`;

  return (
    <Component
      ref={containerRef}
      className={containerClasses}
      style={{
        '--highlight-color': typeof color === 'string' && !color.includes('gradient') ? color : undefined,
        '--highlight-duration': `${duration}ms`,
        '--highlight-easing': easing,
        ...(typeof color === 'string' && color.includes('gradient') ? getColorStyle() : {})
      }}
    >
      <span className="text-highlighter-text">{children}</span>
      <span
        ref={highlightRef}
        className="text-highlighter-highlight"
        style={getColorStyle()}
      />
    </Component>
  );
};

export default TextHighlighter;

