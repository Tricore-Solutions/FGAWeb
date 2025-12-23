import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
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
  X
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventsService';
import api from '../../services/api';
import colors from '../../styles/design-tokens/colors';

function EventsManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: '',
    max_participants: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: '',
    max_participants: ''
  });
  const [selectedEditImage, setSelectedEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Fetch events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Delete event
  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(eventId);
      await api.delete(`/api/events/${eventId}`);
      
      // Remove event from list
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert(err.response?.data?.error || 'Failed to delete event. Please try again.');
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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Please select an image file'
        }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedImage(file);
      setFormErrors(prev => ({
        ...prev,
        image: ''
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Get the full URL by prepending the API base URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const imageUrl = response.data.imageUrl.startsWith('http') 
        ? response.data.imageUrl 
        : `${API_URL}${response.data.imageUrl}`;
      return imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error.response?.data?.error || 'Failed to upload image');
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (formData.max_participants && isNaN(formData.max_participants)) {
      errors.max_participants = 'Must be a valid number';
    }

    if (formData.max_participants && parseInt(formData.max_participants) < 1) {
      errors.max_participants = 'Must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreateLoading(true);
      setFormErrors({});
      setUploadingImage(true);

      // Upload image if one is selected
      let imageUrl = formData.image_url.trim() || null;
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage);
        } catch (error) {
          setFormErrors({ submit: error.message });
          setUploadingImage(false);
          setCreateLoading(false);
          return;
        }
      }

      setUploadingImage(false);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        date: formData.date,
        location: formData.location.trim() || null,
        image_url: imageUrl,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      };

      const response = await api.post('/api/events', payload);

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        max_participants: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      setShowCreateModal(false);

      // Refresh events list
      const data = await fetchEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to create event:', err);
      if (err.response?.status === 400) {
        setFormErrors({ submit: err.response.data?.error || 'Invalid event data' });
      } else {
        setFormErrors({ submit: err.response?.data?.error || 'Failed to create event. Please try again.' });
      }
    } finally {
      setCreateLoading(false);
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      image_url: '',
      max_participants: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setFormErrors({});
  };

  // Helper function to convert ISO date to datetime-local format
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Get local date/time components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  };

  // Open edit modal with event data
  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title || '',
      description: event.description || '',
      date: formatDateForInput(event.date),
      location: event.location || '',
      image_url: event.image_url || '',
      max_participants: event.max_participants !== null ? String(event.max_participants) : ''
    });
    setSelectedEditImage(null);
    setEditImagePreview(event.image_url || null);
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

  // Handle edit image file selection
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setEditFormErrors(prev => ({
          ...prev,
          image: 'Please select an image file'
        }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setEditFormErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedEditImage(file);
      setEditFormErrors(prev => ({
        ...prev,
        image: ''
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate edit form
  const validateEditForm = () => {
    const errors = {};

    if (!editFormData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!editFormData.date) {
      errors.date = 'Date is required';
    }

    if (editFormData.max_participants && isNaN(editFormData.max_participants)) {
      errors.max_participants = 'Must be a valid number';
    }

    if (editFormData.max_participants && parseInt(editFormData.max_participants) < 1) {
      errors.max_participants = 'Must be at least 1';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit form submission
  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    try {
      setEditLoading(true);
      setEditFormErrors({});
      setUploadingEditImage(true);

      // Upload image if a new one is selected
      let imageUrl = editFormData.image_url.trim() || null;
      if (selectedEditImage) {
        try {
          imageUrl = await uploadImage(selectedEditImage);
        } catch (error) {
          setEditFormErrors({ submit: error.message });
          setUploadingEditImage(false);
          setEditLoading(false);
          return;
        }
      }

      setUploadingEditImage(false);

      const payload = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim() || null,
        date: editFormData.date,
        location: editFormData.location.trim() || null,
        image_url: imageUrl,
        max_participants: editFormData.max_participants ? parseInt(editFormData.max_participants) : null
      };

      await api.put(`/api/events/${editingEvent.id}`, payload);

      // Close modal and reset form
      setShowEditModal(false);
      setEditingEvent(null);
      setEditFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        max_participants: ''
      });
      setSelectedEditImage(null);
      setEditImagePreview(null);

      // Refresh events list
      const data = await fetchEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to update event:', err);
      if (err.response?.status === 400) {
        setEditFormErrors({ submit: err.response.data?.error || 'Invalid event data' });
      } else if (err.response?.status === 403) {
        setEditFormErrors({ submit: err.response.data?.error || 'You do not have permission to edit this event' });
      } else {
        setEditFormErrors({ submit: err.response?.data?.error || 'Failed to update event. Please try again.' });
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Close edit modal and reset form
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setEditFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      image_url: '',
      max_participants: ''
    });
    setSelectedEditImage(null);
    setEditImagePreview(null);
    setEditFormErrors({});
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower)
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
              <User className="w-5 h-5" />
              <span className="font-heading font-medium">Users</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <section className="w-full py-8 bg-gradient-to-r from-river-bed to-gulf-stream">
          <div className="w-full mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                  Events Management
                </h1>
                <p className="text-white/90">
                  Create, edit, and manage events
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gulf-stream rounded-lg hover:bg-geyser transition-colors duration-fast font-heading font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Event
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
                    placeholder="Search events by title, description, or location..."
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
                <LoadingSpinner message="Loading events..." />
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

            {/* Events Table */}
            {!loading && !error && (
              <>
                {filteredEvents.length > 0 ? (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-geyser">
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Title</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Date</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Location</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Max Participants</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Status</th>
                            <th className="text-right py-4 px-4 font-heading font-semibold text-river-bed">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEvents.map((event, index) => (
                            <tr 
                              key={event.id} 
                              className={`border-b border-geyser hover:bg-geyser/20 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-geyser/5'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  {event.image_url && (
                                    <img
                                      src={event.image_url}
                                      alt={event.title}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <div>
                                    <div className="font-heading font-semibold text-river-bed">
                                      {event.title || 'Untitled Event'}
                                    </div>
                                    {event.description && (
                                      <div className="text-sm text-oslo-gray line-clamp-1 max-w-md">
                                        {event.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {event.date ? formatDate(event.date) : 'Date TBD'}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {event.location || 'Location TBD'}
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {event.max_participants !== null ? event.max_participants : 'Unlimited'}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  event.registration_open
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {event.registration_open ? 'Open' : 'Closed'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(event)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-gulf-stream text-gulf-stream rounded-lg hover:bg-gulf-stream hover:text-white transition-colors duration-fast font-heading font-medium"
                                    title="Edit event"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(event.id)}
                                    disabled={deleteLoading === event.id}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-fast font-heading font-medium"
                                    title="Delete event"
                                  >
                                    {deleteLoading === event.id ? (
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
                      <Calendar className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        {searchTerm ? 'No Events Found' : 'No Events'}
                      </h3>
                      <p className="text-oslo-gray mb-6">
                        {searchTerm
                          ? 'Try adjusting your search terms.'
                          : 'Get started by creating your first event.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-gulf-stream text-white rounded-lg hover:bg-river-bed transition-colors duration-fast font-heading font-medium mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Create Event
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

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Create New Event
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6">
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-river-bed mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={formErrors.title}
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
                  placeholder="Enter event description"
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
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  id="date"
                  name="date"
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
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleInputChange}
                  error={formErrors.location}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-river-bed mb-2">
                  Event Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]"
                />
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-oslo-gray mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-48 object-cover rounded-lg border border-geyser"
                    />
                  </div>
                )}
                {uploadingImage && (
                  <p className="mt-2 text-sm text-oslo-gray">Uploading image...</p>
                )}
              </div>

              {/* Max Participants */}
              <div className="mb-6">
                <label htmlFor="max_participants" className="block text-sm font-medium text-river-bed mb-2">
                  Max Participants
                </label>
                <Input
                  type="number"
                  id="max_participants"
                  name="max_participants"
                  placeholder="Leave empty for unlimited"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  error={formErrors.max_participants}
                  min="1"
                />
                <p className="mt-1 text-sm text-oslo-gray">
                  Leave empty for unlimited participants
                </p>
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
                  text={createLoading ? 'Creating...' : 'Create Event'}
                  variant="primary"
                  type="submit"
                  disabled={createLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Edit Event
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="p-6">
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="edit_title" className="block text-sm font-medium text-river-bed mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="edit_title"
                  name="title"
                  placeholder="Enter event title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  error={editFormErrors.title}
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
                  placeholder="Enter event description"
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
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  id="edit_date"
                  name="date"
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
                  placeholder="Enter event location"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                  error={editFormErrors.location}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label htmlFor="edit_image" className="block text-sm font-medium text-river-bed mb-2">
                  Event Image
                </label>
                <input
                  type="file"
                  id="edit_image"
                  name="image"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-4 py-2 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4]"
                />
                {editFormErrors.image && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.image}</p>
                )}
                {editImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-oslo-gray mb-2">
                      {selectedEditImage ? 'New Preview:' : 'Current Image:'}
                    </p>
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-48 object-cover rounded-lg border border-geyser"
                    />
                  </div>
                )}
                {uploadingEditImage && (
                  <p className="mt-2 text-sm text-oslo-gray">Uploading image...</p>
                )}
              </div>

              {/* Max Participants */}
              <div className="mb-6">
                <label htmlFor="edit_max_participants" className="block text-sm font-medium text-river-bed mb-2">
                  Max Participants
                </label>
                <Input
                  type="number"
                  id="edit_max_participants"
                  name="max_participants"
                  placeholder="Leave empty for unlimited"
                  value={editFormData.max_participants}
                  onChange={handleEditInputChange}
                  error={editFormErrors.max_participants}
                  min="1"
                />
                <p className="mt-1 text-sm text-oslo-gray">
                  Leave empty for unlimited participants
                </p>
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
                  text={editLoading ? 'Updating...' : 'Update Event'}
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

export default EventsManager;

