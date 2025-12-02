import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight, Package, User, Mail } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyRegistrations } from '../services/registrationService';
import AuthContext from '../context/AuthContext';
import colors from '../styles/design-tokens/colors';

function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user registrations
  useEffect(() => {
    const loadRegistrations = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMyRegistrations();
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        if (err.response?.status === 401) {
          setError('Please log in to view your dashboard');
        } else {
          setError('Failed to load your registrations. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadRegistrations();
    }
  }, [isAuthenticated, authLoading]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Separate events and programs
  const eventRegistrations = registrations.filter(reg => reg.type === 'event');
  const programRegistrations = registrations.filter(reg => reg.type === 'program');

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  // Redirect if not authenticated (ProtectedRoute should handle this, but just in case)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center p-8">
            <h2 className="text-2xl font-heading font-bold text-river-bed mb-4">
              Please Log In
            </h2>
            <p className="text-oslo-gray mb-6">
              You need to be logged in to view your dashboard.
            </p>
            <Button
              text="Go to Login"
              variant="primary"
              onClick={() => navigate('/login')}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-r from-gulf-stream to-river-bed">
        <div className="w-full mx-auto px-4 md:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Welcome back, {user?.first_name || 'User'}!
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Manage your events and programs
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="w-full py-12 md:py-16">
        <div className="w-full mx-auto px-4 md:px-8">
          {/* User Info Section */}
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-heading font-bold text-river-bed mb-6">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gulf-stream/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-gulf-stream" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-oslo-gray mb-1">Full Name</p>
                    <p className="text-lg font-heading font-semibold text-river-bed">
                      {user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.first_name || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gulf-stream/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-gulf-stream" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-oslo-gray mb-1">Email Address</p>
                    <p className="text-lg font-heading font-semibold text-river-bed">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oslo-gray mb-1">Total Registrations</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {registrations.length}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-gulf-stream" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oslo-gray mb-1">Events</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {eventRegistrations.length}
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-gulf-stream" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oslo-gray mb-1">Programs</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {programRegistrations.length}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-gulf-stream" />
                </div>
              </div>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner message="Loading your registrations..." />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card>
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  text="Try Again"
                  variant="primary"
                  onClick={() => window.location.reload()}
                />
              </div>
            </Card>
          )}

          {/* Registrations Content */}
          {!loading && !error && (
            <>
              {/* My Registrations Section */}
              {registrations.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-3xl font-heading font-bold text-river-bed mb-2">
                    My Registrations
                  </h2>
                  <p className="text-oslo-gray">
                    View and manage your event and program registrations
                  </p>
                </div>
              )}

              {/* Events Section */}
              {eventRegistrations.length > 0 ? (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-heading font-semibold text-river-bed">
                      Events
                    </h3>
                    <Button
                      text="View All Events"
                      variant="outline"
                      onClick={() => navigate('/events')}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventRegistrations.map((registration) => (
                      <Card key={registration.id} className="hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          {registration.event?.image_url && (
                            <img
                              src={registration.event.image_url}
                              alt={registration.event.title}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                          )}
                          <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                            {registration.event?.title || 'Untitled Event'}
                          </h3>
                          <p className="text-sm text-oslo-gray mb-4 line-clamp-2">
                            {registration.event?.description || 'No description available'}
                          </p>
                          <div className="space-y-2 mb-4">
                            {registration.event?.date && (
                              <div className="flex items-center text-sm text-oslo-gray">
                                <Calendar className="w-4 h-4 mr-2 text-gulf-stream" />
                                <span>{formatDate(registration.event.date)}</span>
                                {formatTime(registration.event.date) && (
                                  <span className="ml-2">at {formatTime(registration.event.date)}</span>
                                )}
                              </div>
                            )}
                            {registration.event?.location && (
                              <div className="flex items-center text-sm text-oslo-gray">
                                <MapPin className="w-4 h-4 mr-2 text-gulf-stream" />
                                <span>{registration.event.location}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm text-oslo-gray">
                              <Clock className="w-4 h-4 mr-2 text-gulf-stream" />
                              <span className="capitalize">Status: {registration.status}</span>
                            </div>
                          </div>
                          <Button
                            text="View Details"
                            variant="outline"
                            onClick={() => navigate(`/events/${registration.event?.id}`)}
                            className="w-full"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                !loading && (
                  <Card className="mb-12">
                    <div className="p-8 text-center">
                      <Calendar className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        No Event Registrations
                      </h3>
                      <p className="text-oslo-gray mb-6">
                        You haven't registered for any events yet.
                      </p>
                      <Button
                        text="Browse Events"
                        variant="primary"
                        onClick={() => navigate('/events')}
                      />
                    </div>
                  </Card>
                )
              )}

              {/* Programs Section */}
              {programRegistrations.length > 0 ? (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-heading font-semibold text-river-bed">
                      Programs
                    </h3>
                    <Button
                      text="View All Programs"
                      variant="outline"
                      onClick={() => navigate('/programs')}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programRegistrations.map((registration) => (
                      <Card key={registration.id} className="hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                            {registration.program?.name || 'Untitled Program'}
                          </h3>
                          <p className="text-sm text-oslo-gray mb-4 line-clamp-2">
                            {registration.program?.description || 'No description available'}
                          </p>
                          <div className="space-y-2 mb-4">
                            {registration.program?.age_group && (
                              <div className="flex items-center text-sm text-oslo-gray">
                                <Users className="w-4 h-4 mr-2 text-gulf-stream" />
                                <span>Age Group: {registration.program.age_group}</span>
                              </div>
                            )}
                            {registration.program?.schedule && (
                              <div className="flex items-center text-sm text-oslo-gray">
                                <Clock className="w-4 h-4 mr-2 text-gulf-stream" />
                                <span>{registration.program.schedule}</span>
                              </div>
                            )}
                            {registration.program?.price !== null && registration.program?.price !== undefined && (
                              <div className="text-sm font-semibold text-river-bed">
                                ${parseFloat(registration.program.price).toFixed(2)}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-oslo-gray">
                              <Clock className="w-4 h-4 mr-2 text-gulf-stream" />
                              <span className="capitalize">Status: {registration.status}</span>
                            </div>
                          </div>
                          <Button
                            text="View Details"
                            variant="outline"
                            onClick={() => navigate(`/programs/${registration.program?.id}`)}
                            className="w-full"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                !loading && (
                  <Card>
                    <div className="p-8 text-center">
                      <Package className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        No Program Registrations
                      </h3>
                      <p className="text-oslo-gray mb-6">
                        You haven't registered for any programs yet.
                      </p>
                      <Button
                        text="Browse Programs"
                        variant="primary"
                        onClick={() => navigate('/programs')}
                      />
                    </div>
                  </Card>
                )
              )}

              {/* Empty State - No Registrations */}
              {registrations.length === 0 && (
                <Card>
                  <div className="p-12 text-center">
                    <Package className="w-20 h-20 text-oslo-gray mx-auto mb-6" />
                    <h3 className="text-2xl font-heading font-bold text-river-bed mb-4">
                      Get Started
                    </h3>
                    <p className="text-lg text-oslo-gray mb-8 max-w-md mx-auto">
                      You haven't registered for any events or programs yet. Start exploring our offerings!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        text="Browse Events"
                        variant="primary"
                        onClick={() => navigate('/events')}
                      />
                      <Button
                        text="Browse Programs"
                        variant="outline"
                        onClick={() => navigate('/programs')}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

