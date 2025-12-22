import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls to the top of the page
 * whenever the route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll
    scrollToTop();

    // Additional attempts to ensure it works
    requestAnimationFrame(scrollToTop);
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 10);
  }, [pathname]);

  return null;
}

export default ScrollToTop;

