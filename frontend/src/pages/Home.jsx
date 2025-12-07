import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import OutlinedHeading from '../components/OutlinedHeading';
import TextHighlighter from '../component/TextHighlighter';
import colors from '../styles/design-tokens/colors';
import { fetchEvents } from '../services/eventsService';

function Home() {
  const navigate = useNavigate();
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

  // Get featured event (first/soonest event)
  const featuredEvent = events.length > 0 ? events[0] : null;
  // Get next 2 events for the grid
  const otherEvents = events.slice(1, 3);

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
            <button
              onClick={() => navigate('/about')}
              className="px-4 py-4 md:px-6 md:py-6 rounded-full text-sm md:text-base font-bold transition-all duration-fast cursor-pointer bg-transparent border-3 border-gulf-stream hover:bg-gulf-stream text-gulf-stream hover:text-white flex items-center gap-2 mx-auto"
            >
              More About Us
              <ArrowRight size={20} className="w-4 h-4 md:w-5 md:h-5" />
            </button>
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
            <>
              {/* Featured Event (Soonest) */}
              {featuredEvent && (
                <div className="mb-12">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Large Image on Left */}
                    <div className="w-full md:w-1/2">
                      <img
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    {/* Content on Right */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <div className="text-sm text-oslo-gray mb-2">
                        EVENTS - {featuredEvent.date}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-heading font-bold text-river-bed mb-4">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-base text-oslo-gray mb-6 leading-relaxed">
                        {featuredEvent.description || 'Join us for an exciting event!'}
                      </p>
                      <div className="text-sm text-oslo-gray mb-6">
                        <div className="mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-oslo-gray" />
                          <span>{featuredEvent.date}</span>
                          {featuredEvent.time && <span className="text-oslo-gray">• {featuredEvent.time}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-oslo-gray" />
                          <span>{featuredEvent.location}</span>
                        </div>
                      </div>
                      <Button
                        text="Learn More"
                        variant="primary"
                        onClick={() => navigate(`/events/${featuredEvent.id}`)}
                      />
                    </div>
                  </div>
                </div>
              )}
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
            <>
              {/* Featured Event (Soonest) */}
              {featuredEvent && (
                <div className="mb-12">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Large Image on Left */}
                    <div className="w-full md:w-1/2">
                      <img
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    {/* Content on Right */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <div className="text-sm text-oslo-gray mb-2">
                        EVENTS - {featuredEvent.date}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-heading font-bold text-river-bed mb-4">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-base text-oslo-gray mb-6 leading-relaxed">
                        {featuredEvent.description || 'Join us for an exciting event!'}
                      </p>
                      <div className="text-sm text-oslo-gray mb-6">
                        <div className="mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-oslo-gray" />
                          <span>{featuredEvent.date}</span>
                          {featuredEvent.time && <span className="text-oslo-gray">• {featuredEvent.time}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-oslo-gray" />
                          <span>{featuredEvent.location}</span>
                        </div>
                      </div>
                      <Button
                        text="Learn More"
                        variant="primary"
                        onClick={() => navigate(`/events/${featuredEvent.id}`)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Other Events Grid */}
              {otherEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherEvents.map((event) => (
                    <Card
                      key={event.id}
                      title={event.title}
                      description={event.description}
                      image={event.image}
                      imageAlt={event.title}
                      footer={
                        <div className="flex flex-col gap-2">
                          <div className="text-sm text-oslo-gray flex items-center gap-2">
                            <Calendar size={16} className="text-oslo-gray" />
                            <span>{event.date}</span>
                          </div>
                          <div className="text-sm text-oslo-gray flex items-center gap-2">
                            <MapPin size={16} className="text-oslo-gray" />
                            <span>{event.location}</span>
                          </div>
                          <Button
                            text="Learn More"
                            variant="primary"
                            onClick={() => navigate(`/events/${event.id}`)}
                          />
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
              {/* Other Events Grid */}
              {otherEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherEvents.map((event) => (
                    <Card
                      key={event.id}
                      title={event.title}
                      description={event.description}
                      image={event.image}
                      imageAlt={event.title}
                      footer={
                        <div className="flex flex-col gap-2">
                          <div className="text-sm text-oslo-gray flex items-center gap-2">
                            <Calendar size={16} className="text-oslo-gray" />
                            <span>{event.date}</span>
                          </div>
                          <div className="text-sm text-oslo-gray flex items-center gap-2">
                            <MapPin size={16} className="text-oslo-gray" />
                            <span>{event.location}</span>
                          </div>
                          <Button
                            text="Learn More"
                            variant="primary"
                            onClick={() => navigate(`/events/${event.id}`)}
                          />
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </>
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
    </>
  );
}

export default Home;
