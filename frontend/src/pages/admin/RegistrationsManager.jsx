import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Search,
  Users,
  LayoutDashboard,
  Calendar,
  Package,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/AuthContext';
import { getAllRegistrations } from '../../services/registrationService';
import { fetchEvents } from '../../services/eventsService';
import { fetchPrograms } from '../../services/programsService';
import colors from '../../styles/design-tokens/colors';

function RegistrationsManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  // Check if a route is active
  const isActive = (path) => {
    const current = location.pathname.split('?')[0].replace(/\/+$/,'');
    const target = path.replace(/\/+$/,'');
    return current === target;
  };

  // Fetch registrations, events, and programs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [registrationsData, eventsData, programsData] = await Promise.all([
          getAllRegistrations(),
          fetchEvents(),
          fetchPrograms()
        ]);
        
        setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setPrograms(Array.isArray(programsData) ? programsData : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter registrations based on search term, status, type, event, and program
  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      reg.user?.first_name?.toLowerCase().includes(searchLower) ||
      reg.user?.last_name?.toLowerCase().includes(searchLower) ||
      reg.user?.email?.toLowerCase().includes(searchLower) ||
      reg.event?.title?.toLowerCase().includes(searchLower) ||
      reg.program?.name?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const matchesType = typeFilter === 'all' || reg.type === typeFilter;
    const matchesEvent = eventFilter === 'all' || (reg.type === 'event' && reg.event?.id === parseInt(eventFilter));
    const matchesProgram = programFilter === 'all' || (reg.type === 'program' && reg.program?.id === parseInt(programFilter));

    return matchesSearch && matchesStatus && matchesType && matchesEvent && matchesProgram;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        className: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Pending'
      },
      confirmed: {
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Confirmed'
      },
      cancelled: {
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
        text: 'Cancelled'
      }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.className}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Export to CSV
  const handleExportToCSV = () => {
    // Prepare CSV headers
    const headers = [
      'Registration ID',
      'User Name',
      'User Email',
      'User ID',
      'Type',
      'Event/Program Name',
      'Event Date',
      'Location',
      'Age Group',
      'Schedule',
      'Price',
      'Status',
      'Registered Date'
    ];

    // Convert registrations to CSV rows
    const csvRows = filteredRegistrations.map(reg => {
      const userName = reg.user?.first_name && reg.user?.last_name
        ? `${reg.user.first_name} ${reg.user.last_name}`
        : reg.user?.first_name || reg.user?.email || 'Unknown';
      
      const userEmail = reg.user?.email || 'N/A';
      const userId = reg.user?.id || 'N/A';
      
      const type = reg.type === 'event' ? 'Event' : 'Program';
      
      let eventProgramName = 'N/A';
      let eventDate = 'N/A';
      let location = 'N/A';
      let ageGroup = 'N/A';
      let schedule = 'N/A';
      let price = 'N/A';

      if (reg.type === 'event' && reg.event) {
        eventProgramName = reg.event.title || 'Unknown Event';
        eventDate = reg.event.date ? formatDate(reg.event.date) : 'N/A';
        location = reg.event.location || 'N/A';
      } else if (reg.type === 'program' && reg.program) {
        eventProgramName = reg.program.name || 'Unknown Program';
        ageGroup = reg.program.age_group || 'N/A';
        schedule = reg.program.schedule || 'N/A';
        price = reg.program.price !== null ? formatPrice(reg.program.price) : 'Free';
      }

      const status = reg.status.charAt(0).toUpperCase() + reg.status.slice(1);
      const registeredDate = formatDate(reg.created_at);

      return [
        reg.id,
        userName,
        userEmail,
        userId,
        type,
        eventProgramName,
        eventDate,
        location,
        ageGroup,
        schedule,
        price,
        status,
        registeredDate
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => {
        // Escape commas and quotes in cell values
        const cellValue = String(cell || '');
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          return `"${cellValue.replace(/"/g, '""')}"`;
        }
        return cellValue;
      }).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `registrations_${dateStr}_${timeStr}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white">
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
                  : 'text-white/80 hover:bg-gulf-stream/20'
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
                  : 'text-white/80 hover:bg-gulf-stream/20'
              }`}
            >
              <Calendar className="w-5 h-5" />
              {sidebarOpen && <span className="font-heading font-medium">Events</span>}
            </Link>
            <Link
              to="/admin/programs"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/programs')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20'
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
                  : 'text-white/80 hover:bg-gulf-stream/20'
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
                  : 'text-white/80 hover:bg-gulf-stream/20'
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
        .admin-content button { padding: 0.75rem !important; }
      `}</style>
      <div className={`flex-1 admin-content ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-heading font-bold text-river-bed mb-2">
                  Registrations Manager
                </h1>
                <p className="text-oslo-gray">
                  View and manage all event and program registrations
                </p>
              </div>
              {filteredRegistrations.length > 0 && (
                <button
                  onClick={handleExportToCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gulf-stream rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium border-2 border-gulf-stream"
                >
                  <Download className="w-4 h-4" />
                  Export to CSV
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="mb-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by user name, email, event, or program..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4] text-river-bed bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      // Reset event/program filters when type changes
                      if (e.target.value !== 'event') setEventFilter('all');
                      if (e.target.value !== 'program') setProgramFilter('all');
                    }}
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4] text-river-bed bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="event">Events</option>
                    <option value="program">Programs</option>
                  </select>
                </div>

                {/* Event Filter */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    disabled={typeFilter === 'program'}
                    className={`w-full px-4 py-2 pl-10 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4] text-river-bed bg-white ${
                      typeFilter === 'program' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="all">All Events</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title || `Event #${event.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Program Filter */}
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    disabled={typeFilter === 'event'}
                    className={`w-full px-4 py-2 pl-10 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4] text-river-bed bg-white ${
                      typeFilter === 'event' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="all">All Programs</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>
                        {program.name || `Program #${program.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(statusFilter !== 'all' || typeFilter !== 'all' || eventFilter !== 'all' || programFilter !== 'all') && (
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-oslo-gray">Active filters:</span>
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-1 bg-gulf-stream/10 text-gulf-stream rounded text-xs font-medium">
                      Status: {statusFilter}
                    </span>
                  )}
                  {typeFilter !== 'all' && (
                    <span className="px-2 py-1 bg-gulf-stream/10 text-gulf-stream rounded text-xs font-medium">
                      Type: {typeFilter}
                    </span>
                  )}
                  {eventFilter !== 'all' && (
                    <span className="px-2 py-1 bg-gulf-stream/10 text-gulf-stream rounded text-xs font-medium">
                      Event: {events.find(e => e.id === parseInt(eventFilter))?.title || `Event #${eventFilter}`}
                    </span>
                  )}
                  {programFilter !== 'all' && (
                    <span className="px-2 py-1 bg-gulf-stream/10 text-gulf-stream rounded text-xs font-medium">
                      Program: {programs.find(p => p.id === parseInt(programFilter))?.name || `Program #${programFilter}`}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setEventFilter('all');
                      setProgramFilter('all');
                      setSearchTerm('');
                    }}
                    className="text-xs text-gulf-stream hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner message="Loading registrations..." />
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
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

            {/* Registrations Table */}
            {!loading && !error && (
              <>
                {filteredRegistrations.length > 0 ? (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-geyser">
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">User Details</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Type</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Event/Program</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Status</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Registered Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRegistrations.map((reg, index) => (
                            <tr 
                              key={reg.id} 
                              className={`border-b border-geyser hover:bg-geyser/20 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-geyser/5'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gulf-stream/10 flex items-center justify-center">
                                      <User className="w-5 h-5 text-gulf-stream" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-heading font-semibold text-river-bed">
                                      {reg.user?.first_name && reg.user?.last_name
                                        ? `${reg.user.first_name} ${reg.user.last_name}`
                                        : reg.user?.first_name || reg.user?.email || 'Unknown User'}
                                    </div>
                                    <div className="text-sm text-oslo-gray break-words">
                                      {reg.user?.email || 'No email'}
                                    </div>
                                    {reg.user?.id && (
                                      <div className="text-xs text-oslo-gray mt-1">
                                        ID: {reg.user.id}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  reg.type === 'event'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {reg.type === 'event' ? 'Event' : 'Program'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                {reg.type === 'event' ? (
                                  <div>
                                    <div className="font-heading font-semibold text-river-bed">
                                      {reg.event?.title || 'Unknown Event'}
                                    </div>
                                    {reg.event?.date && (
                                      <div className="text-sm text-oslo-gray">
                                        {formatDate(reg.event.date)}
                                      </div>
                                    )}
                                    {reg.event?.location && (
                                      <div className="text-sm text-oslo-gray">
                                        {reg.event.location}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    <div className="font-heading font-semibold text-river-bed">
                                      {reg.program?.name || 'Unknown Program'}
                                    </div>
                                    {reg.program?.age_group && (
                                      <div className="text-sm text-oslo-gray">
                                        Age: {reg.program.age_group}
                                      </div>
                                    )}
                                    {reg.program?.schedule && (
                                      <div className="text-sm text-oslo-gray">
                                        {reg.program.schedule}
                                      </div>
                                    )}
                                    {reg.program?.price !== null && (
                                      <div className="text-sm text-oslo-gray">
                                        {formatPrice(reg.program.price)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(reg.status)}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {formatDate(reg.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="p-12 text-center">
                      <FileText className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'No Registrations Found'
                          : 'No Registrations'}
                      </h3>
                      <p className="text-oslo-gray">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                          ? 'Try adjusting your filters or search terms.'
                          : 'Registrations will appear here once users start registering for events and programs.'}
                      </p>
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Summary Stats */}
            {!loading && !error && registrations.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Total Registrations</p>
                    <p className="text-2xl font-heading font-bold text-river-bed">
                      {registrations.length}
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Pending</p>
                    <p className="text-2xl font-heading font-bold text-yellow-600">
                      {registrations.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Confirmed</p>
                    <p className="text-2xl font-heading font-bold text-green-600">
                      {registrations.filter(r => r.status === 'confirmed').length}
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Cancelled</p>
                    <p className="text-2xl font-heading font-bold text-red-600">
                      {registrations.filter(r => r.status === 'cancelled').length}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegistrationsManager;

