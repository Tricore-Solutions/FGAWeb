import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Trophy,
  Package, 
  Users, 
  FileText, 
  Settings,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Activity,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { LogOut } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventsService';
import { fetchPrograms } from '../../services/programsService';
import { getMyRegistrations } from '../../services/registrationService';
import api from '../../services/api';
import colors from '../../styles/design-tokens/colors';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if a route is active
  const isActive = (path) => {
    // Exact-match active check (avoid false positives on other admin pages)
    const current = location.pathname.split('?')[0].replace(/\/+$/,'');
    const target = path.replace(/\/+$/,'');
    return current === target;
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

  // Create Event Modal State
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_participants: ''
  });
  const [selectedEventImage, setSelectedEventImage] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState(null);
  const [uploadingEventImage, setUploadingEventImage] = useState(false);
  const [eventFormErrors, setEventFormErrors] = useState({});
  const [createEventLoading, setCreateEventLoading] = useState(false);

  // Create Program Modal State
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false);
  const [programFormData, setProgramFormData] = useState({
    name: '',
    description: '',
    age_group: '',
    schedule: '',
    price: '',
    is_active: true
  });
  const [programFormErrors, setProgramFormErrors] = useState({});
  const [createProgramLoading, setCreateProgramLoading] = useState(false);

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

  // Event Form Handlers
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (eventFormErrors[name]) {
      setEventFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle event image file selection
  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setEventFormErrors(prev => ({
          ...prev,
          image: 'Please select an image file'
        }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setEventFormErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedEventImage(file);
      setEventFormErrors(prev => ({
        ...prev,
        image: ''
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server
  const uploadEventImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Note: baseURL already includes '/api', so we use '/upload/image' not '/api/upload/image'
      const response = await api.post('/upload/image', formData);
      // Get the base URL without /api since static files are served at root level
      let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Remove /api from the end if it exists (static files are served at /uploads, not /api/uploads)
      baseUrl = baseUrl.replace(/\/api\/?$/, '');
      const imageUrl = response.data.imageUrl.startsWith('http') 
        ? response.data.imageUrl 
        : `${baseUrl}${response.data.imageUrl}`;
      return imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error.response?.data?.error || 'Failed to upload image');
    }
  };

  const validateEventForm = () => {
    const errors = {};
    if (!eventFormData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!eventFormData.date) {
      errors.date = 'Date is required';
    }
    if (eventFormData.max_participants && isNaN(eventFormData.max_participants)) {
      errors.max_participants = 'Must be a valid number';
    }
    if (eventFormData.max_participants && parseInt(eventFormData.max_participants) < 1) {
      errors.max_participants = 'Must be at least 1';
    }
    setEventFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!validateEventForm()) return;

    try {
      setCreateEventLoading(true);
      setEventFormErrors({});
      setUploadingEventImage(true);

      // Upload image if one is selected
      let imageUrl = null;
      if (selectedEventImage) {
        try {
          imageUrl = await uploadEventImage(selectedEventImage);
        } catch (error) {
          setEventFormErrors({ submit: error.message });
          setUploadingEventImage(false);
          setCreateEventLoading(false);
          return;
        }
      }

      setUploadingEventImage(false);

      const payload = {
        title: eventFormData.title.trim(),
        description: eventFormData.description.trim() || null,
        date: eventFormData.date,
        location: eventFormData.location.trim() || null,
        image_url: imageUrl,
        max_participants: eventFormData.max_participants ? parseInt(eventFormData.max_participants) : null
      };
      await api.post('/events', payload);
      setEventFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        max_participants: ''
      });
      setSelectedEventImage(null);
      setEventImagePreview(null);
      setShowCreateEventModal(false);
      // Refresh dashboard data
      const eventsData = await fetchEvents();
      const events = Array.isArray(eventsData) ? eventsData : [];
      setRecentEvents(events.slice(0, 5));
      setStats(prev => ({ ...prev, totalEvents: events.length }));
    } catch (err) {
      console.error('Failed to create event:', err);
      setEventFormErrors({ submit: err.response?.data?.error || 'Failed to create event. Please try again.' });
    } finally {
      setCreateEventLoading(false);
    }
  };

  // Program Form Handlers
  const handleProgramInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProgramFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (programFormErrors[name]) {
      setProgramFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProgramForm = () => {
    const errors = {};
    if (!programFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (programFormData.price && isNaN(programFormData.price)) {
      errors.price = 'Must be a valid number';
    }
    if (programFormData.price && parseFloat(programFormData.price) < 0) {
      errors.price = 'Price cannot be negative';
    }
    setProgramFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!validateProgramForm()) return;

    try {
      setCreateProgramLoading(true);
      setProgramFormErrors({});
      const payload = {
        name: programFormData.name.trim(),
        description: programFormData.description.trim() || null,
        age_group: programFormData.age_group.trim() || null,
        schedule: programFormData.schedule.trim() || null,
        price: programFormData.price ? parseFloat(programFormData.price) : null,
        is_active: programFormData.is_active
      };
      await api.post('/api/programs', payload);
      setProgramFormData({
        name: '',
        description: '',
        age_group: '',
        schedule: '',
        price: '',
        is_active: true
      });
      setShowCreateProgramModal(false);
      // Refresh dashboard data
      const programsData = await fetchPrograms();
      const programs = Array.isArray(programsData) ? programsData : [];
      setRecentPrograms(programs.slice(0, 5));
      setStats(prev => ({ ...prev, totalPrograms: programs.length }));
    } catch (err) {
      console.error('Failed to create program:', err);
      setProgramFormErrors({ submit: err.response?.data?.error || 'Failed to create program. Please try again.' });
    } finally {
      setCreateProgramLoading(false);
    }
  };

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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-river-bed text-white min-h-screen fixed left-0 top-0 pt-20`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-28 -right-5 w-8 h-8 rounded-full bg-gulf-stream flex items-center justify-center shadow"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
        </button>
        <div className="p-4 pt-12">
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/dashboard')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Dashboard</span>}
            </Link>
            <Link
              to="/admin/events"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/events')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Events</span>}
            </Link>
            <Link
              to="/admin/tournaments"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/tournaments')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Trophy className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Tournaments</span>}
            </Link>
            <Link
              to="/admin/matches"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/matches')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Matches</span>}
            </Link>
            <Link
              to="/admin/programs"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/tournaments')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Trophy className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Tournaments</span>}
            </Link>
            <Link
              to="/admin/programs"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/programs')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Programs</span>}
            </Link>
            <Link
              to="/admin/registrations"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/registrations')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Registrations</span>}
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/users')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Users</span>}
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-6 left-0 w-full p-4">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-fast text-white/80 hover:bg-gulf-stream/20 hover:text-white ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-heading font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <style>{`
        /* Admin pages: force smaller button padding inside main content only */
        .admin-content button { padding: 0.75rem !important; }
        .admin-content .ripple { /* ensure ripple sizing still OK */ }
      `}</style>
      <div className={`flex-1 admin-content ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
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
                onClick={() => setShowCreateEventModal(true)}
                className="flex items-center justify-center gap-2 !px-[0.75rem] !py-[0.75rem] md:!px-[0.75rem] md:!py-[0.75rem]"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                text="Create Program"
                variant="primary"
                onClick={() => setShowCreateProgramModal(true)}
                className="flex items-center justify-center gap-2 !px-[0.75rem] !py-[0.75rem] md:!px-[0.75rem] md:!py-[0.75rem]"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                text="Manage Events"
                variant="outline"
                onClick={() => navigate('/admin/events')}
                className="flex items-center justify-center gap-2 !px-[0.75rem] !py-[0.75rem] md:!px-[0.75rem] md:!py-[0.75rem]"
              >
                <Calendar className="w-4 h-4" />
              </Button>
              <Button
                text="Manage Programs"
                variant="outline"
                onClick={() => navigate('/admin/programs')}
                className="flex items-center justify-center gap-2 !px-[0.75rem] !py-[0.75rem] md:!px-[0.75rem] md:!py-[0.75rem]"
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
                        onClick={() => setShowCreateEventModal(true)}
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
                        onClick={() => setShowCreateProgramModal(true)}
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

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Create New Event
              </h2>
              <button
                onClick={() => {
                  setShowCreateEventModal(false);
                  setEventFormData({
                    title: '',
                    description: '',
                    date: '',
                    location: '',
                    max_participants: ''
                  });
                  setSelectedEventImage(null);
                  setEventImagePreview(null);
                  setEventFormErrors({});
                }}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6">
              <div className="mb-4">
                <label htmlFor="event_title" className="block text-sm font-medium text-river-bed mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="event_title"
                  name="title"
                  placeholder="Enter event title"
                  value={eventFormData.title}
                  onChange={handleEventInputChange}
                  error={eventFormErrors.title}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="event_description" className="block text-sm font-medium text-river-bed mb-2">
                  Description
                </label>
                <textarea
                  id="event_description"
                  name="description"
                  placeholder="Enter event description"
                  value={eventFormData.description}
                  onChange={handleEventInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                    eventFormErrors.description ? 'border-red-500' : 'border-geyser'
                  } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]`}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="event_date" className="block text-sm font-medium text-river-bed mb-2">
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  id="event_date"
                  name="date"
                  value={eventFormData.date}
                  onChange={handleEventInputChange}
                  error={eventFormErrors.date}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="event_location" className="block text-sm font-medium text-river-bed mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  id="event_location"
                  name="location"
                  placeholder="Enter event location"
                  value={eventFormData.location}
                  onChange={handleEventInputChange}
                  error={eventFormErrors.location}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label htmlFor="event_image" className="block text-sm font-medium text-river-bed mb-2">
                  Event Image
                </label>
                <input
                  type="file"
                  id="event_image"
                  name="image"
                  accept="image/*"
                  onChange={handleEventImageChange}
                  className="w-full px-4 py-2 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]"
                />
                {eventFormErrors.image && (
                  <p className="mt-1 text-sm text-red-500">{eventFormErrors.image}</p>
                )}
                {eventImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-oslo-gray mb-2">Preview:</p>
                    <img
                      src={eventImagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-48 object-cover rounded-lg border border-geyser"
                    />
                  </div>
                )}
                {uploadingEventImage && (
                  <p className="mt-2 text-sm text-oslo-gray">Uploading image...</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="event_max_participants" className="block text-sm font-medium text-river-bed mb-2">
                  Max Participants
                </label>
                <Input
                  type="number"
                  id="event_max_participants"
                  name="max_participants"
                  placeholder="Leave empty for unlimited"
                  value={eventFormData.max_participants}
                  onChange={handleEventInputChange}
                  error={eventFormErrors.max_participants}
                  min="1"
                />
                <p className="mt-1 text-sm text-oslo-gray">
                  Leave empty for unlimited participants
                </p>
              </div>

              {eventFormErrors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{eventFormErrors.submit}</p>
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                onClick={() => {
                  setShowCreateEventModal(false);
                  setEventFormData({
                    title: '',
                    description: '',
                    date: '',
                    location: '',
                    max_participants: ''
                  });
                  setSelectedEventImage(null);
                  setEventImagePreview(null);
                  setEventFormErrors({});
                }}
                  className="px-6 py-2 border border-geyser text-river-bed rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
                  disabled={createEventLoading}
                >
                  Cancel
                </button>
                <Button
                  text={createEventLoading ? 'Creating...' : 'Create Event'}
                  variant="primary"
                  type="submit"
                  disabled={createEventLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Program Modal */}
      {showCreateProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Create New Program
              </h2>
              <button
                onClick={() => {
                  setShowCreateProgramModal(false);
                  setProgramFormData({
                    name: '',
                    description: '',
                    age_group: '',
                    schedule: '',
                    price: '',
                    is_active: true
                  });
                  setProgramFormErrors({});
                }}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="p-6">
              <div className="mb-4">
                <label htmlFor="program_name" className="block text-sm font-medium text-river-bed mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="program_name"
                  name="name"
                  placeholder="Enter program name"
                  value={programFormData.name}
                  onChange={handleProgramInputChange}
                  error={programFormErrors.name}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="program_description" className="block text-sm font-medium text-river-bed mb-2">
                  Description
                </label>
                <textarea
                  id="program_description"
                  name="description"
                  placeholder="Enter program description"
                  value={programFormData.description}
                  onChange={handleProgramInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                    programFormErrors.description ? 'border-red-500' : 'border-geyser'
                  } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]`}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="program_age_group" className="block text-sm font-medium text-river-bed mb-2">
                  Age Group
                </label>
                <Input
                  type="text"
                  id="program_age_group"
                  name="age_group"
                  placeholder="e.g., 8-12 years, Teens, Adults"
                  value={programFormData.age_group}
                  onChange={handleProgramInputChange}
                  error={programFormErrors.age_group}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="program_schedule" className="block text-sm font-medium text-river-bed mb-2">
                  Schedule
                </label>
                <Input
                  type="text"
                  id="program_schedule"
                  name="schedule"
                  placeholder="e.g., Monday, Wednesday, Friday 4:00 PM - 6:00 PM"
                  value={programFormData.schedule}
                  onChange={handleProgramInputChange}
                  error={programFormErrors.schedule}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="program_price" className="block text-sm font-medium text-river-bed mb-2">
                  Price
                </label>
                <Input
                  type="number"
                  id="program_price"
                  name="price"
                  placeholder="Leave empty for free"
                  value={programFormData.price}
                  onChange={handleProgramInputChange}
                  error={programFormErrors.price}
                  min="0"
                  step="0.01"
                />
                <p className="mt-1 text-sm text-oslo-gray">
                  Leave empty for free programs
                </p>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={programFormData.is_active}
                    onChange={handleProgramInputChange}
                    className="w-4 h-4 text-gulf-stream border-geyser rounded focus:ring-gulf-stream"
                  />
                  <span className="text-sm font-medium text-river-bed">
                    Program is active
                  </span>
                </label>
              </div>

              {programFormErrors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{programFormErrors.submit}</p>
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateProgramModal(false);
                    setProgramFormData({
                      name: '',
                      description: '',
                      age_group: '',
                      schedule: '',
                      price: '',
                      is_active: true
                    });
                    setProgramFormErrors({});
                  }}
                  className="px-6 py-2 border border-geyser text-river-bed rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
                  disabled={createProgramLoading}
                >
                  Cancel
                </button>
                <Button
                  text={createProgramLoading ? 'Creating...' : 'Create Program'}
                  variant="primary"
                  type="submit"
                  disabled={createProgramLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

