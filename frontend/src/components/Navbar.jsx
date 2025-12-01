import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { spacing } from '../styles/design-tokens/spacing';
import colors from '../styles/design-tokens/colors';

const Navbar = ({ variant = 'white' }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Branches', path: '/branches' },
    { label: 'Camps', path: '/camps' },
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

  // Handle transparent navbar over hero section on home page
  useEffect(() => {
    const isHomeHeroVariant = variant === 'hero' && location.pathname === '/';

    // If not on home hero, ensure navbar is solid and remove any listeners
    if (!isHomeHeroVariant) {
      setIsTransparent(false);
      return;
    }

    const heroScrollThreshold = 200;

    const handleScroll = () => {
      const shouldBeTransparent = window.scrollY < heroScrollThreshold;
      setIsTransparent(shouldBeTransparent);
    };

    // Set initial state based on current scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, variant]);

  // Determine navbar classes based on variant (desktop only)
  const getNavbarClasses = () => {
    const isHeroOnHome = variant === 'hero' && location.pathname === '/';

    // On the home hero, make the navbar fixed so it overlays the hero background
    if (isHeroOnHome) {
      const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-colors duration-300';

      if (isTransparent) {
        return `${baseClasses} bg-transparent`;
      }

      return `${baseClasses} bg-white`;
    }

    // For all other cases, use sticky behavior
    const baseClasses = 'sticky top-0 z-50 transition-colors duration-300';

    if (variant === 'menu') {
      return `${baseClasses} min-[900px]:bg-white bg-white`;
    }

    // Default: white background
    return `${baseClasses} bg-white`;
  };

  return (
    <nav className={getNavbarClasses()}>
      <div 
        className="w-full mx-auto flex items-center justify-between h-24 min-[900px]:h-28"
        style={{ padding: spacing.xl }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/FGA-Logo.png"
            alt="FGA Logo"
            className="h-20 min-[900px]:h-20"
            style={{ height: '80px', width: 'auto' }}
          />
        </Link>

        {/* Navigation Links or Menu - Responsive */}
        {variant === 'menu' ? (
          <button 
            onClick={toggleMenu}
            className="flex items-center gap-2 font-heading font-bold text-base uppercase text-river-bed hover:text-gulf-stream transition-colors duration-fast"
          >
            <Menu size={24} />
            <span>MENU</span>
          </button>
        ) : (
          <>
            {/* Mobile: Menu button */}
            <button 
              onClick={toggleMenu}
              className={`min-[900px]:hidden flex items-center gap-2 font-heading font-bold text-base uppercase transition-colors duration-fast ${
                variant === 'hero' && location.pathname === '/' && isTransparent
                  ? 'text-white hover:text-gulf-stream'
                  : 'text-river-bed hover:text-gulf-stream'
              }`}
            >
              <Menu size={24} />
              <span>MENU</span>
            </button>
            {/* Desktop: Navigation links */}
            <div className="hidden min-[900px]:flex items-center gap-3">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const isTransparentNav = variant === 'hero' && location.pathname === '/' && isTransparent;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      font-heading font-bold text-sm uppercase transition-colors duration-fast px-4 py-2 rounded-lg
                      ${active
                        ? 'bg-gulf-stream text-white'
                        : isTransparentNav
                        ? 'text-white hover:text-gulf-stream hover:bg-white/20'
                        : 'text-river-bed hover:text-gulf-stream'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Slide-in Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: colors['gulf-stream'] }}
        onClick={closeMenu}
      />
      
      {/* Slide-in Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-full z-50 transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: colors['gulf-stream'] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full" style={{ padding: spacing.xl }}>
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={closeMenu}
              className="text-white hover:opacity-80 transition-opacity duration-fast"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links - Centered in full page */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, index) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`
                      font-heading font-bold text-2xl uppercase
                      transition-all duration-300
                      ${active
                        ? 'text-white'
                        : 'text-transparent [webkit-text-stroke-width:1px] [webkit-text-stroke-color:#ffffff] hover:text-white hover:[webkit-text-stroke-width:0]'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isMenuOpen ? 'fadeInUp 0.5s ease-out forwards' : 'none',
                      opacity: 0
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
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

