import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import colors from '../styles/design-tokens/colors';

const TopBar = ({ show = true }) => {
  const { isAuthenticated } = useAuth();
  
  if (!show) return null;

  return (
    <div 
      className="w-full text-white fixed top-0 left-0 right-0 z-40"
      style={{ 
        backgroundColor: colors['gulf-stream'],
        minHeight: '40px'
      }}
    >
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-end gap-3 h-10">
        {/* Login Button - Only show when not authenticated */}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="flex items-center gap-2 px-2 py-1 hover:opacity-80 transition-opacity duration-fast"
            style={{ 
              color: 'white'
            }}
          >
            <div 
              className="w-[16px] h-[16px] md:w-6 md:h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'white' }}
            >
              <User size={10} className="md:hidden" style={{ color: colors['gulf-stream'] }} />
              <User size={14} className="hidden md:block" style={{ color: colors['gulf-stream'] }} />
            </div>
            <span className="font-heading font-bold text-[11px] md:text-sm uppercase">Login</span>
          </Link>
        )}

        {/* Signup Button - Only show when not authenticated */}
        {!isAuthenticated && (
          <Link
            to="/signup"
            className="flex items-center gap-2 px-2 py-1 hover:opacity-80 transition-opacity duration-fast"
            style={{ 
              color: 'white'
            }}
          >
            <Shield size={14} />
            <span className="font-heading font-bold text-[11px] md:text-sm uppercase">Signup</span>
          </Link>
        )}

        {/* Language Selector */}
        <button
          className="w-6 h-6 min-[900px]:w-8 min-[900px]:h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-fast"
          style={{ 
            backgroundColor: '#1e293b', // Dark blue circle
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          aria-label="Language selector"
        >
          <span className="font-heading font-bold text-[10px] min-[900px]:text-xs">EN</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;

