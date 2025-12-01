import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import colors from '../styles/design-tokens/colors';

function Events() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Hardcoded mock data - will be replaced with API call later
  const events = [
    {
      id: 1,
      title: 'Summer Championship',
      description: 'Annual summer championship tournament featuring top athletes from across the region. Compete in multiple categories and showcase your skills.',
      date: 'July 15, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'Main Arena',
      image: 'https://via.placeholder.com/400x250',
      category: 'tournament',
      maxParticipants: 200,
      registered: 145,
      status: 'open'
    },
    {
      id: 2,
      title: 'Youth Development Workshop',
      description: 'Interactive workshop focused on developing fundamental skills for young athletes. Learn from experienced coaches and improve your technique.',
      date: 'August 5, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Training Center',
      image: 'https://via.placeholder.com/400x250',
      category: 'workshop',
      maxParticipants: 50,
      registered: 32,
      status: 'open'
    },
    {
      id: 3,
      title: 'Elite Training Camp',
      description: 'Intensive training camp for advanced athletes seeking to reach the next level. Focus on performance enhancement and competitive preparation.',
      date: 'September 10, 2025',
      time: '8:00 AM - 5:00 PM',
      location: 'Sports Complex',
      image: 'https://via.placeholder.com/400x250',
      category: 'camp',
      maxParticipants: 75,
      registered: 75,
      status: 'full'
    },
    {
      id: 4,
      title: 'Spring Invitational',
      description: 'Competitive invitational event bringing together elite athletes from multiple regions. High-level competition and networking opportunities.',
      date: 'April 20, 2025',
      time: '8:00 AM - 7:00 PM',
      location: 'Main Arena',
      image: 'https://via.placeholder.com/400x250',
      category: 'tournament',
      maxParticipants: 150,
      registered: 98,
      status: 'open'
    }
  ];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {filteredEvents.length === 0 ? (
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

