import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  DollarSign,
  LogOut
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/AuthContext';
import { fetchPrograms } from '../../services/programsService';
import api from '../../services/api';
import colors from '../../styles/design-tokens/colors';

function ProgramsManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    age_group: '',
    schedule: '',
    price: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    age_group: '',
    schedule: '',
    price: '',
    is_active: true
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Check if a route is active
  const isActive = (path) => {
    const current = location.pathname.split('?')[0].replace(/\/+$/,'');
    const target = path.replace(/\/+$/,'');
    return current === target;
  };

  // Fetch programs
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPrograms();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
        setError('Failed to load programs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  // Delete program
  const handleDelete = async (programId) => {
    if (!window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(programId);
      await api.delete(`/api/programs/${programId}`);
      
      // Remove program from list
      setPrograms(programs.filter(program => program.id !== programId));
    } catch (err) {
      console.error('Failed to delete program:', err);
      alert(err.response?.data?.error || 'Failed to delete program. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (formData.price && isNaN(formData.price)) {
      errors.price = 'Must be a valid number';
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      errors.price = 'Price cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleCreateProgram = async (e) => {
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
        age_group: formData.age_group.trim() || null,
        schedule: formData.schedule.trim() || null,
        price: formData.price ? parseFloat(formData.price) : null,
        is_active: formData.is_active
      };

      await api.post('/api/programs', payload);

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        age_group: '',
        schedule: '',
        price: '',
        is_active: true
      });
      setShowCreateModal(false);

      // Refresh programs list
      const data = await fetchPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to create program:', err);
      if (err.response?.status === 400) {
        setFormErrors({ submit: err.response.data?.error || 'Invalid program data' });
      } else {
        setFormErrors({ submit: err.response?.data?.error || 'Failed to create program. Please try again.' });
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
      age_group: '',
      schedule: '',
      price: '',
      is_active: true
    });
    setFormErrors({});
  };

  // Open edit modal with program data
  const handleOpenEditModal = (program) => {
    setEditingProgram(program);
    setEditFormData({
      name: program.name || '',
      description: program.description || '',
      age_group: program.age_group || '',
      schedule: program.schedule || '',
      price: program.price !== null ? String(program.price) : '',
      is_active: program.is_active !== false
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (editFormData.price && isNaN(editFormData.price)) {
      errors.price = 'Must be a valid number';
    }

    if (editFormData.price && parseFloat(editFormData.price) < 0) {
      errors.price = 'Price cannot be negative';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit form submission
  const handleUpdateProgram = async (e) => {
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
        age_group: editFormData.age_group.trim() || null,
        schedule: editFormData.schedule.trim() || null,
        price: editFormData.price ? parseFloat(editFormData.price) : null,
        is_active: editFormData.is_active
      };

      await api.put(`/api/programs/${editingProgram.id}`, payload);

      // Close modal and reset form
      setShowEditModal(false);
      setEditingProgram(null);
      setEditFormData({
        name: '',
        description: '',
        age_group: '',
        schedule: '',
        price: '',
        is_active: true
      });

      // Refresh programs list
      const data = await fetchPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to update program:', err);
      if (err.response?.status === 400) {
        setEditFormErrors({ submit: err.response.data?.error || 'Invalid program data' });
      } else if (err.response?.status === 403) {
        setEditFormErrors({ submit: err.response.data?.error || 'You do not have permission to edit this program' });
      } else {
        setEditFormErrors({ submit: err.response?.data?.error || 'Failed to update program. Please try again.' });
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Close edit modal and reset form
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProgram(null);
    setEditFormData({
      name: '',
      description: '',
      age_group: '',
      schedule: '',
      price: '',
      is_active: true
    });
    setEditFormErrors({});
  };

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program => {
    const searchLower = searchTerm.toLowerCase();
    return (
      program.name?.toLowerCase().includes(searchLower) ||
      program.description?.toLowerCase().includes(searchLower) ||
      program.age_group?.toLowerCase().includes(searchLower) ||
      program.schedule?.toLowerCase().includes(searchLower)
    );
  });

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
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
                  Programs Manager
                </h1>
                <p className="text-oslo-gray">
                  Manage all programs and their details
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gulf-stream rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Program
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search programs by name, description, age group, or schedule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner message="Loading programs..." />
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

            {/* Programs Table */}
            {!loading && !error && (
              <>
                {filteredPrograms.length > 0 ? (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-geyser">
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Name</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Age Group</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Schedule</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Price</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Status</th>
                            <th className="text-right py-4 px-4 font-heading font-semibold text-river-bed">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPrograms.map((program, index) => (
                            <tr 
                              key={program.id} 
                              className={`border-b border-geyser hover:bg-geyser/20 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-geyser/5'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div>
                                  <div className="font-heading font-semibold text-river-bed">
                                    {program.name || 'Untitled Program'}
                                  </div>
                                  {program.description && (
                                    <div className="text-sm text-oslo-gray line-clamp-1 max-w-md mt-1">
                                      {program.description}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {program.age_group || 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {program.schedule || 'Schedule TBD'}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {formatPrice(program.price)}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  program.is_active !== false
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {program.is_active !== false ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(program)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-gulf-stream text-gulf-stream rounded-lg hover:bg-gulf-stream hover:text-white transition-colors duration-fast font-heading font-medium"
                                    title="Edit program"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(program.id)}
                                    disabled={deleteLoading === program.id}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-fast font-heading font-medium"
                                    title="Delete program"
                                  >
                                    {deleteLoading === program.id ? (
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
                      <Package className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        {searchTerm ? 'No Programs Found' : 'No Programs'}
                      </h3>
                      <p className="text-oslo-gray mb-6">
                        {searchTerm
                          ? 'Try adjusting your search terms.'
                          : 'Get started by creating your first program.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-gulf-stream text-white rounded-lg hover:bg-river-bed transition-colors duration-fast font-heading font-medium mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Create Program
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

      {/* Create Program Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Create New Program
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-river-bed mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter program name"
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
                  placeholder="Enter program description"
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

              {/* Age Group */}
              <div className="mb-4">
                <label htmlFor="age_group" className="block text-sm font-medium text-river-bed mb-2">
                  Age Group
                </label>
                <Input
                  type="text"
                  id="age_group"
                  name="age_group"
                  placeholder="e.g., 8-12 years, Teens, Adults"
                  value={formData.age_group}
                  onChange={handleInputChange}
                  error={formErrors.age_group}
                />
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <label htmlFor="schedule" className="block text-sm font-medium text-river-bed mb-2">
                  Schedule
                </label>
                <Input
                  type="text"
                  id="schedule"
                  name="schedule"
                  placeholder="e.g., Monday, Wednesday, Friday 4:00 PM - 6:00 PM"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  error={formErrors.schedule}
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-river-bed mb-2">
                  Price
                </label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Leave empty for free"
                  value={formData.price}
                  onChange={handleInputChange}
                  error={formErrors.price}
                  min="0"
                  step="0.01"
                />
                <p className="mt-1 text-sm text-oslo-gray">
                  Leave empty for free programs
                </p>
              </div>

              {/* Is Active */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gulf-stream border-geyser rounded focus:ring-gulf-stream"
                  />
                  <span className="text-sm font-medium text-river-bed">
                    Program is active
                  </span>
                </label>
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
                  text={createLoading ? 'Creating...' : 'Create Program'}
                  variant="primary"
                  type="submit"
                  disabled={createLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {showEditModal && editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Edit Program
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProgram} className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="edit_name" className="block text-sm font-medium text-river-bed mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="edit_name"
                  name="name"
                  placeholder="Enter program name"
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
                  placeholder="Enter program description"
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

              {/* Age Group */}
              <div className="mb-4">
                <label htmlFor="edit_age_group" className="block text-sm font-medium text-river-bed mb-2">
                  Age Group
                </label>
                <Input
                  type="text"
                  id="edit_age_group"
                  name="age_group"
                  placeholder="e.g., 8-12 years, Teens, Adults"
                  value={editFormData.age_group}
                  onChange={handleEditInputChange}
                  error={editFormErrors.age_group}
                />
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <label htmlFor="edit_schedule" className="block text-sm font-medium text-river-bed mb-2">
                  Schedule
                </label>
                <Input
                  type="text"
                  id="edit_schedule"
                  name="schedule"
                  placeholder="e.g., Monday, Wednesday, Friday 4:00 PM - 6:00 PM"
                  value={editFormData.schedule}
                  onChange={handleEditInputChange}
                  error={editFormErrors.schedule}
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label htmlFor="edit_price" className="block text-sm font-medium text-river-bed mb-2">
                  Price
                </label>
                <Input
                  type="number"
                  id="edit_price"
                  name="price"
                  placeholder="Leave empty for free"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                  error={editFormErrors.price}
                  min="0"
                  step="0.01"
                />
                <p className="mt-1 text-sm text-oslo-gray">
                  Leave empty for free programs
                </p>
              </div>

              {/* Is Active */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editFormData.is_active}
                    onChange={handleEditInputChange}
                    className="w-4 h-4 text-gulf-stream border-geyser rounded focus:ring-gulf-stream"
                  />
                  <span className="text-sm font-medium text-river-bed">
                    Program is active
                  </span>
                </label>
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
                  text={editLoading ? 'Updating...' : 'Update Program'}
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

export default ProgramsManager;

