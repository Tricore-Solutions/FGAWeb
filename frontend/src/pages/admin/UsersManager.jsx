import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Trophy,
  Search,
  LayoutDashboard,
  Calendar,
  Package,
  FileText,
  User,
  Shield,
  ShieldCheck,
  Edit,
  Trash2,
  Download,
  Filter,
  Mail,
  X
} from 'lucide-react';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/AuthContext';
import { fetchUsers, deleteUser, updateUser } from '../../services/usersService';
import colors from '../../styles/design-tokens/colors';

function UsersManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, isAdmin, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user'
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Check if a route is active
  const isActive = (path) => {
    const current = location.pathname.split('?')[0].replace(/\/+$/,'');
    const target = path.replace(/\/+$/,'');
    return current === target;
  };

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    if (!searchTerm && roleFilter === 'all') {
      return true; // Show all if no filters
    }

    const searchLower = searchTerm.toLowerCase().trim();
    let matchesSearch = true;

    if (searchLower) {
      // Search in multiple fields
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().trim();
      const userId = String(user.id || '');
      
      matchesSearch = 
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower) ||
        userId.includes(searchLower) ||
        // Search by role name
        (searchLower === 'admin' && user.role === 'admin') ||
        (searchLower === 'user' && user.role === 'user');
    }

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone and will also delete all their registrations.')) {
      return;
    }

    try {
      setDeleteLoading(userId);
      await deleteUser(userId);
      
      // Remove user from list
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.error || 'Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Open edit modal with user data
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      role: user.role || 'user'
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

    if (!editFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (editFormData.role && !['user', 'admin'].includes(editFormData.role)) {
      errors.role = 'Invalid role';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit form submission
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    try {
      setEditLoading(true);
      setEditFormErrors({});

      const payload = {
        first_name: editFormData.first_name.trim() || null,
        last_name: editFormData.last_name.trim() || null,
        email: editFormData.email.trim(),
        role: editFormData.role
      };

      await updateUser(editingUser.id, payload);

      // Close modal and reset form
      setShowEditModal(false);
      setEditingUser(null);
      setEditFormData({
        first_name: '',
        last_name: '',
        email: '',
        role: 'user'
      });

      // Refresh users list
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to update user:', err);
      if (err.response?.status === 400) {
        setEditFormErrors({ submit: err.response.data?.error || 'Invalid user data' });
      } else {
        setEditFormErrors({ submit: err.response?.data?.error || 'Failed to update user. Please try again.' });
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Close edit modal and reset form
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      first_name: '',
      last_name: '',
      email: '',
      role: 'user'
    });
    setEditFormErrors({});
  };

  // Export to CSV
  const handleExportToCSV = () => {
    // Prepare CSV headers
    const headers = [
      'User ID',
      'First Name',
      'Last Name',
      'Email',
      'Role',
      'Created Date',
      'Last Updated'
    ];

    // Convert users to CSV rows
    const csvRows = filteredUsers.map(user => {
      return [
        user.id,
        user.first_name || 'N/A',
        user.last_name || 'N/A',
        user.email || 'N/A',
        user.role || 'user',
        formatDate(user.created_at),
        formatDate(user.updated_at)
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
    const filename = `users_${dateStr}_${timeStr}.csv`;
    
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
              to="/admin/tournaments"
              className={`flex items-center gap-3 ${sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'} rounded-lg transition-colors duration-fast ${
                isActive('/admin/tournaments')
                  ? 'bg-gulf-stream text-white'
                  : 'text-white/80 hover:bg-gulf-stream/20'
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
                  : 'text-white/80 hover:bg-gulf-stream/20'
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
                  Users Manager
                </h1>
                <p className="text-oslo-gray">
                  View and manage all registered users
                </p>
              </div>
              {filteredUsers.length > 0 && (
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
                    placeholder="Search by name, email, user ID, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-oslo-gray hover:text-river-bed transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Role Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray w-5 h-5" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-geyser focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4] text-river-bed bg-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {roleFilter !== 'all' && (
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-oslo-gray">Active filters:</span>
                  {roleFilter !== 'all' && (
                    <span className="px-2 py-1 bg-gulf-stream/10 text-gulf-stream rounded text-xs font-medium">
                      Role: {roleFilter}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setRoleFilter('all');
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
                <LoadingSpinner message="Loading users..." />
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

            {/* Users Table */}
            {!loading && !error && (
              <>
                {filteredUsers.length > 0 ? (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-geyser">
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">User</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Email</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Role</th>
                            <th className="text-left py-4 px-4 font-heading font-semibold text-river-bed">Created</th>
                            <th className="text-right py-4 px-4 font-heading font-semibold text-river-bed">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user, index) => (
                            <tr 
                              key={user.id} 
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
                                      {user.first_name && user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : user.first_name || user.email || 'Unknown User'}
                                    </div>
                                    {user.id && (
                                      <div className="text-xs text-oslo-gray mt-1">
                                        ID: {user.id}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-oslo-gray" />
                                  <span className="text-oslo-gray break-words">
                                    {user.email || 'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                                  user.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role === 'admin' ? (
                                    <>
                                      <ShieldCheck className="w-3 h-3" />
                                      Admin
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="w-3 h-3" />
                                      User
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-oslo-gray">
                                {formatDate(user.created_at)}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(user)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm border-2 border-gulf-stream text-gulf-stream rounded-lg hover:bg-gulf-stream hover:text-white transition-colors duration-fast font-heading font-medium"
                                    title="Edit user"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    disabled={deleteLoading === user.id || user.id === currentUser?.id}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-fast font-heading font-medium"
                                    title={user.id === currentUser?.id ? "Cannot delete your own account" : "Delete user"}
                                  >
                                    {deleteLoading === user.id ? (
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
                      <Users className="w-16 h-16 text-oslo-gray mx-auto mb-4" />
                      <h3 className="text-xl font-heading font-semibold text-river-bed mb-2">
                        {searchTerm || roleFilter !== 'all'
                          ? 'No Users Found'
                          : 'No Users'}
                      </h3>
                      <p className="text-oslo-gray">
                        {searchTerm || roleFilter !== 'all'
                          ? 'Try adjusting your filters or search terms.'
                          : 'Users will appear here once they register.'}
                      </p>
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Summary Stats */}
            {!loading && !error && users.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Total Users</p>
                    <p className="text-2xl font-heading font-bold text-river-bed">
                      {users.length}
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Regular Users</p>
                    <p className="text-2xl font-heading font-bold text-blue-600">
                      {users.filter(u => u.role === 'user').length}
                    </p>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <p className="text-sm text-oslo-gray mb-1">Admins</p>
                    <p className="text-2xl font-heading font-bold text-purple-600">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-geyser px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">
                Edit User
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-oslo-gray hover:text-river-bed transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6">
              {/* First Name */}
              <div className="mb-4">
                <label htmlFor="edit_first_name" className="block text-sm font-medium text-river-bed mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  id="edit_first_name"
                  name="first_name"
                  placeholder="Enter first name"
                  value={editFormData.first_name}
                  onChange={handleEditInputChange}
                  error={editFormErrors.first_name}
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label htmlFor="edit_last_name" className="block text-sm font-medium text-river-bed mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="edit_last_name"
                  name="last_name"
                  placeholder="Enter last name"
                  value={editFormData.last_name}
                  onChange={handleEditInputChange}
                  error={editFormErrors.last_name}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="edit_email" className="block text-sm font-medium text-river-bed mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  id="edit_email"
                  name="email"
                  placeholder="Enter email address"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  error={editFormErrors.email}
                />
              </div>

              {/* Role */}
              <div className="mb-6">
                <label htmlFor="edit_role" className="block text-sm font-medium text-river-bed mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="edit_role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-fast ${
                      editFormErrors.role
                        ? 'border-red-500'
                        : 'border-geyser'
                    } focus:outline-none focus:[box-shadow:0_0_0_2px_#80b3b4] text-river-bed bg-white`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {editFormErrors.role && (
                  <p className="mt-1 text-sm text-red-500">{editFormErrors.role}</p>
                )}
                <p className="mt-2 text-sm text-oslo-gray">
                  <span className="font-semibold">Note:</span> Changing a user's role to Admin will give them full access to the admin dashboard and all management features.
                </p>
                {editingUser.id === currentUser?.id && editFormData.role !== 'admin' && (
                  <p className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                    <span className="font-semibold">Warning:</span> You are removing admin access from your own account. Make sure another admin can restore your access if needed.
                  </p>
                )}
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
                  text={editLoading ? 'Updating...' : 'Update User'}
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

export default UsersManager;

