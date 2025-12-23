import { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { spacing } from '../styles/design-tokens/spacing';
import colors from '../styles/design-tokens/colors';
import AuthContext from '../context/AuthContext';
import DarkVeil from '../component/DarkVeil';

const Navbar = ({ variant = 'white', onTransparencyChange, isHidden = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize transparent state correctly for home page hero variant
  const isHomeHeroVariant = variant === 'hero' && location.pathname === '/';
  const [isTransparent, setIsTransparent] = useState(isHomeHeroVariant && window.scrollY < 200);
  const [showNavLinks, setShowNavLinks] = useState(!isHomeHeroVariant);
  const [hasAnimated, setHasAnimated] = useState(!isHomeHeroVariant);
  const [mouseY, setMouseY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const prevIsHiddenRef = useRef(isHidden);

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

  // Get the image index for a hovered link (loops through 4 images)
  const getImageIndexForLink = (linkPath) => {
    if (!linkPath) return null;
    // Check if it's a nav link
    const linkIndex = navLinks.findIndex(link => link.path === linkPath);
    if (linkIndex !== -1) {
      return linkIndex % 4; // Loop through 4 images (0-3)
    }
    // Handle Dashboard, Admin Dashboard, and Logout links - continue the loop after navLinks
    if (linkPath === '/dashboard') {
      return navLinks.length % 4; // 5th link (index 5) -> Image 1 (5 % 4 = 1)
    }
    if (linkPath === '/admin/dashboard') {
      return (navLinks.length + 1) % 4; // 6th link (index 6) -> Image 2 (6 % 4 = 2)
    }
    if (linkPath === '/logout') {
      return (navLinks.length + 2) % 4; // 7th link (index 7) -> Image 3 (7 % 4 = 3)
    }
    return null;
  };

  // Get the image index for the current page (for initial state)
  const getImageIndexForCurrentPage = () => {
    const linkIndex = navLinks.findIndex(link => link.path === location.pathname);
    if (linkIndex === -1) return null;
    return linkIndex % 4;
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
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const isAdminPage = location.pathname.startsWith('/admin');

    // TopBar is visible when not on auth, not admin, and navbar is NOT transparent
    const topBarVisible = !isAuthPage && !isAdminPage && !isTransparent;

    // Helper to choose top offset:
    // - If on home hero and navbar is transparent, move navbar lower so it sits further down the hero
    // - If navbar is transparent elsewhere, keep it near the top so it overlays hero
    // - If the TopBar is visible, push navbar down below TopBar (top-12)
    // - Otherwise keep a small offset (top-1)
    let topOffset;
    // Make transparent navbar higher (closer to top) across the site
    if (isTransparent) {
      topOffset = 'top-4'; // move further down when transparent
    } else {
      topOffset = topBarVisible ? 'top-10' : 'top-1';
    }

    // On the home hero, make the navbar fixed so it overlays the hero background
    if (isHeroOnHome) {
      const baseClasses = `fixed ${topOffset} left-0 right-0 z-50 ${isTransparent ? '' : 'transition-colors duration-300'}`;

      if (isTransparent) {
        return `${baseClasses} bg-transparent`;
      }

      return `${baseClasses} bg-white`;
    }

    // For all other cases, use sticky behavior with calculated top offset
    const baseClasses = `sticky ${topOffset} z-50 transition-colors duration-300`;

    if (variant === 'menu') {
      return `${baseClasses} min-[900px]:bg-white bg-white`;
    }

    // Default: white background
    return `${baseClasses} bg-white`;
  };

  // Check if navbar is becoming visible (was hidden, now visible) - synchronous check
  const wasHidden = prevIsHiddenRef.current;
  const isBecomingVisible = wasHidden && !isHidden;
  const isFadingOut = !wasHidden && isHidden;
  
  // Update ref immediately after checking (synchronous)
  if (prevIsHiddenRef.current !== isHidden) {
    prevIsHiddenRef.current = isHidden;
  }

  return (
    <>
      {/* Thin Gulf Stream Bar Above Navbar - Only show when navbar has white background */}
      {((variant === 'hero' && location.pathname === '/' && !isTransparent) || (variant !== 'hero' || location.pathname !== '/')) && (
        <div
          className="fixed top-0 left-0 right-0 h-1"
          style={{ backgroundColor: colors['gulf-stream'], zIndex: 49 }}
        />
      )}
    <nav 
      className={getNavbarClasses()} 
      style={{ 
        zIndex: 50,
        opacity: (isHidden || isMenuOpen) ? 0 : 1,
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
        // Instant appearance when becoming visible, smooth fade-out when hiding
        transition: isFadingOut ? 'opacity 0.3s ease-out, transform 0.3s ease-out' : 'none',
        pointerEvents: (isHidden || isMenuOpen) ? 'none' : 'auto',
        willChange: isFadingOut ? 'opacity, transform' : 'auto',
        visibility: isMenuOpen ? 'hidden' : 'visible'
      }}
    >
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
                const totalLinks = navLinks.length + (isAuthenticated ? (isAdmin() ? 3 : 2) : 2); // +2 or +3 for auth links (Dashboard, Admin Dashboard if admin, Logout)
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
                  {!isAdmin() && (
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
                  )}
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      className={`
                        font-heading font-bold text-sm uppercase transition-colors duration-fast px-3 py-1.5 rounded-lg
                        ${isActive('/admin/dashboard')
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
                      Admin Dashboard
                    </Link>
                  )}
                  {/* Logout is rendered to the right of the menu icon (see below) to avoid duplication */}
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

          {/* Logout button to the right of hamburger/menu icon (outside slide-in) */}
          {isAuthenticated && !location.pathname.startsWith('/admin') && (
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 font-heading font-bold text-sm uppercase transition-colors duration-fast ${
                variant === 'hero' && location.pathname === '/' && isTransparent
                  ? 'text-white hover:text-gulf-stream'
                  : 'text-river-bed hover:text-gulf-stream'
              }`}
              style={{ padding: '0.25rem 0.5rem' }}
            >
              <LogOut size={16} />
              <span className="hidden min-[480px]:inline">Logout</span>
            </button>
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

      {/* Slide-in Menu Overlay - Rendered via Portal to ensure it's on top */}
      {createPortal(
        <>
          <div
            className={`fixed transition-opacity duration-500 ease-in-out ${
              isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{ 
              backgroundColor: '#0a0e14',
              zIndex: 99998,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              margin: 0,
              padding: 0
            }}
            onClick={closeMenu}
          />
          
          {/* Slide-in Menu - Slides down from top */}
          <div 
            className={`fixed transition-all duration-500 ease-in-out ${
              isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
            style={{ 
              backgroundColor: '#0a0e14',
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              top: 0,
              left: 0,
              overflow: 'hidden',
              margin: 0,
              padding: 0,
              zIndex: 99999,
              pointerEvents: isMenuOpen ? 'auto' : 'none'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              if (!isMenuOpen) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1 range
              setMouseY(normalizedY * 50); // Scale to -50px to 50px
            }}
            onMouseLeave={() => setMouseY(0)}
          >
        {/* DarkVeil Background */}
        <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
          <DarkVeil hueShift={40} warpAmount={4} />
        </div>
        
        {/* Content */}
        <div className="flex h-full gap-20 relative z-10">
          {/* Left Section - Images Grid (wider) - Hidden on mobile */}
          <div className="hidden md:flex w-3/5 flex-col p-8 md:p-12">
            {/* Image Containers - Separate containers for independent positioning */}
            <div className="relative flex-1">
              {/* Image Container 1 - Top Left */}
              <div 
                className="absolute left-0 w-[calc(48%-1rem)] h-[calc(50%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (getImageIndexForLink(hoveredLink) === 0 || (!hoveredLink && getImageIndexForCurrentPage() === 0)) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: '2rem',
                  transform: `translateY(${-mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-menu-1.jpg" 
                  alt="FGA Menu 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Container 2 - Top Right */}
              <div 
                className="absolute right-0 w-[calc(48%-1rem)] h-[calc(55%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (getImageIndexForLink(hoveredLink) === 1 || (!hoveredLink && getImageIndexForCurrentPage() === 1)) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: '-5rem',
                  transform: `translateY(${mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-menu-2.jpg" 
                  alt="FGA Menu 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Container 3 - Bottom Left */}
              <div 
                className="absolute left-0 w-[calc(48%-1rem)] h-[calc(55%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (getImageIndexForLink(hoveredLink) === 2 || (!hoveredLink && getImageIndexForCurrentPage() === 2)) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: 'calc(2rem + 50% - 0.5rem + 3rem)',
                  transform: `translateY(${-mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-menu-3.jpg" 
                  alt="FGA Menu 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Container 4 - Bottom Right */}
              <div 
                className="absolute right-0 w-[calc(48%-1rem)] h-[calc(50%-0.5rem)] overflow-hidden transition-all duration-300 ease-out" 
                style={{ 
                  filter: (getImageIndexForLink(hoveredLink) === 3 || (!hoveredLink && getImageIndexForCurrentPage() === 3)) ? 'none' : 'grayscale(100%) brightness(0.9)', 
                  top: 'calc(-5rem + 55% + 2.5rem)',
                  transform: `translateY(${mouseY}px)`
                }}
              >
                <img 
                  src="/images/fga-menu-4.JPG" 
                  alt="FGA Menu 4" 
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
                    </Link>
                  );
                })}
                {/* Dashboard and Logout links when logged in */}
                {isAuthenticated && (
                  <>
                    {!isAdmin() && (() => {
                      const active = isActive('/dashboard');
                      return (
                        <Link
                          to="/dashboard"
                          onClick={closeMenu}
                          className="relative font-heading font-bold text-3xl md:text-5xl uppercase text-center leading-tight inline-block"
                          style={{
                            animationDelay: `${navLinks.length * 100}ms`,
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
                            if (!active) e.currentTarget.style.setProperty('--fill-progress', '100%');
                            setHoveredLink('/dashboard');
                          }}
                          onMouseLeave={(e) => {
                            if (!active) e.currentTarget.style.setProperty('--fill-progress', '0%');
                            setHoveredLink(null);
                          }}
                        >
                          Dashboard
                        </Link>
                      );
                    })()}
                    {isAdmin() && (() => {
                      const active = isActive('/admin/dashboard');
                      return (
                        <Link
                          to="/admin/dashboard"
                          onClick={closeMenu}
                          className="relative font-heading font-bold text-3xl md:text-5xl uppercase text-center leading-tight inline-block"
                          style={{
                            animationDelay: `${(navLinks.length + 1) * 100}ms`,
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
                            if (!active) e.currentTarget.style.setProperty('--fill-progress', '100%');
                            setHoveredLink('/admin/dashboard');
                          }}
                          onMouseLeave={(e) => {
                            if (!active) e.currentTarget.style.setProperty('--fill-progress', '0%');
                            setHoveredLink(null);
                          }}
                        >
                          Admin Dashboard
                        </Link>
                      );
                    })()}
                    {/* Logout moved out of slide-in menu into navbar right side */}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          </>,
          document.body
        )}
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
    </>
  );
};

export default Navbar;

