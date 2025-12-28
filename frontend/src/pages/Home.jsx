import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import OutlinedHeading from '../components/OutlinedHeading';
import TextHighlighter from '../component/TextHighlighter';
import colors from '../styles/design-tokens/colors';
import { fetchEvents } from '../services/eventsService';
import { useAuth } from '../context/AuthContext';

// Subscription / Pricing section adapted to FGA color scheme
function Pricing4({ isAuthenticated, navigate }) {
  
  const CheckIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
  const ProPlanIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
      <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"></path>
    </svg>
  );

  const Tag = ({ text }) => (
    <div className="inline-flex items-center gap-2 bg-geyser text-gulf-stream text-xs font-bold px-3 py-1 rounded-full tracking-wider">
      <span className="w-2 h-2 bg-gulf-stream rounded-full"></span>
      {text}
    </div>
  );

  const GetStartedButton = ({ isFeatured, label = 'Get Started' }) => (
    <button
      type="button"
      aria-label={label}
      className={`w-full text-center py-3.5 rounded-lg font-semibold text-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isFeatured
          ? 'bg-white text-gulf-stream ring-gulf-stream ring-offset-gulf-stream/10'
          : 'bg-geyser text-river-bed ring-geyser ring-offset-white'
      }`}
    >
      {label}
    </button>
  );

  const FeatureListItem = ({ children, isFeatured }) => (
    <li className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isFeatured ? 'bg-white/25' : 'bg-geyser'}`}>
        <CheckIcon className={`${isFeatured ? 'text-white' : 'text-river-bed'} w-3.5 h-3.5`} />
      </div>
      <span className={`text-sm ${isFeatured ? 'text-white/90' : 'text-river-bed'}`}>{children}</span>
    </li>
  );

  const Header = () => (
    <header className="relative text-center mb-12 md:mb-20 px-4 z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gulf-stream/20 dark:bg-gulf-stream/30 rounded-full filter blur-3xl opacity-40 -z-10" aria-hidden="true"></div>

      <div className="flex justify-center mb-4">
        <Tag text="OVER 1,000 MEMBERS" />
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-river-bed leading-tight tracking-tighter">
        Membership plans for <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gulf-stream to-river-bed">players and teams</span>
      </h1>

      <p className="text-river-bed mt-6 text-base sm:text-lg max-w-2xl mx-auto">
        Choose the right plan to access training sessions, tournaments and exclusive academy benefits.
      </p>
    </header>
  );

  const PricingCard = ({ plan, price, description, features, isFeatured = false, onSubscribe }) => (
    <article
      className={`relative rounded-2xl h-full flex items-center`}
      aria-label={`${plan} plan`}
    >
      <div className={`p-6 ${isFeatured ? 'md:p-10 lg:p-12' : 'md:p-8'} rounded-2xl w-full ${isFeatured ? 'h-[480px] md:h-[540px] flex flex-col' : 'flex flex-col'} ${isFeatured ? 'bg-gradient-to-b from-gulf-stream to-river-bed text-white shadow-2xl' : 'bg-white text-river-bed shadow-lg'}`}>
      {isFeatured && (
        <div className="absolute -top-3 right-6 z-0">
          <span className="inline-flex items-center rounded-full bg-white/20 text-white/90 text-xs font-semibold px-3 py-1 backdrop-blur pointer-events-none">
            Most popular
          </span>
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <ProPlanIcon className={`w-5 h-5 ${isFeatured ? 'text-white/80' : 'text-oslo-gray'}`} />
        <h3 className={`text-xs font-bold tracking-widest uppercase ${isFeatured ? 'text-white/80' : 'text-oslo-gray'}`}>{plan}</h3>
      </div>

      <div className="mb-6 flex items-baseline gap-1.5">
        {price === 0 ? (
          <>
            <span className={`text-4xl sm:text-5xl font-bold ${isFeatured ? 'text-white' : 'text-river-bed'}`}>Free</span>
            <span className={`${isFeatured ? 'text-white/70' : 'text-oslo-gray'} text-sm`}>&nbsp;Forever</span>
          </>
        ) : (
          <>
            <span className={`text-4xl sm:text-5xl font-bold ${isFeatured ? 'text-white' : 'text-river-bed'}`}>{price} OMR</span>
            <span className={`${isFeatured ? 'text-white/70' : 'text-oslo-gray'} text-sm`}>&nbsp;/ month</span>
          </>
        )}
      </div>

      <p className={`mb-8 min-h-[4.5rem] text-sm ${isFeatured ? 'text-white/85' : 'text-oslo-gray'}`}>{description}</p>

      <div className="mb-8">
        <button
          onClick={onSubscribe}
          type="button"
          aria-label={`Get ${plan}`}
          className={`w-full text-center py-3.5 rounded-lg font-semibold text-md cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 relative z-10 ${
            isFeatured
              ? 'bg-white text-gulf-stream ring-gulf-stream ring-offset-gulf-stream/10'
              : 'bg-geyser text-river-bed ring-geyser ring-offset-white'
          }`}
        >
          Get {plan}
        </button>
      </div>

      <ul className="space-y-4 mt-auto">
        {features.map((feature, index) => (
          <FeatureListItem key={`${plan}-${index}`} isFeatured={isFeatured}>
            {feature}
          </FeatureListItem>
        ))}
      </ul>
      </div>
    </article>
  );

  const pricingPlans = [
    {
      plan: 'Starter',
      price: 10,
      description: 'For individuals or small teams getting started.',
      features: ['Weekly training sessions', 'Access to basic facilities', 'Event notifications'],
      isFeatured: false
    },
    {
      plan: 'Pro',
      price: 24,
      description: 'For teams that need advanced collaboration and priority access.',
      features: ['Everything in Starter', 'Priority event registration', 'Coach feedback sessions', 'Team management tools'],
      isFeatured: true
    },
    {
      plan: 'Business',
      price: 112,
      description: 'For larger organizations with dedicated support and custom plans.',
      features: ['Everything in Pro', 'Custom roles & SSO', 'Dedicated success manager', 'Advanced reporting'],
      isFeatured: false
    }
  ];

  

  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .pricing-grid {
            grid-template-columns: 1fr 1.2fr 1fr;
          }
        }
      `}</style>
      <div className="relative font-sans flex flex-col items-center justify-center overflow-x-hidden bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <Header />
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start lg:items-center max-w-6xl mx-auto pricing-grid">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={`${plan.plan}-${index}`} 
                {...plan}
                onSubscribe={() => {
                  if (isAuthenticated) {
                    // User is logged in, redirect to payment
                    navigate('/payment', {
                      state: {
                        plan: plan.plan,
                        amount: plan.price,
                        description: plan.description
                      }
                    });
                  } else {
                    // User is not logged in, redirect to login with return path
                    navigate('/login', {
                      state: {
                        from: '/payment',
                        paymentData: {
                          plan: plan.plan,
                          amount: plan.price,
                          description: plan.description
                        }
                      }
                    });
                  }
                }}
              />
            ))}
          </main>
        </div>
      </div>

    </>
  );
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const videoRef = useRef(null);
  const eventsSectionRef = useRef(null);
  const statsSectionRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headingScrollProgress, setHeadingScrollProgress] = useState(0);
  const [activeMembers, setActiveMembers] = useState(200);
  const [awardsReceived, setAwardsReceived] = useState(120);
  const [totalPlayersTrained, setTotalPlayersTrained] = useState(4000);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventsCarouselIndex, setEventsCarouselIndex] = useState(0);

  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  // Force video to play on mount (with mobile optimizations)
  useEffect(() => {
    if (videoRef.current) {
      // Optimize video for mobile
      if (isMobile) {
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('preload', 'metadata');
      }
      
      videoRef.current.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    }
  }, [isMobile]);

  // Handle scrolling to membership plans section when hash is present
  useEffect(() => {
    if (location.hash === '#membership-plans') {
      // Small delay to ensure the component has mounted
      setTimeout(() => {
        const element = document.getElementById('membership-plans');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  // Scroll-linked animation for Upcoming Events heading (optimized with requestAnimationFrame)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!eventsSectionRef.current) return;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = eventsSectionRef.current;
          if (!section) return;
          
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calculate progress: 0 when section top enters viewport bottom, 1 when section top reaches viewport center
          const startPoint = windowHeight * 0.85;
          const endPoint = windowHeight * 0.3;
          
          // Progress calculation
          const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (startPoint - endPoint)));
          
          setHeadingScrollProgress(progress);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents();
        
        // Format events data
        const formattedEvents = Array.isArray(data) ? data.map(event => ({
          id: event.id,
          title: event.title || 'Untitled Event',
          description: event.description || '',
          dateRaw: event.date, // Keep original date for sorting
          date: event.date ? formatDate(event.date) : 'Date TBD',
          time: event.date ? formatTime(event.date) : '',
          location: event.location || 'Location TBD',
          image: event.image_url || 'https://via.placeholder.com/1200x600',
          maxParticipants: event.max_participants || null,
          registrationOpen: event.registration_open !== false
        })) : [];
        
        // Sort by date (soonest first) using raw date
        formattedEvents.sort((a, b) => {
          if (!a.dateRaw || !b.dateRaw) return 0;
          const dateA = new Date(a.dateRaw);
          const dateB = new Date(b.dateRaw);
          return dateA - dateB;
        });
        
        setEvents(formattedEvents);
        // Reset carousel index when events change
        setEventsCarouselIndex(0);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Statistics animation on scroll
  useEffect(() => {
    // Helper function to animate counting
    const animateValue = (setter, start, end, duration) => {
      let startTime = null;
      const range = end - start;

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + range * easeOutQuart);
        
        setter(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setter(end);
        }
      };

      requestAnimationFrame(animate);
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Start animations from 80% of final value for shorter animation
          animateValue(setActiveMembers, 200, 250, 1500);
          animateValue(setAwardsReceived, 120, 150, 1500);
          animateValue(setTotalPlayersTrained, 4000, 5000, 1500);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = statsSectionRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated]);

  // Countdown timer for next match
  useEffect(() => {
    // Set next match date (example: 7 days from now)
    const nextMatchDate = new Date();
    nextMatchDate.setDate(nextMatchDate.getDate() + 7);
    nextMatchDate.setHours(18, 30, 0, 0);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = nextMatchDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return '';
    }
  };

  // Carousel logic: featured event always stays the same (first event), only small events change
  // Featured event is always events[0]
  const featuredEvent = events.length > 0 ? events[0] : null;
  
  // Small events: start from index 1, show 3 events per page
  const smallEventsPerPage = 3;
  const totalSmallEvents = Math.max(0, events.length - 1); // All events except the first one
  const maxCarouselIndex = Math.max(0, Math.ceil(totalSmallEvents / smallEventsPerPage) - 1);
  
  // Calculate which small events to show based on carousel index
  const getSmallEvents = () => {
    if (events.length <= 1) return []; // No small events if only 1 or 0 events
    
    const startIndex = 1 + (eventsCarouselIndex * smallEventsPerPage); // Start from index 1 (skip featured event)
    return events.slice(startIndex, startIndex + smallEventsPerPage);
  };
  
  const smallEvents = getSmallEvents();
  
  const handleNextEvents = () => {
    if (eventsCarouselIndex < maxCarouselIndex) {
      setEventsCarouselIndex(eventsCarouselIndex + 1);
    }
  };
  
  const handlePrevEvents = () => {
    if (eventsCarouselIndex > 0) {
      setEventsCarouselIndex(eventsCarouselIndex - 1);
    }
  };
  
  const handleGoToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex <= maxCarouselIndex) {
      setEventsCarouselIndex(pageIndex);
    }
  };
  
  const canNavigateNext = eventsCarouselIndex < maxCarouselIndex;
  const canNavigatePrev = eventsCarouselIndex > 0;
  const totalPages = maxCarouselIndex + 1; // Total number of pages for small events

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          src="/videos/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload={isMobile ? "metadata" : "auto"}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            willChange: 'auto',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
          onError={(e) => console.error('Video failed to load:', e)}
          onLoadedData={() => console.log('Video loaded successfully')}
        />
        
        {/* Overlay for better text readability */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }}
        />
        
      </section>

      {/* About Us Preview Section */}
      <section className="w-full py-8 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center pt-8 md:pt-20">
            <p className="text-lg md:text-3xl font-heading font-thin text-river-bed mb-10 leading-normal">
              <TextHighlighter
                trigger="inView"
                direction="left"
                color={colors['gulf-stream']}
                duration={2000}
                threshold={0.5}
                rootMargin="-50px"
              >
                Future Generation Academy (FGA)
              </TextHighlighter>
              {' '}is dedicated to fostering excellence in sports through 
              comprehensive training programs, state-of-the-art facilities, and a commitment to 
              developing well-rounded athletes.
            </p>
            <Button
              text="More About Us"
              variant="slide-arrow"
              primaryColor="#80b3b4"
              onClick={() => {
                // Prevent scroll restoration and ensure we scroll to top
                if ('scrollRestoration' in window.history) {
                  window.history.scrollRestoration = 'manual';
                }
                // Immediately scroll to top before navigation
                window.scrollTo(0, 0);
                navigate('/about', { state: { scrollToImage: true }, replace: false });
              }}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section ref={eventsSectionRef} className="w-full py-16 md:py-24 bg-white overflow-hidden" style={{ willChange: 'auto' }}>
        <div className="w-full mx-auto px-12 md:px-16 lg:px-24">
          <div className="text-center mb-12">
            <div className="flex flex-col items-center mb-4" style={{ willChange: 'transform' }}>
              <OutlinedHeading text="Next On" offset="-ml-20 md:-ml-56" shadowDirection="left" scrollProgress={headingScrollProgress} animateFrom="left" />
              <OutlinedHeading text="The Lineup" offset="ml-20 md:ml-56" shadowDirection="right" scrollProgress={headingScrollProgress} animateFrom="right" textColor="text-gulf-stream" strokeColor="#80b3b4" />
            </div>
            <p className="text-lg text-oslo-gray max-w-2xl mx-auto">
              Join us for exciting events and competitions
            </p>
          </div>
          {loading ? (
            <div className="py-12">
              <LoadingSpinner message="Loading upcoming events..." />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-oslo-gray mb-4">{error}</p>
              <Button
                text="View All Events"
                variant="outline"
                onClick={() => navigate('/events')}
              />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-oslo-gray mb-4">No upcoming events at this time.</p>
              <Button
                text="View All Events"
                variant="outline"
                onClick={() => navigate('/events')}
              />
            </div>
          ) : (
            <div className="relative">
              {/* Featured Event - Large Card */}
              {featuredEvent && (
                <div 
                  className="mb-8 cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => navigate(`/events/${featuredEvent.id}`)}
                >
                  <div 
                    className="flex flex-col md:flex-row overflow-hidden rounded-lg bg-white"
                    style={{ minHeight: '400px' }}
                  >
                    {/* Image on the left */}
                    <div className="w-full md:w-1/2 flex-shrink-0">
                      <img
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        className="w-full h-full min-h-[400px] object-cover"
                      />
                    </div>
                    
                    {/* Content on the right */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-8 bg-white">
                      <div className="text-xs md:text-sm text-oslo-gray mb-2 uppercase tracking-wider">
                        EVENTS - {featuredEvent.date}
                      </div>
                      <h3 
                        className="text-xl md:text-3xl font-heading font-bold mb-3 md:mb-4"
                        style={{ color: colors['gulf-stream'] }}
                      >
                        {featuredEvent.title}
                      </h3>
                      <p className="text-sm md:text-base text-river-bed mb-4">
                        {featuredEvent.description || 'Join us for an exciting event!'}
                      </p>
                      <button
                        className="text-sm md:text-base font-heading font-bold uppercase transition-colors self-start"
                        style={{ color: colors['gulf-stream'] }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${featuredEvent.id}`);
                        }}
                      >
                        SHOW MORE
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Small Events Grid - Side by Side */}
              {smallEvents.length > 0 && (
                <>
                  <div className="relative flex items-center gap-4">
                    {/* Left Arrow - Show when not on first page */}
                    {canNavigatePrev && (
                      <button
                        onClick={handlePrevEvents}
                        className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity bg-white"
                        style={{ color: colors['gulf-stream'] }}
                        aria-label="Previous events"
                      >
                        <ArrowLeft 
                          size={28} 
                          style={{ color: colors['gulf-stream'] }}
                        />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1">
                      {smallEvents.map((event) => (
                        <div
                          key={event.id}
                          className="cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          <div 
                            className="relative overflow-hidden rounded-lg bg-white"
                            style={{ minHeight: '350px' }}
                          >
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-[200px] md:h-[220px] object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-white">
                              <div className="text-xs text-oslo-gray mb-2 uppercase tracking-wider">
                                EVENTS - {event.date}
                              </div>
                              <h4 
                                className="text-base md:text-lg font-heading font-bold mb-2 line-clamp-2"
                                style={{ color: colors['gulf-stream'] }}
                              >
                                {event.title}
                              </h4>
                              <p className="text-xs md:text-sm text-river-bed mb-3 line-clamp-2">
                                {event.description || 'Join us for an exciting event!'}
                              </p>
                              <button
                                className="text-xs md:text-sm font-heading font-bold uppercase transition-colors"
                                style={{ color: colors['gulf-stream'] }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/events/${event.id}`);
                                }}
                              >
                                SHOW MORE
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Arrow - Only show if there are more small events to navigate */}
                    {totalSmallEvents > smallEventsPerPage && canNavigateNext && (
                      <button
                        onClick={handleNextEvents}
                        className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity bg-white"
                        style={{ color: colors['gulf-stream'] }}
                        aria-label="Next events"
                      >
                        <ArrowRight 
                          size={28} 
                          style={{ color: colors['gulf-stream'] }}
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Pagination Dots - Below the small events */}
                  {totalPages > 1 && (
                    <div className="w-full flex justify-center items-center gap-2 mt-6">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => handleGoToPage(index)}
                          className="transition-all duration-200 hover:scale-110"
                          aria-label={`Go to page ${index + 1}`}
                        >
                          <div
                            className={`rounded-full transition-all duration-200 ${
                              eventsCarouselIndex === index
                                ? 'w-3 h-3' // Active: filled circle
                                : 'w-2.5 h-2.5' // Inactive: smaller outline
                            }`}
                            style={{
                              backgroundColor: eventsCarouselIndex === index 
                                ? colors['gulf-stream'] 
                                : 'transparent',
                              border: `2px solid ${colors['gulf-stream']}`,
                              borderWidth: eventsCarouselIndex === index ? '0' : '2px'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Container for sections after upcoming events */}
      <div className="w-full px-1.5 md:px-3 lg:px-4 pb-1.5 md:pb-3 lg:pb-4">
        <div className="max-w-full bg-gulf-stream rounded-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
          {/* Statistics Section */}
          <section ref={statsSectionRef} className="w-full relative overflow-hidden rounded-xl bg-white">
            {/* Statistics Content */}
            <div className="relative z-10 px-8 md:px-12 lg:px-16 py-12 md:py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Active Members */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gulf-stream mb-2">
                    {activeMembers.toLocaleString()}+
                  </div>
                  <div className="text-base md:text-lg text-gulf-stream/90 font-light">
                    Active Members
                  </div>
                </div>

                {/* Awards Received */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gulf-stream mb-2">
                    {awardsReceived}+
                  </div>
                  <div className="text-base md:text-lg text-gulf-stream/90 font-light">
                    Awards Received
                  </div>
                </div>

                {/* Total Players Trained */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gulf-stream mb-2">
                    {totalPlayersTrained.toLocaleString()}+
                  </div>
                  <div className="text-base md:text-lg text-gulf-stream/90 font-light">
                    Total Players Trained
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Calendar Section */}
          <section className="w-full mt-20 md:mt-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-0 uppercase">CALENDAR</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <span className="text-lg md:text-xl font-bold italic text-white uppercase">NEXT MATCH</span>
                {/* Countdown Timer */}
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {String(countdown.days).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-white uppercase">DAYS</div>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-white">:</span>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {String(countdown.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-white uppercase">HOURS</div>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-white">:</span>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {String(countdown.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-white uppercase">MINS</div>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-white">:</span>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {String(countdown.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm text-white uppercase">SECS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Match Card 1 */}
              <div className="bg-white rounded-lg border border-geyser p-6 flex flex-col">
                <div className="text-xs text-oslo-gray mb-4 uppercase">Next Match 1XBET</div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                  <div className="text-3xl font-bold text-river-bed">VS</div>
                  <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="text-sm font-bold text-river-bed">Saturday, December 06, 18:30</div>
                  <div className="text-sm text-river-bed">La Liga, Matchday 15</div>
                  <div className="text-sm text-river-bed">Estadio La Cartuja de Sevilla</div>
                </div>
              </div>

              {/* Match Card 2 */}
              <div className="bg-white rounded-lg border border-geyser p-6 flex flex-col">
                <div className="text-xs text-oslo-gray mb-4 uppercase">UEFA CHAMPIONS LEAGUE</div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                  <div className="text-3xl font-bold text-river-bed">VS</div>
                  <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="text-sm font-bold text-river-bed">Tuesday, December 09, 21:00</div>
                  <div className="text-sm text-river-bed">UEFA Champions League, Matchday 6</div>
                  <div className="text-sm text-river-bed">Spotify Camp Nou</div>
                </div>
              </div>

              {/* Match Card 3 */}
              <div className="bg-white rounded-lg border border-geyser p-6 flex flex-col">
                <div className="text-xs text-oslo-gray mb-4 uppercase">La Liga</div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                  <div className="text-3xl font-bold text-river-bed">VS</div>
                  <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="text-sm font-bold text-river-bed">Saturday, December 13, 18:30</div>
                  <div className="text-sm text-river-bed">La Liga, Matchday 16</div>
                  <div className="text-sm text-river-bed">Spotify Camp Nou</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Achievements Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-geyser text-gulf-stream text-xs font-bold px-3 py-1 rounded-full tracking-wider">
                <span className="w-2 h-2 bg-gulf-stream rounded-full"></span>
                ACHIEVEMENTS
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-river-bed leading-tight tracking-tighter mb-4">
              Champions in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gulf-stream to-river-bed">Making</span>
            </h2>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Card on the left */}
              <div className="max-w-md mx-auto md:mx-0 relative mt-20 md:mt-28">
                <div 
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-geyser shadow-xl"
                >
                  <div className="overflow-hidden h-64">
                    <img
                      src="/images/fga-achieve-1.jpg"
                      alt="Achievements"
                      className="w-full h-full object-cover scale-150 origin-center object-bottom -translate-y-8"
                    />
                  </div>
                </div>
                <img
                  src="/images/fga-achieve-2.png"
                  alt="Achievements"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto object-contain pointer-events-none"
                />
                <p className="text-center text-base md:text-lg text-river-bed mt-6">
                  Built for players who want more than just a match, because our work doesn't end when the game does
                </p>
              </div>
              
              {/* Achievements list on the right */}
              <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                <p className="text-lg md:text-xl text-river-bed font-semibold">
                  Over 1,000 registered participants across four age categories
                </p>
                <p className="text-lg md:text-xl text-river-bed font-semibold">
                  First Omani football academy to organize international camps in Azerbaijan, Kazakhstan, and Georgia
                </p>
                <p className="text-lg md:text-xl text-river-bed font-semibold">
                  Partnerships with premier league clubs including Gabala FC, FC Kairat, and FC Dinamo Tbilisi
                </p>
                <p className="text-lg md:text-xl text-river-bed font-semibold">
                  Established in 2021 with a mission to discover and nurture sporting talents
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Subscription plans - placed after the statistics & calendar container */}
      <div id="membership-plans" className="w-full">
        <Pricing4 isAuthenticated={isAuthenticated} navigate={navigate} />
      </div>

    </>
  );
}

export default Home;

