import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchEventById } from '../services/eventsService';
import { registerForEvent, getMyRegistrations } from '../services/registrationService';
import colors from '../styles/design-tokens/colors';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    // Check on mount
    checkAuth();
    
    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Check when window regains focus (e.g., user logs in and comes back)
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  // Check if user is already registered for this event
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!isAuthenticated || !id) {
        setIsAlreadyRegistered(false);
        return;
      }

      try {
        setCheckingRegistration(true);
        const registrations = await getMyRegistrations();
        
        // Check if current event is in user's registrations
        const eventId = parseInt(id);
        const isRegistered = registrations.some(
          reg => reg.event && reg.event.id === eventId && reg.status !== 'cancelled'
        );
        
        setIsAlreadyRegistered(isRegistered);
      } catch (error) {
        console.error('Error checking registration status:', error);
        // Don't set error state here, just assume not registered
        setIsAlreadyRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistrationStatus();
  }, [isAuthenticated, id]);

  // Fetch event details on component mount
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEventById(id);
        
        // Format event data
        const formattedEvent = {
          id: data.id,
          title: data.title || 'Untitled Event',
          description: data.description || '',
          date: data.date ? formatDate(data.date) : 'Date TBD',
          time: data.date ? formatTime(data.date) : '',
          datetime: data.date,
          location: data.location || 'Location TBD',
          image: data.image_url || 'https://via.placeholder.com/1200x600',
          maxParticipants: data.max_participants || null,
          registrationOpen: data.registration_open !== false,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setEvent(formattedEvent);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        
        // Handle different error types
        let errorMessage = 'Failed to load event details. Please try again later.';
        
        if (!err.response) {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          errorMessage = `Unable to connect to the server at ${apiUrl}. Please ensure the backend server is running.`;
        } else if (err.response.status === 404) {
          errorMessage = 'Event not found. It may have been removed or the ID is incorrect.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Server error occurred. Please try again in a few moments.';
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id]);

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

  // Helper function to format full datetime
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <LoadingSpinner message="Loading event details..." fullPage={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <section className="w-full py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center py-12">
              <div className="mb-6">
                <svg 
                  className="w-16 h-16 mx-auto text-red-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-river-bed mb-2">
                Error Loading Event
              </h3>
              <p className="text-base text-red-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  text="Try Again"
                  variant="primary"
                  onClick={() => window.location.reload()}
                />
                <Button
                  text="Back to Events"
                  variant="outline"
                  onClick={() => navigate('/events')}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <>
      {/* Hero Section with Event Image */}
      <section 
        className="relative w-full py-20 md:py-32 flex items-center justify-center min-h-[400px] md:min-h-[500px]"
        style={{
          backgroundImage: `url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            {event.title}
          </h1>
          {event.location && (
            <p className="text-base sm:text-lg md:text-xl text-white opacity-90 flex items-center justify-center gap-2">
              <MapPin size={20} />
              {event.location}
            </p>
          )}
        </div>
      </section>

      {/* Event Details Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-oslo-gray hover:text-gulf-stream mb-8 transition-colors duration-fast"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Events</span>
          </button>

          {/* Event Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Date */}
            <div className="bg-geyser rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-fast">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-gulf-stream" size={24} />
                <h3 className="text-sm font-semibold text-oslo-gray uppercase tracking-wide">Date & Time</h3>
              </div>
              <p className="text-xl font-bold text-river-bed mb-1">{event.date}</p>
              {event.time ? (
                <p className="text-base text-oslo-gray flex items-center gap-2">
                  <Clock size={16} />
                  {event.time}
                </p>
              ) : (
                <p className="text-sm text-oslo-gray italic">Time TBD</p>
              )}
            </div>

            {/* Location */}
            <div className="bg-geyser rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-fast">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="text-gulf-stream" size={24} />
                <h3 className="text-sm font-semibold text-oslo-gray uppercase tracking-wide">Location</h3>
              </div>
              <p className="text-xl font-bold text-river-bed">{event.location}</p>
            </div>

            {/* Max Participants */}
            <div className="bg-geyser rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-fast">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-gulf-stream" size={24} />
                <h3 className="text-sm font-semibold text-oslo-gray uppercase tracking-wide">Capacity</h3>
              </div>
              {event.maxParticipants ? (
                <p className="text-xl font-bold text-river-bed">
                  Up to {event.maxParticipants} {event.maxParticipants === 1 ? 'participant' : 'participants'}
                </p>
              ) : (
                <p className="text-lg text-oslo-gray italic">Unlimited</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-river-bed mb-6">
              Event Description
            </h2>
            <div className="bg-geyser rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="prose max-w-none">
                {event.description ? (
                  <p className="text-base sm:text-lg text-oslo-gray leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                ) : (
                  <p className="text-base text-oslo-gray italic">
                    No description available for this event.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Registration Status */}
          <div className="border-t border-geyser pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                  Registration Status
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.registrationOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {event.registrationOpen ? 'Open for Registration' : 'Registration Closed'}
                  </span>
                  {event.registrationOpen && !isAuthenticated && (
                    <span className="text-sm text-oslo-gray italic">
                      Please log in to register for this event
                    </span>
                  )}
                </div>
              </div>
              {event.registrationOpen && (
                <div className="relative">
                  <Button
                    text={
                      registering 
                        ? 'Registering...' 
                        : registrationSuccess || isAlreadyRegistered 
                        ? 'Already Registered' 
                        : 'Register Now'
                    }
                    variant="primary"
                    onClick={async () => {
                      if (isAuthenticated) {
                        try {
                          setRegistering(true);
                          setRegistrationError(null);
                          setRegistrationSuccess(false);
                          
                          await registerForEvent(event.id);
                          
                          setRegistrationSuccess(true);
                          setIsAlreadyRegistered(true); // Update registration status
                          // Optionally refresh event data to show updated registration count
                        } catch (error) {
                          console.error('Registration error:', error);
                          if (error.response?.status === 409) {
                            setRegistrationError('You are already registered for this event');
                          } else if (error.response?.status === 400) {
                            setRegistrationError(error.response.data?.error || 'Registration failed. Event may be full or closed.');
                          } else if (error.response?.status === 401) {
                            setRegistrationError('Please log in to register');
                            navigate(`/login?redirect=/events/${event.id}`);
                          } else {
                            setRegistrationError(error.response?.data?.error || 'Failed to register. Please try again.');
                          }
                        } finally {
                          setRegistering(false);
                        }
                      } else {
                        // Navigate to login page with return URL
                        navigate(`/login?redirect=/events/${event.id}`);
                      }
                    }}
                    disabled={!isAuthenticated || registering || registrationSuccess || isAlreadyRegistered || checkingRegistration}
                  />
                  {!isAuthenticated && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center mt-2">
                      <p className="text-xs text-oslo-gray">
                        <button
                          onClick={() => navigate('/login')}
                          className="text-gulf-stream hover:underline font-medium"
                        >
                          Log in
                        </button>
                        {' '}to register
                      </p>
                    </div>
                  )}
                  {(registrationSuccess || isAlreadyRegistered) && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center mt-2">
                      <p className="text-xs text-green-600 font-medium">
                        ✓ {registrationSuccess ? 'Successfully registered!' : 'You are registered for this event'}
                      </p>
                    </div>
                  )}
                  {registrationError && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center mt-2">
                      <p className="text-xs text-red-600">
                        {registrationError}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {event.createdAt && (
            <div className="mt-8 pt-8 border-t border-geyser">
              <p className="text-sm text-oslo-gray">
                Event created on {formatDateTime(event.createdAt)}
                {event.updatedAt && event.updatedAt !== event.createdAt && (
                  <span> • Last updated on {formatDateTime(event.updatedAt)}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="w-full py-12 sm:py-16 md:py-20"
        style={{ backgroundColor: colors['gulf-stream'] }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Have Questions?
          </h2>
          <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 opacity-90 px-4">
            Contact us for more information about this event
          </p>
          <Button
            text="Contact Us"
            variant="secondary"
            onClick={() => navigate('/contact')}
          />
        </div>
      </section>
    </>
  );
}

export default EventDetail;

