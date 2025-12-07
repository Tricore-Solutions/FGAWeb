/**
 * OutlinedHeading Component
 * 
 * A dynamic heading component with an outlined shadow effect and optional scroll-linked animation.
 * The heading can slide in from the left or right as the user scrolls, creating an engaging visual effect.
 * 
 * @param {string} text - The heading text content
 * @param {string} offset - Tailwind margin classes for horizontal positioning (e.g., "-ml-48 md:-ml-56")
 * @param {string} shadowDirection - Direction of the shadow offset ('left' or 'right')
 * @param {number} scrollProgress - Scroll progress value (0-1) for animation. 0 = initial position, 1 = final position
 * @param {string} animateFrom - Direction to animate from ('left' or 'right')
 * @param {string} textColor - Tailwind text color class (default: 'text-river-bed')
 * @param {string} strokeColor - Hex color for the outline stroke (default: '#454f59')
 */

const OutlinedHeading = ({ 
  text, 
  offset, 
  shadowDirection = 'left', 
  scrollProgress = 1, 
  animateFrom = 'left', 
  textColor = 'text-river-bed', 
  strokeColor = '#454f59' 
}) => {
  const shadowTransform = shadowDirection === 'left' ? 'translate(-4px, 4px)' : 'translate(4px, 4px)';
  
  // Calculate position based on scroll progress
  // Start very far off-screen (e.g., -500px for left, +500px for right)
  const initialOffset = animateFrom === 'left' ? -500 : 500;
  const currentTranslate = initialOffset * (1 - scrollProgress);
  
  return (
    <div className="relative" style={{ transform: `translateX(${currentTranslate}px)` }}>
      <h2 className={`text-5xl md:text-8xl font-heading font-bold ${textColor} uppercase tracking-sm leading-tight ${offset} relative z-10`}>
        {text}
      </h2>
      <h2 
        className={`text-5xl md:text-8xl font-heading font-bold uppercase tracking-sm leading-tight ${offset} absolute top-0 left-0 z-0`}
        style={{
          color: 'transparent',
          WebkitTextStroke: `2px ${strokeColor}`,
          textStroke: `2px ${strokeColor}`,
          transform: shadowTransform,
        }}
      >
        {text}
      </h2>
    </div>
  );
};

export default OutlinedHeading;

