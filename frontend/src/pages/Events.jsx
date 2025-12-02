import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchEvents } from '../services/eventsService';
import colors from '../styles/design-tokens/colors';

function Events() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load events (extracted for reuse)
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents();
      // Map API response to component format
      const formattedEvents = Array.isArray(data) ? data.map(event => ({
        id: event.id,
        title: event.title || 'Untitled Event',
        description: event.description || '',
        date: event.date ? formatDate(event.date) : 'Date TBD',
        time: event.date ? formatTime(event.date) : '',
        location: event.location || 'Location TBD',
        image: event.image_url || 'https://via.placeholder.com/400x250',
        category: extractCategory(event.title, event.description) || 'tournament',
        maxParticipants: event.max_participants || null,
        registered: 0, // TODO: Get from registrations count
        status: event.registration_open ? 'open' : 'closed'
      })) : [];
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      
      // Handle different error types
      let errorMessage = 'Failed to load events. Please try again later.';
      
      if (!err.response) {
        // Network error or server not reachable
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        errorMessage = `Unable to connect to the server at ${apiUrl}. Please ensure the backend server is running on port 5000.`;
      } else if (err.response.status === 404) {
        errorMessage = 'Events endpoint not found. Please contact support if this issue persists.';
      } else if (err.response.status >= 500) {
        errorMessage = 'Server error occurred. Please try again in a few moments.';
      } else if (err.response.status === 401) {
        errorMessage = 'Authentication required. Please log in to view events.';
      } else if (err.response.status === 403) {
        errorMessage = 'You do not have permission to view events.';
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    loadEvents();
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

  // Helper function to extract category from title/description
  const extractCategory = (title, description) => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('workshop')) return 'workshop';
    if (text.includes('camp')) return 'camp';
    if (text.includes('tournament') || text.includes('championship') || text.includes('competition')) return 'tournament';
    return 'tournament'; // default
  };

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getCategoryLabel = (category) => {
    const labels = {
      tournament: 'Tournament',
      workshop: 'Workshop',
      camp: 'Camp'
    };
    return labels[category] || category;
  };

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-32 flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
        style={{
          backgroundImage: 'url(https://via.placeholder.com/1920x1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            Events & Competitions
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white opacity-90 max-w-3xl mx-auto px-4">
            Discover exciting events, tournaments, and training opportunities
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full py-8 sm:py-12 bg-white border-b border-geyser">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search events by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {['all', 'tournament', 'workshop', 'camp'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-fast ${
                    selectedFilter === filter
                      ? 'bg-gulf-stream text-white'
                      : 'bg-geyser text-river-bed hover:bg-gulf-stream hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'All Events' : getCategoryLabel(filter)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Listing Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          {loading ? (
            <LoadingSpinner message="Loading events..." fullPage={true} />
          ) : error ? (
            <div className="text-center py-12 px-4">
              <div className="max-w-md mx-auto">
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
                  Error Loading Events
                </h3>
                <p className="text-base text-red-600 mb-4">{error}</p>
                {error.includes('Unable to connect') && (
                  <div className="bg-geyser rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                    <p className="text-sm font-semibold text-river-bed mb-2">Troubleshooting:</p>
                    <ul className="text-sm text-oslo-gray space-y-1 list-disc list-inside">
                      <li>Make sure the backend server is running</li>
                      <li>Check if the server is running on port 5000</li>
                      <li>Verify your .env file has VITE_API_URL set correctly</li>
                      <li>Check the browser console for more details</li>
                    </ul>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    text="Try Again"
                    variant="primary"
                    onClick={loadEvents}
                  />
                  <Button
                    text="Go to Home"
                    variant="outline"
                    onClick={() => navigate('/')}
                  />
                </div>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-oslo-gray mb-4">No events found matching your criteria.</p>
              <Button
                text="Clear Filters"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <p className="text-base sm:text-lg text-oslo-gray">
                  Showing <span className="font-semibold text-river-bed">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    title={event.title}
                    image={event.image}
                    imageAlt={event.title}
                    variant="elevated"
                    footer={
                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-oslo-gray">
                          <span className="font-medium">📅</span> {event.date}
                          {event.time && <span className="ml-2">• {event.time}</span>}
                        </div>
                        <div className="text-sm text-oslo-gray">
                          <span className="font-medium">📍</span> {event.location}
                        </div>
                        <div className="pt-2 border-t border-geyser">
                          <Button
                            text="View Details"
                            variant="primary"
                            onClick={() => navigate(`/events/${event.id}`)}
                          />
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </>
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
            Want to Host an Event?
          </h2>
          <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 opacity-90 px-4">
            Contact us to learn about hosting your event at Future Generation Academy
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

export default Events;

