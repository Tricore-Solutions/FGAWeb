import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { spacing } from '../styles/design-tokens/spacing';
import colors from '../styles/design-tokens/colors';
import AuthContext from '../context/AuthContext';
import DarkVeil from '../component/DarkVeil';

const Navbar = ({ variant = 'white', onTransparencyChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize transparent state correctly for home page hero variant
  const isHomeHeroVariant = variant === 'hero' && location.pathname === '/';
  const [isTransparent, setIsTransparent] = useState(isHomeHeroVariant && window.scrollY < 200);
  const [showNavLinks, setShowNavLinks] = useState(!isHomeHeroVariant);
  const [hasAnimated, setHasAnimated] = useState(!isHomeHeroVariant);
  const [mouseY, setMouseY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Camps', path: '/branches-camps' },
    { label: 'Tournaments', path: '/tournaments' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  // Notify parent immediately on mount about initial transparency state
  useEffect(() => {
    if (onTransparencyChange && isHomeHeroVariant) {
      const initialTransparent = window.scrollY < 200;
      onTransparencyChange(initialTransparent);
    }
  }, []); // Run only once on mount

  // Handle transparent navbar over hero section on home page
  useEffect(() => {
    const isHomeHeroVariant = variant === 'hero' && location.pathname === '/';

    // If not on home hero, ensure navbar is solid and show nav links immediately
    if (!isHomeHeroVariant) {
      setIsTransparent(false);
      setShowNavLinks(true);
      setHasAnimated(true);
      // Notify parent that navbar is not transparent
      if (onTransparencyChange) {
        onTransparencyChange(false);
      }
      return;
    }

    const heroScrollThreshold = 200;

    const handleScroll = () => {
      const shouldBeTransparent = window.scrollY < heroScrollThreshold;
      setIsTransparent(shouldBeTransparent);
      
      // Notify parent component about transparency change
      if (onTransparencyChange) {
        onTransparencyChange(shouldBeTransparent);
      }
      
      // When transitioning from transparent to white, trigger nav links animation
      if (!shouldBeTransparent && !hasAnimated) {
        setHasAnimated(true);
        setShowNavLinks(true);
      }
      
      // Reset animation state when scrolling back to hero
      if (shouldBeTransparent) {
        setShowNavLinks(false);
        setHasAnimated(false);
      }
    };

    // Set initial state based on current scroll position immediately
    // This ensures the navbar is transparent from the start on home page
    const initialTransparent = window.scrollY < heroScrollThreshold;
    setIsTransparent(initialTransparent);
    if (onTransparencyChange) {
      onTransparencyChange(initialTransparent);
    }

    // Also call handleScroll to ensure everything is in sync
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, variant, hasAnimated, onTransparencyChange]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Determine navbar classes based on variant (desktop only)
  const getNavbarClasses = () => {
    const isHeroOnHome = variant === 'hero' && location.pathname === '/';

    // On the home hero, make the navbar fixed so it overlays the hero background
    if (isHeroOnHome) {
      // Use immediate background on initial render to prevent flash
      const baseClasses = isTransparent 
        ? 'fixed top-6 left-0 right-0 z-50'
        : 'fixed top-12 left-0 right-0 z-50 transition-colors duration-300';

      if (isTransparent) {
        // Start transparent immediately, no transition on initial render
        return `${baseClasses} bg-transparent`;
      }

      return `${baseClasses} bg-white`;
    }

    // For all other cases, use sticky behavior
    const baseClasses = 'sticky top-12 z-50 transition-colors duration-300';

    if (variant === 'menu') {
      return `${baseClasses} min-[900px]:bg-white bg-white`;
    }

    // Default: white background
    return `${baseClasses} bg-white`;
  };

  return (
    <nav className={getNavbarClasses()} style={{ zIndex: 50 }}>
      <div 
        className="w-full mx-auto flex items-center justify-between h-14 min-[900px]:h-18"
        style={{ padding: spacing.xl }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/FGA-Logo.png"
            alt="FGA Logo"
            className="h-[72px] min-[900px]:h-22"
            style={{ width: 'auto' }}
          />
        </Link>

        {/* Right side: Login Button (when transparent) + Menu/Nav Links */}
        <div className="flex items-center gap-3">
          {/* Login Button - Show when navbar is transparent (hamburger mode) */}
          {variant === 'hero' && location.pathname === '/' && isTransparent && !isAuthenticated && (
            <Link
              to="/login"
              className="flex items-center gap-1.5 min-[900px]:gap-2 px-2 min-[900px]:px-3 py-1 min-[900px]:py-1.5 hover:opacity-80 transition-opacity duration-fast"
              style={{ color: 'white' }}
            >
              <div 
                className="w-[18px] h-[18px] md:w-7 md:h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'white' }}
              >
                <User size={12} className="md:hidden" style={{ color: '#0d1117' }} />
                <User size={16} className="hidden md:block" style={{ color: '#0d1117' }} />
              </div>
              <span className="font-heading font-bold text-sm min-[900px]:text-base uppercase text-white">Login</span>
            </Link>
          )}

          {/* Navigation Links or Menu - Responsive */}
        {variant === 'menu' ? (
          <button 
            onClick={toggleMenu}
            className="flex items-center gap-1.5 min-[900px]:gap-2 font-heading font-bold text-sm min-[900px]:text-base uppercase text-river-bed hover:text-gulf-stream transition-colors duration-fast"
          >
            <Menu size={20} className="min-[900px]:hidden" />
            <Menu size={24} className="hidden min-[900px]:block" />
            <span>MENU</span>
          </button>
        ) : (
          <>
            {/* Mobile: Menu button (always visible on mobile) */}
            <button 
              onClick={toggleMenu}
              className={`min-[900px]:hidden flex items-center gap-1.5 font-heading font-bold text-sm uppercase transition-colors duration-fast ${
                variant === 'hero' && location.pathname === '/' && isTransparent
                  ? 'text-white hover:text-gulf-stream'
                  : 'text-river-bed hover:text-gulf-stream'
              }`}
            >
              <Menu size={20} />
              <span>MENU</span>
            </button>
            
            {/* Desktop: Hamburger menu when transparent (hero section) */}
            {variant === 'hero' && location.pathname === '/' && isTransparent && (
              <button 
                onClick={toggleMenu}
                className="hidden min-[900px]:flex items-center gap-2 font-heading font-bold text-base uppercase text-white hover:text-gulf-stream transition-colors duration-fast"
              >
                <Menu size={24} />
                <span>MENU</span>
              </button>
            )}
            
            {/* Desktop: Navigation links (visible when NOT transparent or not hero variant) */}
            <div className={`hidden min-[900px]:flex items-center gap-3 ${
              variant === 'hero' && location.pathname === '/' && isTransparent ? '!hidden' : ''
            }`}>
              {navLinks.map((link, index) => {
                const active = isActive(link.path);
                const totalLinks = navLinks.length + (isAuthenticated ? 2 : 2); // +2 for auth links
                const reverseIndex = totalLinks - 1 - index; // Reverse for right-to-left animation
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      font-heading font-bold text-sm uppercase transition-colors duration-fast px-3 py-1.5 rounded-lg
                      ${active
                        ? 'text-gulf-stream'
                        : 'text-river-bed hover:text-gulf-stream'
                      }
                    `}
                    style={{
                      opacity: showNavLinks ? 1 : 0,
                      transform: showNavLinks ? 'translateX(0)' : 'translateX(20px)',
                      transition: `opacity 0.15s ease-out ${reverseIndex * 0.04}s, transform 0.15s ease-out ${reverseIndex * 0.04}s`
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* Dashboard and Logout links when logged in */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`
                      font-heading font-bold text-sm uppercase transition-colors duration-fast px-3 py-1.5 rounded-lg
                      ${isActive('/dashboard')
                        ? 'bg-gulf-stream text-white'
                        : 'text-river-bed hover:text-gulf-stream'
                      }
                    `}
                    style={{
                      opacity: showNavLinks ? 1 : 0,
                      transform: showNavLinks ? 'translateX(0)' : 'translateX(20px)',
                      transition: `opacity 0.15s ease-out 0.04s, transform 0.15s ease-out 0.04s`
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-heading font-bold text-sm uppercase transition-colors duration-fast px-3 py-1.5 rounded-lg text-river-bed hover:text-gulf-stream"
                    style={{
                      opacity: showNavLinks ? 1 : 0,
                      transform: showNavLinks ? 'translateX(0)' : 'translateX(20px)',
                      transition: `opacity 0.15s ease-out 0s, transform 0.15s ease-out 0s`
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
              {/* Login and Signup links when logged out - Only show when TopBar is not visible (navbar is transparent) */}
              {!isAuthenticated && (variant === 'hero' && location.pathname === '/' && isTransparent) && (
                <>
                  <Link
                    to="/login"
                    className={`
                      font-heading font-bold text-sm uppercase transition-colors duration-fast px-4 py-2 rounded-lg
                      ${isActive('/login')
                        ? 'bg-gulf-stream text-white'
                        : 'text-river-bed hover:text-gulf-stream'
                      }
                    `}
                    style={{
                      opacity: showNavLinks ? 1 : 0,
                      transform: showNavLinks ? 'translateX(0)' : 'translateX(20px)',
                      transition: `opacity 0.15s ease-out 0.04s, transform 0.15s ease-out 0.04s`
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`
                      font-heading font-bold text-sm uppercase transition-colors duration-fast px-4 py-2 rounded-lg
                      ${isActive('/signup')
                        ? 'bg-gulf-stream text-white'
                        : 'text-river-bed hover:text-gulf-stream'
                      }
                    `}
                    style={{
                      opacity: showNavLinks ? 1 : 0,
                      transform: showNavLinks ? 'translateX(0)' : 'translateX(20px)',
                      transition: `opacity 0.15s ease-out 0s, transform 0.15s ease-out 0s`
                    }}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </>
        )}
        </div>
      </div>

      {/* Thin Gulf Stream Bar - Only show when navbar has white background */}
      {((variant === 'hero' && location.pathname === '/' && !isTransparent) || (variant !== 'hero' || location.pathname !== '/')) && (
        <div 
          className="w-full h-1"
          style={{ backgroundColor: colors['gulf-stream'] }}
        />
      )}

      {/* Slide-in Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#0a0e14' }}
        onClick={closeMenu}
      />
      
      {/* Slide-in Menu */}
      <div 
        className={`fixed top-0 left-0 z-50 transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          backgroundColor: '#0a0e14',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          margin: 0,
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1 range
          setMouseY(normalizedY * 50); // Scale to -50px to 50px
        }}
        onMouseLeave={() => setMouseY(0)}
      >
        {/* DarkVeil Background */}
        <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
          <DarkVeil />
        </div>
        
        {/* Content */}
        <div className="flex h-full gap-20 relative z-10">
          {/* Left Section - Images Grid (wider) - Hidden on mobile */}
          <div className="hidden md:flex w-3/5 flex-col p-8 md:p-12">
            {/* Image Containers - Separate containers for independent positioning */}
            <div className="relative flex-1">
              {/* Image Container 1 - Top Left (Home) */}
              <div 
                className="absolute left-0 w-[calc(48%-1rem)] h-[calc(50%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (hoveredLink === '/' || (!hoveredLink && location.pathname === '/')) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: '2rem',
                  transform: `translateY(${-mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-3.jpg" 
                  alt="FGA Image 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Container 2 - Top Right (About) */}
              <div 
                className="absolute right-0 w-[calc(48%-1rem)] h-[calc(55%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (hoveredLink === '/about' || (!hoveredLink && location.pathname === '/about')) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: '-5rem',
                  transform: `translateY(${mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-4.jpg" 
                  alt="FGA Image 4" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Container 3 - Bottom Left (Camps) */}
              <div 
                className="absolute left-0 w-[calc(48%-1rem)] h-[calc(55%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (hoveredLink === '/branches-camps' || (!hoveredLink && location.pathname === '/branches-camps')) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: 'calc(2rem + 50% - 0.5rem + 3rem)',
                  transform: `translateY(${-mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-1.jpg" 
                  alt="FGA Image 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Container 4 - Bottom Right (Tournaments) */}
              <div 
                className="absolute right-0 w-[calc(48%-1rem)] h-[calc(50%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (hoveredLink === '/tournaments' || (!hoveredLink && location.pathname === '/tournaments')) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: 'calc(-5rem + 55% + 2.5rem)',
                  transform: `translateY(${mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-2.jpeg" 
                  alt="FGA Image 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Navigation (narrower on desktop, full width on mobile) */}
          <div className="w-full md:w-2/5 flex flex-col p-8 md:p-12 relative">
            {/* Top Right - Close Button */}
            <div className="flex justify-end items-start mb-8">
              <button
                onClick={closeMenu}
                className="relative w-10 h-10 flex items-center justify-center bg-white rounded overflow-hidden group"
                aria-label="Close menu"
              >
                <span 
                  className="absolute top-0 left-0 w-full h-0 transition-all duration-300 ease-out group-hover:h-full"
                  style={{ backgroundColor: colors['gulf-stream'] }}
                />
                <X size={24} className="text-black group-hover:text-white relative z-10 transition-colors duration-300" />
              </button>
            </div>

            {/* Navigation Links - Vertically Centered */}
            <div className="flex-1 flex flex-col justify-center">
              <nav className="flex flex-col gap-2 items-center">
                {navLinks.map((link, index) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMenu}
                      className="relative font-heading font-bold text-3xl md:text-5xl uppercase text-center leading-tight inline-block"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isMenuOpen ? 'fadeInUp 0.5s ease-out forwards' : 'none',
                        opacity: 0,
                        color: active ? colors['gulf-stream'] : 'white',
                        background: active 
                          ? 'none'
                          : `linear-gradient(to right, ${colors['gulf-stream']} 0%, ${colors['gulf-stream']} var(--fill-progress, 0%), white var(--fill-progress, 0%), white 100%)`,
                        WebkitBackgroundClip: active ? 'unset' : 'text',
                        WebkitTextFillColor: active ? 'unset' : 'transparent',
                        backgroundClip: active ? 'unset' : 'text',
                        transition: '--fill-progress 0.4s ease-out, color 0.3s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.setProperty('--fill-progress', '100%');
                        }
                        setHoveredLink(link.path);
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.setProperty('--fill-progress', '0%');
                        }
                        setHoveredLink(null);
                      }}
                    >
                      {link.label}
                      {active && (
                        <span 
                          className="absolute bottom-0 left-0 w-full h-0.5"
                          style={{ 
                            backgroundColor: colors['gulf-stream'],
                            transform: 'skewY(-2deg)'
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
                {/* Dashboard and Logout links when logged in */}
                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="font-heading font-bold text-4xl md:text-5xl uppercase text-center leading-tight inline-block"
                      style={{
                        animationDelay: `${navLinks.length * 100}ms`,
                        animation: isMenuOpen ? 'fadeInUp 0.5s ease-out forwards' : 'none',
                        opacity: 0,
                        color: 'white',
                        background: `linear-gradient(to right, ${colors['gulf-stream']} 0%, ${colors['gulf-stream']} var(--fill-progress, 0%), white var(--fill-progress, 0%), white 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        transition: '--fill-progress 0.4s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.setProperty('--fill-progress', '100%');
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.setProperty('--fill-progress', '0%');
                      }}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="font-heading font-bold text-4xl md:text-5xl uppercase text-center leading-tight inline-block"
                      style={{
                        animationDelay: `${(navLinks.length + 1) * 100}ms`,
                        animation: isMenuOpen ? 'fadeInUp 0.5s ease-out forwards' : 'none',
                        opacity: 0,
                        color: 'white',
                        background: `linear-gradient(to right, ${colors['gulf-stream']} 0%, ${colors['gulf-stream']} var(--fill-progress, 0%), white var(--fill-progress, 0%), white 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        transition: '--fill-progress 0.4s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.setProperty('--fill-progress', '100%');
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.setProperty('--fill-progress', '0%');
                      }}
                    >
                      Logout
                    </button>
                  </>
              )}
              </nav>
            </div>

            {/* Bottom Right - Brand Info and Social Links */}
            <div className="mt-auto flex flex-col items-center">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/FGA-Logo.png" 
                  alt="FGA Logo" 
                  className="h-12 w-auto object-contain"
                />
                <span className="text-white font-heading text-sm uppercase">SINCE 2024</span>
              </div>
              <div className="text-white text-center">
                <p className="font-heading font-bold text-xs uppercase mb-2">BUSINESS ENQUIRIES</p>
                <div className="flex gap-4 text-sm uppercase justify-center">
                  <a href="#" className="hover:opacity-80">TIKTOK</a>
                  <a href="#" className="hover:opacity-80">INSTAGRAM</a>
                  <a href="#" className="hover:opacity-80">YOUTUBE</a>
                  <a href="#" className="hover:opacity-80">TWITTER</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for fade-in animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

