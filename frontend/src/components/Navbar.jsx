import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { spacing } from '../styles/design-tokens/spacing';

const Navbar = ({ variant = 'white' }) => {
  const location = useLocation();

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

  // Determine navbar classes based on variant (desktop only)
  const getNavbarClasses = () => {
    const baseClasses = 'sticky top-0 z-50';
    
    if (variant === 'menu') {
      return `${baseClasses} md:bg-white bg-white`;
    } else {
      // Default: white background
      return `${baseClasses} bg-white`;
    }
  };

  return (
    <nav className={getNavbarClasses()}>
      <div 
        className="max-w-6xl mx-auto flex items-center justify-between h-24 md:h-28"
        style={{ padding: spacing.xl }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/FGA-Logo.png"
            alt="FGA Logo"
            className="h-20 md:h-20"
            style={{ height: '80px', width: 'auto' }}
          />
        </Link>

        {/* Navigation Links or Menu - Desktop only (hidden on mobile, shown on md+) */}
        {variant === 'menu' ? (
          <button className="hidden md:flex items-center gap-2 font-heading font-bold text-base uppercase text-river-bed hover:text-gulf-stream transition-colors duration-fast">
            <Menu size={24} />
            <span>MENU</span>
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    font-heading font-bold text-sm uppercase transition-colors duration-fast px-4 py-2 rounded-lg
                    ${active
                      ? 'bg-gulf-stream text-white'
                      : 'text-river-bed hover:text-gulf-stream'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

