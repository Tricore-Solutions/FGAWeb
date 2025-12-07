import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = forwardRef(function Footer(props, ref) {
  const location = useLocation();
  
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

  return (
    <footer ref={ref} className="bg-white relative">
      {/* Top gulf-stream border */}
      <div className="h-2 bg-gulf-stream"></div>
      
      <div className="w-full mx-auto px-4 md:px-8 py-12">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <img
              src="/FGA-Logo.png"
              alt="FGA Logo"
              className="h-16 md:h-24 w-auto"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold uppercase text-sm md:text-base font-heading transition-opacity ${
                  active
                    ? 'text-gulf-stream hover:opacity-80'
                    : 'text-black hover:opacity-70'
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-3 md:gap-4 mb-8">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gulf-stream flex items-center justify-center border-2 border-white ring-1 ring-black hover:opacity-90 transition-opacity"
            aria-label="Facebook"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          
          {/* Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gulf-stream flex items-center justify-center border-2 border-white ring-1 ring-black hover:opacity-90 transition-opacity"
            aria-label="Twitter"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          
          {/* Pinterest */}
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gulf-stream flex items-center justify-center border-2 border-white ring-1 ring-black hover:opacity-90 transition-opacity"
            aria-label="Pinterest"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c5.303 0 9.911-3.22 11.76-7.8-.09-.7-.18-1.76.038-2.52.196-.82 1.28-5.64 1.28-5.64s-.326-.653-.326-1.62c0-1.517.88-2.65 1.976-2.65.933 0 1.384.7 1.384 1.54 0 .94-.598 2.347-.906 3.646-.258 1.093.548 1.985 1.63 1.985 1.956 0 3.458-2.062 3.458-5.04 0-2.633-1.894-4.48-4.6-4.48-3.134 0-4.976 2.35-4.976 4.78 0 .94.362 1.95.815 2.5.09.108.103.203.076.313l-.275 1.073c-.03.12-.098.147-.226.09-1.05-.49-1.71-2.03-1.71-3.27 0-2.68 1.95-5.14 5.63-5.14 2.96 0 5.26 2.11 5.26 4.93 0 2.94-1.85 5.3-4.42 5.3-.863 0-1.677-.45-1.956-.98l-.532 2.03c-.193.74-.714 1.67-1.063 2.24.8.247 1.65.38 2.54.38 6.627 0 12-5.372 12-12S18.627 0 12 0z" />
            </svg>
          </a>
          
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gulf-stream flex items-center justify-center border-2 border-white ring-1 ring-black hover:opacity-90 transition-opacity"
            aria-label="Instagram"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          
          {/* Google+ */}
          <a
            href="https://plus.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gulf-stream flex items-center justify-center border-2 border-white ring-1 ring-black hover:opacity-90 transition-opacity"
            aria-label="Google+"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.636 10.929H4.909v2.727h2.727v2.727h2.727v-2.727h2.727v-2.727h-2.727V8.202H7.636v2.727zm7.636 5.455c-1.005 0-1.818.813-1.818 1.818s.813 1.818 1.818 1.818 1.818-.813 1.818-1.818-.813-1.818-1.818-1.818zm3.273-5.455h-2.182v2.182h2.182v2.182h2.182v-2.182h2.182v-2.182h-2.182V8.364h-2.182v2.182zm2.182-5.455c-1.005 0-1.818.813-1.818 1.818s.813 1.818 1.818 1.818 1.818-.813 1.818-1.818-.813-1.818-1.818-1.818zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.818c-5.418 0-9.818-4.4-9.818-9.818S6.582 2.182 12 2.182 21.818 6.582 21.818 12 17.418 21.818 12 21.818z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm md:text-base font-body mt-8">
          <p>© 2026. Future Generation Academy. All rights reserved.</p>
        </div>
      </div>

      {/* Bottom gulf-stream border */}
      <div className="h-2 bg-gulf-stream"></div>
    </footer>
  );
});

export default Footer;

