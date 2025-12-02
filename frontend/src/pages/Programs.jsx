import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPrograms } from '../services/programsService';
import colors from '../styles/design-tokens/colors';

function Programs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Function to load programs (extracted for reuse)
  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPrograms();
      
      // Map API response to component format
      const formattedPrograms = Array.isArray(data) ? data.map(program => ({
        id: program.id,
        name: program.name || 'Untitled Program',
        description: program.description || '',
        ageGroup: program.age_group || 'All Ages',
        schedule: program.schedule || 'Schedule TBD',
        price: program.price ? formatPrice(program.price) : 'Free',
        image: program.image_url || 'https://via.placeholder.com/400x250',
        isActive: program.is_active !== false,
        createdAt: program.created_at,
        updatedAt: program.updated_at
      })) : [];
      
      // Filter out inactive programs (or show all based on requirements)
      const activePrograms = formattedPrograms.filter(p => p.isActive);
      setPrograms(activePrograms);
    } catch (err) {
      console.error('Failed to fetch programs:', err);
      
      // Handle different error types
      let errorMessage = 'Failed to load programs. Please try again later.';
      
      if (!err.response) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        errorMessage = `Unable to connect to the server at ${apiUrl}. Please ensure the backend server is running on port 5000.`;
      } else if (err.response.status === 404) {
        errorMessage = 'Programs endpoint not found. Please contact support if this issue persists.';
      } else if (err.response.status >= 500) {
        errorMessage = 'Server error occurred. Please try again in a few moments.';
      } else if (err.response.status === 401) {
        errorMessage = 'Authentication required. Please log in to view programs.';
      } else if (err.response.status === 403) {
        errorMessage = 'You do not have permission to view programs.';
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch programs on component mount
  useEffect(() => {
    loadPrograms();
  }, []);

  // Helper function to format price
  const formatPrice = (price) => {
    if (price === 0 || price === null || price === undefined) {
      return 'Free';
    }
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Extract unique age groups from programs
  const ageGroups = ['all', ...new Set(programs.map(p => p.ageGroup).filter(Boolean))];

  // Filter programs based on search and age group
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.ageGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = selectedAgeGroup === 'all' || program.ageGroup === selectedAgeGroup;
    return matchesSearch && matchesAgeGroup;
  });

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
            Our Programs
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white opacity-90 max-w-3xl mx-auto px-4">
            Discover comprehensive training programs designed to develop skills, build confidence, and achieve excellence
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full py-8 sm:py-12 bg-white border-b border-geyser">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray" size={20} />
                <Input
                  type="text"
                  placeholder="Search programs by name, description, or age group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Age Group Filter */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {ageGroups.slice(0, 6).map((ageGroup) => (
                <button
                  key={ageGroup}
                  onClick={() => setSelectedAgeGroup(ageGroup)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-fast ${
                    selectedAgeGroup === ageGroup
                      ? 'bg-gulf-stream text-white'
                      : 'bg-geyser text-river-bed hover:bg-gulf-stream hover:text-white'
                  }`}
                >
                  {ageGroup === 'all' ? 'All Ages' : ageGroup}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Listing Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
          {loading ? (
            <LoadingSpinner message="Loading programs..." fullPage={true} />
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
                  Error Loading Programs
                </h3>
                <p className="text-base text-red-600 mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    text="Try Again"
                    variant="primary"
                    onClick={loadPrograms}
                  />
                  <Button
                    text="Go to Home"
                    variant="outline"
                    onClick={() => navigate('/')}
                  />
                </div>
              </div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-oslo-gray mb-4">No programs found matching your criteria.</p>
              <Button
                text="Clear Filters"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedAgeGroup('all');
                }}
              />
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <p className="text-base sm:text-lg text-oslo-gray">
                  Showing <span className="font-semibold text-river-bed">{filteredPrograms.length}</span> program{filteredPrograms.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredPrograms.map((program) => (
                  <Card
                    key={program.id}
                    title={program.name}
                    description={program.description}
                    image={program.image}
                    imageAlt={program.name}
                    variant="elevated"
                    footer={
                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-oslo-gray">
                          <span className="font-medium">👥</span> {program.ageGroup || 'All Ages'}
                        </div>
                        <div className="text-sm text-oslo-gray">
                          <span className="font-medium">🕐</span> {program.schedule || 'Schedule TBD'}
                        </div>
                        <div className="text-sm text-oslo-gray">
                          <span className="font-medium">💰</span> {program.price}
                        </div>
                        <div className="pt-2 border-t border-geyser">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                text="View Details"
                                variant="outline"
                                onClick={() => navigate(`/programs/${program.id}`)}
                                className="flex-1 py-3"
                              />
                              <Button
                                text="Register"
                                variant="primary"
                                onClick={() => {
                                  if (isAuthenticated) {
                                    // TODO: Navigate to registration page or open registration modal
                                    console.log('Register for program:', program.id);
                                  } else {
                                    // Navigate to login page with return URL
                                    navigate(`/login?redirect=/programs`);
                                  }
                                }}
                                disabled={!isAuthenticated}
                                className="flex-1 py-3"
                              />
                            </div>
                            {!isAuthenticated && (
                              <p className="text-xs text-oslo-gray text-center">
                                <button
                                  onClick={() => navigate('/login')}
                                  className="text-gulf-stream hover:underline font-medium"
                                >
                                  Log in
                                </button>
                                {' '}to register
                              </p>
                            )}
                          </div>
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
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 opacity-90 px-4">
            Contact us to learn more about our programs and find the perfect fit for you
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

export default Programs;

