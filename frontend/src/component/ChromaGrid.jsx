import { useRef, useEffect, useState } from 'react';
import './ChromaGrid.css';

// Helper function to extract colors from gradient string
const extractGradientColors = (gradient) => {
  if (!gradient) return { color1: 'rgba(139, 92, 246, 0.5)', color2: 'rgba(59, 130, 246, 0.7)', color3: 'rgba(59, 130, 246, 0.9)' };
  
  // Extract hex colors from gradient string
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hexMatches && hexMatches.length >= 2) {
    const hex1 = hexMatches[0];
    const hex2 = hexMatches[1];
    
    // Convert hex to rgba
    const rgb1 = hexToRgba(hex1, 0.5);
    const rgb2 = hexToRgba(hex2, 0.7);
    const rgb3 = hexToRgba(hex2, 0.9);
    
    return { color1: rgb1, color2: rgb2, color3: rgb3 };
  }
  
  // Default purple-blue gradient
  return { color1: 'rgba(139, 92, 246, 0.5)', color2: 'rgba(59, 130, 246, 0.7)', color3: 'rgba(59, 130, 246, 0.9)' };
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ChromaGrid = ({
  items = [],
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const imageWrapperRefs = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemPositions, setItemPositions] = useState([]);
  const [imageMousePos, setImageMousePos] = useState({});

  // Calculate item positions
  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const updatePositions = () => {
      const positions = itemRefs.current.map((ref) => {
        if (!ref) return { x: 0, y: 0 };
        const rect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      });
      setItemPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      // Calculate mouse position relative to each image wrapper
      const newImageMousePos = {};
      imageWrapperRefs.current.forEach((ref, index) => {
        if (ref) {
          const wrapperRect = ref.getBoundingClientRect();
          const relativeX = e.clientX - wrapperRect.left;
          const relativeY = e.clientY - wrapperRect.top;
          newImageMousePos[index] = { x: relativeX, y: relativeY };
        }
      });
      setImageMousePos(newImageMousePos);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', () => {});
    container.addEventListener('mouseleave', () => {
      setHoveredIndex(null);
    });
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', () => {});
      container.removeEventListener('mouseleave', () => {});
    };
  }, []);

  return (
    <div ref={containerRef} className="chroma-grid-container">
      <div className="chroma-grid" style={{ '--radius': `${radius}px` }}>
        {items.map((item, index) => {
          const itemPos = itemPositions[index] || { x: 0, y: 0 };
          const imageWrapperRect = imageWrapperRefs.current[index]?.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          
          // Calculate distance from mouse to card center
          const distance = Math.sqrt(
            Math.pow(mousePos.x - itemPos.x, 2) +
            Math.pow(mousePos.y - itemPos.y, 2)
          );
          
          // Calculate if mouse is over this card
          const isMouseOverCard = imageWrapperRect && containerRect && 
            mousePos.x >= (imageWrapperRect.left - containerRect.left) &&
            mousePos.x <= (imageWrapperRect.right - containerRect.left) &&
            mousePos.y >= (imageWrapperRect.top - containerRect.top) &&
            mousePos.y <= (imageWrapperRect.bottom - containerRect.top);
          
          // Calculate color intensity based on proximity
          // Closer cards get more color, further cards get less
          // Smoother falloff for light-like effect
          const maxDistance = radius * 3; // Increased radius for smoother light spread
          const normalizedDistance = Math.min(distance / maxDistance, 1);
          // Smoother falloff curve for more natural light effect
          const colorIntensity = isMouseOverCard ? 1 : Math.max(0, Math.pow(1 - normalizedDistance, 1.5));
          
          const normalizedDistanceForOpacity = Math.min(distance / radius, 1);
          const opacity = hoveredIndex === index ? 1 : 
            Math.max(fadeOut, 1 - normalizedDistanceForOpacity * (1 - fadeOut));
          
          // Calculate mask position and radius for this card
          const mouseX = imageMousePos[index]?.x || 0;
          const mouseY = imageMousePos[index]?.y || 0;
          
          let maskX, maskY;
          if (isMouseOverCard) {
            maskX = mouseX;
            maskY = mouseY;
          } else if (imageWrapperRect && containerRect) {
            // Project mouse position onto this card's image
            const relativeX = mousePos.x - (imageWrapperRect.left - containerRect.left);
            const relativeY = mousePos.y - (imageWrapperRect.top - containerRect.top);
            maskX = Math.max(0, Math.min(imageWrapperRect.width, relativeX));
            maskY = Math.max(0, Math.min(imageWrapperRect.height, relativeY));
          } else {
            maskX = 0;
            maskY = 0;
          }
          
          // Larger base radius for smoother, more light-like effect
          const baseRadius = 1200;
          const maskRadius = baseRadius * colorIntensity;

          return (
            <a
              key={index}
              ref={(el) => itemRefs.current[index] = el}
              href={item.url || '#'}
              className="chroma-grid-item"
              style={{
                '--border-color': item.borderColor || '#80b3b4',
                '--gradient': item.gradient || 'linear-gradient(145deg, #80b3b4, #000)',
                '--opacity': opacity,
                opacity: 'var(--opacity)',
                transition: `opacity ${damping}s ${ease}`
              }}
            >
              <div 
                className="chroma-grid-item-card"
                style={{
                  '--gradient': item.gradient || 'linear-gradient(90deg, #8B5CF6, #3B82F6)'
                }}
              >
                <div 
                  ref={(el) => imageWrapperRefs.current[index] = el}
                  className="chroma-grid-item-image-wrapper"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img src={item.image} alt={item.title} className="chroma-grid-item-image chroma-grid-item-image-grayscale" />
                  <div 
                    className="chroma-grid-item-image-colored-wrapper"
                     style={{
                       maskImage: colorIntensity <= 0 
                         ? 'radial-gradient(circle 0px at center, transparent 0%, transparent 100%)'
                         : `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black 0%, black ${30 * colorIntensity}%, black ${60 * colorIntensity}%, transparent ${85 * colorIntensity}%, transparent 100%)`,
                       WebkitMaskImage: colorIntensity <= 0 
                         ? 'radial-gradient(circle 0px at center, transparent 0%, transparent 100%)'
                         : `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black 0%, black ${30 * colorIntensity}%, black ${60 * colorIntensity}%, transparent ${85 * colorIntensity}%, transparent 100%)`
                     }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="chroma-grid-item-image chroma-grid-item-image-colored"
                    />
                  </div>
                </div>
                <div className="chroma-grid-item-info-section">
                  <div className="chroma-grid-item-header">
                    <h3 className="chroma-grid-item-title">{item.title}</h3>
                    {item.handle && (
                      <span className="chroma-grid-item-handle">{item.handle}</span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="chroma-grid-item-subtitle">{item.subtitle}</p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ChromaGrid;

