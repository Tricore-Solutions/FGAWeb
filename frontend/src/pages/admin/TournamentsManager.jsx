import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Users,
  LayoutDashboard,
  Package,
  FileText,
  User,
  Calendar,
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
import { fetchTournaments } from '../../services/tournamentsService';
import api from '../../services/api';
import colors from '../../styles/design-tokens/colors';

function TournamentsManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    status: 'Upcoming',
    participants: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    status: 'Upcoming',
    participants: ''
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Check if a route is active
  const isActive = (path) => {
    const current = location.pathname.split('?')[0].replace(/\/+$/,'');
    const target = path.replace(/\/+$/,'');
    return current === target;
  };

  // Fetch tournaments
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTournaments();
        setTournaments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch tournaments:', err);
        setError('Failed to load tournaments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  // Delete tournament
  const handleDelete = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(tournamentId);
      await api.delete(`/tournaments/${tournamentId}`);
      
      // Remove tournament from list
      setTournaments(tournaments.filter(tournament => tournament.id !== tournamentId));
    } catch (err) {
      console.error('Failed to delete tournament:', err);
      alert(err.response?.data?.error || 'Failed to delete tournament. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (formData.participants && isNaN(formData.participants)) {
      errors.participants = 'Must be a valid number';
    }

    if (formData.participants && parseInt(formData.participants) < 0) {
      errors.participants = 'Must be 0 or greater';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleCreateTournament = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreateLoading(true);
      setFormErrors({});

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        date: formData.date.trim() || null,
        location: formData.location.trim() || null,
        status: formData.status || 'Upcoming',
        participants: formData.participants ? parseInt(formData.participants) : 0
      };

      const response = await api.post('/tournaments', payload);

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        date: '',
        location: '',
        status: 'Upcoming',
        participants: ''
      });
      setShowCreateModal(false);

      // Refresh tournaments list
      const data = await fetchTournaments();
      setTournaments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to create tournament:', err);
      if (err.response?.status === 400) {
        setFormErrors({ submit: err.response.data?.error || 'Invalid tournament data' });
      } else {
        setFormErrors({ submit: err.response?.data?.error || 'Failed to create tournament. Please try again.' });
      }
    } finally {
      setCreateLoading(false);
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      name: '',
      description: '',
      date: '',
      location: '',
      status: 'Upcoming',
      participants: ''
    });
    setFormErrors({});
  };

  // Open edit modal with tournament data
  const handleOpenEditModal = (tournament) => {
    setEditingTournament(tournament);
    setEditFormData({
      name: tournament.name || '',
      description: tournament.description || '',
      date: tournament.date || '',
      location: tournament.location || '',
      status: tournament.status || 'Upcoming',
      participants: tournament.participants !== null ? String(tournament.participants) : '0'
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (editFormErrors[name]) {
      setEditFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  // Validate edit form
  const validateEditForm = () => {
    const errors = {};

    if (!editFormData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (editFormData.participants && isNaN(editFormData.participants)) {
      errors.participants = 'Must be a valid number';
    }

    if (editFormData.participants && parseInt(editFormData.participants) < 0) {
      errors.participants = 'Must be 0 or greater';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit form submission
  const handleUpdateTournament = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    try {
      setEditLoading(true);
      setEditFormErrors({});

      const payload = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim() || null,
        date: editFormData.date.trim() || null,
        location: editFormData.location.trim() || null,
        status: editFormData.status || 'Upcoming',
        participants: editFormData.participants ? parseInt(editFormData.participants) : 0
      };

      const response = await api.put(`/tournaments/${editingTournament.id}`, payload);
      
      // Check if update was successful
      if (response.data && response.data.tournament) {
        // Update the tournament in the list immediately for better UX
        setTournaments(prevTournaments => 
          prevTournaments.map(t => 
            t.id === editingTournament.id ? response.data.tournament : t
          )
        );
      } else {
        // Fallback: Refresh tournaments list
        const data = await fetchTournaments();
        setTournaments(Array.isArray(data) ? data : []);
      }

      // Close modal and reset form
      setShowEditModal(false);
      setEditingTournament(null);
      setEditFormData({
        name: '',
        description: '',
        date: '',
        location: '',
        status: 'Upcoming',
        participants: ''
      });
    } catch (err) {
      console.error('Failed to update tournament:', err);
      if (err.response?.status === 400) {
        setEditFormErrors({ submit: err.response.data?.error || 'Invalid tournament data' });
      } else if (err.response?.status === 403) {
        setEditFormErrors({ submit: err.response.data?.error || 'You do not have permission to edit this tournament' });
      } else {
        setEditFormErrors({ submit: err.response?.data?.error || 'Failed to update tournament. Please try again.' });
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Close edit modal and reset form
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTournament(null);
    setEditFormData({
      name: '',
      description: '',
      date: '',
      location: '',
      status: 'Upcoming',
      participants: ''
    });
    setEditFormErrors({});
  };

  // Filter tournaments based on search term
  const filteredTournaments = tournaments.filter(tournament => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tournament.name?.toLowerCase().includes(searchLower) ||
      tournament.description?.toLowerCase().includes(searchLower) ||
      tournament.location?.toLowerCase().includes(searchLower) ||
      tournament.status?.toLowerCase().includes(searchLower)
    );
  });

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
              <User className="w-5 h-5" />
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
        {/* Header */}
        <section className="w-full py-8 bg-gradient-to-r from-river-bed to-gulf-stream">
          <div className="w-full mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                  Tournaments Management
                </h1>
                <p className="text-white/90">
                  Create, edit, and manage tournaments
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gulf-stream rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Tournament
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="w-full py-8">
          <div className="w-full mx-auto px-4 md:px-8">
            {/* Search Bar */}
            <Card className="mb-6">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tournaments by name, description, location, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-geyser rounded-lg focus:outline-none focus:ring-2 focus:ring-gulf-stream focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner message="Loading tournaments..." />
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

            {/* Tournaments Table */}
            {!loading && !error && (
              <>
                {filteredTournaments.length > 0 ? (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-geyser">
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Name</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Date</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Location</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Participants</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Status</th>
                            <th className="text-right py-4 px-4 font-heading font-semibold text-river-bed">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTournaments.map((tournament, index) => (
                            <tr 
                              key={tournament.id} 
                              className={`border-b border-geyser hover:bg-geyser/20 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-geyser/5'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div>
                                  <div className="font-heading font-semibold text-river-bed">
                                    {tournament.name || 'Untitled Tournament'}
                                  </div>
                                  {tournament.description && (
                                    <div className="text-sm text-oslo-gray line-clamp-1 max-w-md">
                                      {tournament.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {tournament.date || 'Date TBD'}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {tournament.location || 'Location TBD'}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {tournament.participants || 0} Teams
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  tournament.status === 'Registration Open' || tournament.status === 'Upcoming'
                                    ? 'bg-green-100 text-green-800'
                                    : tournament.status === 'Completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {tournament.status || 'Upcoming'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(tournament)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-gulf-stream text-gulf-stream rounded-lg hover:bg-gulf-stream hover:text-white transition-colors duration-fast font-heading font-medium"
                                    title="Edit tournament"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(tournament.id)}
                                    disabled={deleteLoading === tournament.id}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-fast font-heading font-medium"
                                    title="Delete tournament"
                                  >
                                    {deleteLoading === tournament.id ? (
                                      <LoadingSpinner />
                                    ) : (
                                      <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                      </>
                                    )}
                                  </button>
                                </div>
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
                      <Trophy className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        {searchTerm ? 'No Tournaments Found' : 'No Tournaments'}
                      </h3>
                      <p className="text-oslo-gray mb-6">
                        {searchTerm
                          ? 'Try adjusting your search terms.'
                          : 'Get started by creating your first tournament.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-gulf-stream text-white rounded-lg hover:bg-river-bed transition-colors duration-fast font-heading font-medium mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Create Tournament
                        </button>
                      )}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Create New Tournament
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-river-bed mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter tournament name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-river-bed mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter tournament description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                    formErrors.description
                      ? 'border-red-500'
                      : 'border-geyser'
                  } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-river-bed mb-2">
                  Date
                </label>
                <Input
                  type="text"
                  id="date"
                  name="date"
                  placeholder="e.g., September 10-12, 2024"
                  value={formData.date}
                  onChange={handleInputChange}
                  error={formErrors.date}
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-river-bed mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter tournament location"
                  value={formData.location}
                  onChange={handleInputChange}
                  error={formErrors.location}
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-river-bed mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                    formErrors.status
                      ? 'border-red-500'
                      : 'border-geyser'
                  } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]`}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Registration Open">Registration Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {formErrors.status && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.status}</p>
                )}
              </div>

              {/* Participants */}
              <div className="mb-4">
                <label htmlFor="participants" className="block text-sm font-medium text-river-bed mb-2">
                  Number of Teams
                </label>
                <Input
                  type="number"
                  id="participants"
                  name="participants"
                  placeholder="Enter number of teams"
                  value={formData.participants}
                  onChange={handleInputChange}
                  error={formErrors.participants}
                  min="0"
                />
              </div>

              {/* Submit Error */}
              {formErrors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formErrors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-geyser text-river-bed rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <Button
                  text={createLoading ? 'Creating...' : 'Create Tournament'}
                  variant="primary"
                  type="submit"
                  disabled={createLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tournament Modal */}
      {showEditModal && editingTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Edit Tournament
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateTournament} className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="edit_name" className="block text-sm font-medium text-river-bed mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="edit_name"
                  name="name"
                  placeholder="Enter tournament name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  error={editFormErrors.name}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="edit_description" className="block text-sm font-medium text-river-bed mb-2">
                  Description
                </label>
                <textarea
                  id="edit_description"
                  name="description"
                  placeholder="Enter tournament description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                    editFormErrors.description
                      ? 'border-red-500'
                      : 'border-geyser'
                  } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]`}
                />
                {editFormErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.description}</p>
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label htmlFor="edit_date" className="block text-sm font-medium text-river-bed mb-2">
                  Date
                </label>
                <Input
                  type="text"
                  id="edit_date"
                  name="date"
                  placeholder="e.g., September 10-12, 2024"
                  value={editFormData.date}
                  onChange={handleEditInputChange}
                  error={editFormErrors.date}
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label htmlFor="edit_location" className="block text-sm font-medium text-river-bed mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  id="edit_location"
                  name="location"
                  placeholder="Enter tournament location"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                  error={editFormErrors.location}
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="edit_status" className="block text-sm font-medium text-river-bed mb-2">
                  Status
                </label>
                <select
                  id="edit_status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                    editFormErrors.status
                      ? 'border-red-500'
                      : 'border-geyser'
                  } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]`}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Registration Open">Registration Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {editFormErrors.status && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.status}</p>
                )}
              </div>

              {/* Participants */}
              <div className="mb-4">
                <label htmlFor="edit_participants" className="block text-sm font-medium text-river-bed mb-2">
                  Number of Teams
                </label>
                <Input
                  type="number"
                  id="edit_participants"
                  name="participants"
                  placeholder="Enter number of teams"
                  value={editFormData.participants}
                  onChange={handleEditInputChange}
                  error={editFormErrors.participants}
                  min="0"
                />
              </div>

              {/* Submit Error */}
              {editFormErrors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{editFormErrors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-6 py-2 border border-geyser text-river-bed rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <Button
                  text={editLoading ? 'Updating...' : 'Update Tournament'}
                  variant="primary"
                  type="submit"
                  disabled={editLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentsManager;

