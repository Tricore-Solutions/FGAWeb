import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Package, 
  Users, 
  FileText, 
  Settings,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Activity,
  LayoutDashboard
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventsService';
import { fetchPrograms } from '../../services/programsService';
import { getMyRegistrations } from '../../services/registrationService';
import colors from '../../styles/design-tokens/colors';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalPrograms: 0,
    totalRegistrations: 0,
    totalUsers: 0
  });

  // Recent data
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentPrograms, setRecentPrograms] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch events
        const eventsData = await fetchEvents();
        const events = Array.isArray(eventsData) ? eventsData : [];
        setRecentEvents(events.slice(0, 5)); // Get 5 most recent
        setStats(prev => ({ ...prev, totalEvents: events.length }));

        // Fetch programs
        const programsData = await fetchPrograms();
        const programs = Array.isArray(programsData) ? programsData : [];
        setRecentPrograms(programs.slice(0, 5)); // Get 5 most recent
        setStats(prev => ({ ...prev, totalPrograms: programs.length }));

        // Fetch registrations (to get count)
        try {
          const registrationsData = await getMyRegistrations();
          const registrations = Array.isArray(registrationsData) ? registrationsData : [];
          setRecentRegistrations(registrations.slice(0, 5)); // Get 5 most recent
          setStats(prev => ({ ...prev, totalRegistrations: registrations.length }));
        } catch (err) {
          console.error('Error fetching registrations:', err);
          // Don't fail the whole dashboard if registrations fail
        }

        // TODO: Fetch total users count when API endpoint is available
        // For now, set to 0
        setStats(prev => ({ ...prev, totalUsers: 0 }));

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if user is admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center p-8">
            <h2 className="text-2xl font-heading font-bold text-river-bed mb-4">
              Access Denied
            </h2>
            <p className="text-oslo-gray mb-6">
              You must be an administrator to access this page.
            </p>
            <Button
              text="Go to Dashboard"
              variant="primary"
              onClick={() => navigate('/dashboard')}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-river-bed text-white min-h-screen fixed left-0 top-0 pt-20">
        <div className="p-4 pt-12">
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-fast ${
                isActive('/admin/dashboard')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-heading font-medium">Dashboard</span>
            </Link>
            <Link
              to="/admin/events"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-fast ${
                isActive('/admin/events')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-heading font-medium">Events</span>
            </Link>
            <Link
              to="/admin/programs"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-fast ${
                isActive('/admin/programs')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-heading font-medium">Programs</span>
            </Link>
            <Link
              to="/admin/registrations"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-fast ${
                isActive('/admin/registrations')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-heading font-medium">Registrations</span>
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-fast ${
                isActive('/admin/users')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-heading font-medium">Users</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-river-bed to-gulf-stream">
        <div className="w-full mx-auto px-4 md:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Manage events, programs, and users
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="w-full py-12 md:py-16">
        <div className="w-full mx-auto px-4 md:px-8">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-river-bed mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                text="Create Event"
                variant="primary"
                onClick={() => navigate('/admin/events/create')}
                className="flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                text="Create Program"
                variant="primary"
                onClick={() => navigate('/admin/programs/create')}
                className="flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                text="Manage Events"
                variant="outline"
                onClick={() => navigate('/admin/events')}
                className="flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                text="Manage Programs"
                variant="outline"
                onClick={() => navigate('/admin/programs')}
                className="flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oslo-gray mb-1">Total Events</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {stats.totalEvents}
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
                    <p className="text-sm text-oslo-gray mb-1">Total Programs</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {stats.totalPrograms}
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
                    <p className="text-sm text-oslo-gray mb-1">Total Registrations</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {stats.totalRegistrations}
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-gulf-stream" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-oslo-gray mb-1">Total Users</p>
                    <p className="text-3xl font-heading font-bold text-river-bed">
                      {stats.totalUsers || 'N/A'}
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
              <LoadingSpinner message="Loading admin dashboard..." />
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

          {/* Dashboard Content */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-heading font-bold text-river-bed">
                      Recent Events
                    </h3>
                    <Button
                      text="View All"
                      variant="outline"
                      onClick={() => navigate('/admin/events')}
                      className="text-sm"
                    />
                  </div>
                  {recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border border-geyser rounded-lg hover:bg-geyser/20 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold text-river-bed mb-1">
                              {event.title || 'Untitled Event'}
                            </h4>
                            <p className="text-sm text-oslo-gray">
                              {event.date ? formatDate(event.date) : 'Date TBD'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              text="Edit"
                              variant="outline"
                              onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                              className="text-xs px-3 py-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-oslo-gray mx-auto mb-4" />
                      <p className="text-oslo-gray">No events found</p>
                      <Button
                        text="Create Event"
                        variant="primary"
                        onClick={() => navigate('/admin/events/create')}
                        className="mt-4"
                      />
                    </div>
                  )}
                </div>
              </Card>

              {/* Recent Programs */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-heading font-bold text-river-bed">
                      Recent Programs
                    </h3>
                    <Button
                      text="View All"
                      variant="outline"
                      onClick={() => navigate('/admin/programs')}
                      className="text-sm"
                    />
                  </div>
                  {recentPrograms.length > 0 ? (
                    <div className="space-y-4">
                      {recentPrograms.map((program) => (
                        <div
                          key={program.id}
                          className="flex items-center justify-between p-4 border border-geyser rounded-lg hover:bg-geyser/20 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-heading font-semibold text-river-bed mb-1">
                              {program.name || 'Untitled Program'}
                            </h4>
                            <p className="text-sm text-oslo-gray">
                              {program.age_group || 'Age group not specified'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              text="Edit"
                              variant="outline"
                              onClick={() => navigate(`/admin/programs/${program.id}/edit`)}
                              className="text-xs px-3 py-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-oslo-gray mx-auto mb-4" />
                      <p className="text-oslo-gray">No programs found</p>
                      <Button
                        text="Create Program"
                        variant="primary"
                        onClick={() => navigate('/admin/programs/create')}
                        className="mt-4"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Admin Info */}
          <Card className="mt-8">
            <div className="p-6">
              <h3 className="text-xl font-heading font-bold text-river-bed mb-4">
                Admin Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-oslo-gray mb-1">Logged in as</p>
                  <p className="text-lg font-heading font-semibold text-river-bed">
                    {user?.first_name} {user?.last_name} ({user?.email})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-oslo-gray mb-1">Role</p>
                  <p className="text-lg font-heading font-semibold text-gulf-stream">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      </div>
    </div>
  );
}

export default AdminDashboard;

