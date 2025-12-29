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
  Trophy,
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
import { fetchMatches } from '../../services/matchesService';
import api from '../../services/api';
import colors from '../../styles/design-tokens/colors';

function MatchesManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    team1_name: '',
    team1_image_url: '',
    team2_name: '',
    team2_image_url: '',
    match_date: '',
    tournament: '',
    venue: '',
    matchday: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editFormData, setEditFormData] = useState({
    team1_name: '',
    team1_image_url: '',
    team2_name: '',
    team2_image_url: '',
    match_date: '',
    tournament: '',
    venue: '',
    matchday: ''
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  
  // Image upload states
  const [selectedTeam1Image, setSelectedTeam1Image] = useState(null);
  const [team1ImagePreview, setTeam1ImagePreview] = useState(null);
  const [selectedTeam2Image, setSelectedTeam2Image] = useState(null);
  const [team2ImagePreview, setTeam2ImagePreview] = useState(null);
  const [uploadingTeam1Image, setUploadingTeam1Image] = useState(false);
  const [uploadingTeam2Image, setUploadingTeam2Image] = useState(false);
  
  // Edit image upload states
  const [selectedEditTeam1Image, setSelectedEditTeam1Image] = useState(null);
  const [editTeam1ImagePreview, setEditTeam1ImagePreview] = useState(null);
  const [selectedEditTeam2Image, setSelectedEditTeam2Image] = useState(null);
  const [editTeam2ImagePreview, setEditTeam2ImagePreview] = useState(null);
  const [uploadingEditTeam1Image, setUploadingEditTeam1Image] = useState(false);
  const [uploadingEditTeam2Image, setUploadingEditTeam2Image] = useState(false);

  // Check if a route is active
  const isActive = (path) => {
    const current = location.pathname.split('?')[0].replace(/\/+$/,'');
    const target = path.replace(/\/+$/,'');
    return current === target;
  };

  // Fetch matches
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMatches();
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setError('Failed to load matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // Delete match
  const handleDelete = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(matchId);
      await api.delete(`/matches/${matchId}`);
      
      // Remove match from list
      setMatches(matches.filter(match => match.id !== matchId));
    } catch (err) {
      console.error('Failed to delete match:', err);
      alert(err.response?.data?.error || 'Failed to delete match. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle team1 image change
  const handleTeam1ImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          team1_image: 'Please select a valid image file'
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          team1_image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedTeam1Image(file);
      setFormErrors(prev => ({
        ...prev,
        team1_image: ''
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeam1ImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle team2 image change
  const handleTeam2ImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          team2_image: 'Please select a valid image file'
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          team2_image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedTeam2Image(file);
      setFormErrors(prev => ({
        ...prev,
        team2_image: ''
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeam2ImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData);
      // Get the base URL without /api since static files are served at root level
      let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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

    if (!formData.team1_name.trim()) {
      errors.team1_name = 'Team 1 name is required';
    }

    if (!formData.team2_name.trim()) {
      errors.team2_name = 'Team 2 name is required';
    }

    if (!formData.match_date) {
      errors.match_date = 'Match date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleCreateMatch = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreateLoading(true);
      setFormErrors({});
      setUploadingTeam1Image(true);
      setUploadingTeam2Image(true);

      // Upload images if selected
      let team1ImageUrl = formData.team1_image_url.trim() || null;
      if (selectedTeam1Image) {
        try {
          team1ImageUrl = await uploadImage(selectedTeam1Image);
        } catch (error) {
          setFormErrors({ submit: error.message });
          setUploadingTeam1Image(false);
          setUploadingTeam2Image(false);
          setCreateLoading(false);
          return;
        }
      }

      let team2ImageUrl = formData.team2_image_url.trim() || null;
      if (selectedTeam2Image) {
        try {
          team2ImageUrl = await uploadImage(selectedTeam2Image);
        } catch (error) {
          setFormErrors({ submit: error.message });
          setUploadingTeam1Image(false);
          setUploadingTeam2Image(false);
          setCreateLoading(false);
          return;
        }
      }

      setUploadingTeam1Image(false);
      setUploadingTeam2Image(false);

      const payload = {
        team1_name: formData.team1_name.trim(),
        team1_image_url: team1ImageUrl,
        team2_name: formData.team2_name.trim(),
        team2_image_url: team2ImageUrl,
        match_date: formData.match_date,
        tournament: formData.tournament.trim() || null,
        venue: formData.venue.trim() || null,
        matchday: formData.matchday.trim() || null
      };

      const response = await api.post('/matches', payload);

      // Reset form and close modal
      setFormData({
        team1_name: '',
        team1_image_url: '',
        team2_name: '',
        team2_image_url: '',
        match_date: '',
        tournament: '',
        venue: '',
        matchday: ''
      });
      setSelectedTeam1Image(null);
      setTeam1ImagePreview(null);
      setSelectedTeam2Image(null);
      setTeam2ImagePreview(null);
      setShowCreateModal(false);

      // Refresh matches list
      const data = await fetchMatches();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to create match:', err);
      if (err.response?.status === 400) {
        setFormErrors({ submit: err.response.data?.error || 'Invalid match data' });
      } else {
        setFormErrors({ submit: err.response?.data?.error || 'Failed to create match. Please try again.' });
      }
    } finally {
      setCreateLoading(false);
      setUploadingTeam1Image(false);
      setUploadingTeam2Image(false);
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      team1_name: '',
      team1_image_url: '',
      team2_name: '',
      team2_image_url: '',
      match_date: '',
      tournament: '',
      venue: '',
      matchday: ''
    });
    setSelectedTeam1Image(null);
    setTeam1ImagePreview(null);
    setSelectedTeam2Image(null);
    setTeam2ImagePreview(null);
    setFormErrors({});
  };

  // Open edit modal with match data
  const handleOpenEditModal = (match) => {
    setEditingMatch(match);
    setEditFormData({
      team1_name: match.team1_name || '',
      team1_image_url: match.team1_image_url || '',
      team2_name: match.team2_name || '',
      team2_image_url: match.team2_image_url || '',
      match_date: match.match_date ? new Date(match.match_date).toISOString().slice(0, 16) : '',
      tournament: match.tournament || '',
      venue: match.venue || '',
      matchday: match.matchday || ''
    });
    setEditTeam1ImagePreview(match.team1_image_url || null);
    setEditTeam2ImagePreview(match.team2_image_url || null);
    setSelectedEditTeam1Image(null);
    setSelectedEditTeam2Image(null);
    setEditFormErrors({});
    setShowEditModal(true);
  };

  // Handle edit team1 image change
  const handleEditTeam1ImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setEditFormErrors(prev => ({
          ...prev,
          team1_image: 'Please select a valid image file'
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setEditFormErrors(prev => ({
          ...prev,
          team1_image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedEditTeam1Image(file);
      setEditFormErrors(prev => ({
        ...prev,
        team1_image: ''
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditTeam1ImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit team2 image change
  const handleEditTeam2ImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setEditFormErrors(prev => ({
          ...prev,
          team2_image: 'Please select a valid image file'
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setEditFormErrors(prev => ({
          ...prev,
          team2_image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedEditTeam2Image(file);
      setEditFormErrors(prev => ({
        ...prev,
        team2_image: ''
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditTeam2ImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

    if (!editFormData.team1_name.trim()) {
      errors.team1_name = 'Team 1 name is required';
    }

    if (!editFormData.team2_name.trim()) {
      errors.team2_name = 'Team 2 name is required';
    }

    if (!editFormData.match_date) {
      errors.match_date = 'Match date is required';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit form submission
  const handleUpdateMatch = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    try {
      setEditLoading(true);
      setEditFormErrors({});
      setUploadingEditTeam1Image(true);
      setUploadingEditTeam2Image(true);

      // Upload images if selected
      let team1ImageUrl = editFormData.team1_image_url;
      if (selectedEditTeam1Image) {
        try {
          team1ImageUrl = await uploadImage(selectedEditTeam1Image);
        } catch (error) {
          setEditFormErrors({ submit: error.message });
          setUploadingEditTeam1Image(false);
          setUploadingEditTeam2Image(false);
          setEditLoading(false);
          return;
        }
      }

      let team2ImageUrl = editFormData.team2_image_url;
      if (selectedEditTeam2Image) {
        try {
          team2ImageUrl = await uploadImage(selectedEditTeam2Image);
        } catch (error) {
          setEditFormErrors({ submit: error.message });
          setUploadingEditTeam1Image(false);
          setUploadingEditTeam2Image(false);
          setEditLoading(false);
          return;
        }
      }

      setUploadingEditTeam1Image(false);
      setUploadingEditTeam2Image(false);

      const payload = {
        team1_name: editFormData.team1_name.trim(),
        team1_image_url: team1ImageUrl || null,
        team2_name: editFormData.team2_name.trim(),
        team2_image_url: team2ImageUrl || null,
        match_date: editFormData.match_date,
        tournament: editFormData.tournament.trim() || null,
        venue: editFormData.venue.trim() || null,
        matchday: editFormData.matchday.trim() || null
      };

      const response = await api.put(`/matches/${editingMatch.id}`, payload);
      
      // Update the match in the list immediately
      if (response.data && response.data.match) {
        setMatches(prevMatches => 
          prevMatches.map(m => 
            m.id === editingMatch.id ? response.data.match : m
          )
        );
      } else {
        // Fallback: Refresh matches list
        const data = await fetchMatches();
        setMatches(Array.isArray(data) ? data : []);
      }

      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update match:', err);
      if (err.response?.status === 400) {
        setEditFormErrors({ submit: err.response.data?.error || 'Invalid match data' });
      } else {
        setEditFormErrors({ submit: err.response?.data?.error || 'Failed to update match. Please try again.' });
      }
    } finally {
      setEditLoading(false);
      setUploadingEditTeam1Image(false);
      setUploadingEditTeam2Image(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMatch(null);
    setEditFormData({
      team1_name: '',
      team1_image_url: '',
      team2_name: '',
      team2_image_url: '',
      match_date: '',
      tournament: '',
      venue: '',
      matchday: ''
    });
    setSelectedEditTeam1Image(null);
    setEditTeam1ImagePreview(null);
    setSelectedEditTeam2Image(null);
    setEditTeam2ImagePreview(null);
    setEditFormErrors({});
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filter matches based on search term
  const filteredMatches = matches.filter(match => {
    const searchLower = searchTerm.toLowerCase();
    return (
      match.team1_name?.toLowerCase().includes(searchLower) ||
      match.team2_name?.toLowerCase().includes(searchLower) ||
      match.tournament?.toLowerCase().includes(searchLower) ||
      match.venue?.toLowerCase().includes(searchLower)
    );
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-river-bed mb-4">Access Denied</h1>
          <p className="text-oslo-gray mb-4">You need admin privileges to access this page.</p>
          <Button
            text="Go Back"
            variant="slide-arrow"
            primaryColor={colors['gulf-stream']}
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-geyser flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-geyser transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-4 border-b border-geyser flex items-center justify-between">
          <h2 className={`font-heading font-bold text-river-bed transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'}`}>
            Admin Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-geyser rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <LayoutDashboard size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Dashboard</span>
          </Link>
          <Link
            to="/admin/events"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/events') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <Calendar size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Events</span>
          </Link>
          <Link
            to="/admin/tournaments"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/tournaments') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <Trophy size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Tournaments</span>
          </Link>
          <Link
            to="/admin/matches"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/matches') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <Calendar size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Matches</span>
          </Link>
          <Link
            to="/admin/programs"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/programs') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <Package size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Programs</span>
          </Link>
          <Link
            to="/admin/registrations"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/registrations') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <FileText size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Registrations</span>
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-gulf-stream text-white' : 'text-river-bed hover:bg-geyser'}`}
          >
            <User size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Users</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-geyser">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-lg text-river-bed hover:bg-geyser transition-colors w-full"
          >
            <LogOut size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-heading font-bold text-river-bed mb-4 md:mb-0">Matches Management</h1>
            <Button
              text="Add Match"
              variant="slide-arrow"
              primaryColor={colors['gulf-stream']}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oslo-gray" size={20} />
              <Input
                type="text"
                placeholder="Search matches by team name, tournament, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Matches List */}
          {loading ? (
            <LoadingSpinner message="Loading matches..." />
          ) : error ? (
            <Card className="p-6">
              <p className="text-oslo-gray">{error}</p>
            </Card>
          ) : filteredMatches.length === 0 ? (
            <Card className="p-6">
              <p className="text-oslo-gray text-center">
                {searchTerm ? 'No matches found matching your search.' : 'No matches found. Create your first match!'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredMatches.map((match) => (
                <Card key={match.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Team 1 */}
                      <div className="flex flex-col items-center gap-2">
                        {match.team1_image_url ? (
                          <img
                            src={match.team1_image_url}
                            alt={match.team1_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-geyser"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                            <span className="text-2xl">⚽</span>
                          </div>
                        )}
                        <span className="text-sm font-semibold text-river-bed text-center max-w-[100px] truncate">
                          {match.team1_name}
                        </span>
                      </div>
                      
                      <div className="text-2xl font-bold text-river-bed">VS</div>
                      
                      {/* Team 2 */}
                      <div className="flex flex-col items-center gap-2">
                        {match.team2_image_url ? (
                          <img
                            src={match.team2_image_url}
                            alt={match.team2_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-geyser"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-geyser flex items-center justify-center">
                            <span className="text-2xl">⚽</span>
                          </div>
                        )}
                        <span className="text-sm font-semibold text-river-bed text-center max-w-[100px] truncate">
                          {match.team2_name}
                        </span>
                      </div>
                      
                      <div className="flex-1 ml-4">
                        <div className="text-sm text-oslo-gray mb-1">
                          {match.tournament && <span className="uppercase">{match.tournament}</span>}
                          {match.matchday && <span> • {match.matchday}</span>}
                        </div>
                        <div className="text-sm font-bold text-river-bed mb-1">
                          {formatDate(match.match_date)}
                        </div>
                        {match.venue && (
                          <div className="text-sm text-oslo-gray flex items-center gap-1">
                            <MapPin size={14} />
                            {match.venue}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(match)}
                        className="p-2 text-gulf-stream hover:bg-geyser rounded transition-colors"
                        aria-label="Edit match"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(match.id)}
                        disabled={deleteLoading === match.id}
                        className="p-2 text-red-600 hover:bg-geyser rounded transition-colors disabled:opacity-50"
                        aria-label="Delete match"
                      >
                        {deleteLoading === match.id ? (
                          <LoadingSpinner message="" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Match Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-geyser flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">Create New Match</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-geyser rounded transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateMatch} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team 1 */}
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 1 Name *</label>
                  <Input
                    type="text"
                    name="team1_name"
                    value={formData.team1_name}
                    onChange={handleInputChange}
                    placeholder="Enter team 1 name"
                    className={formErrors.team1_name ? 'border-red-500' : ''}
                  />
                  {formErrors.team1_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.team1_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 1 Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeam1ImageChange}
                    className="w-full text-sm text-oslo-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-geyser file:text-river-bed hover:file:bg-gulf-stream hover:file:text-white"
                  />
                  {team1ImagePreview && (
                    <img src={team1ImagePreview} alt="Team 1 preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
                  )}
                  {formErrors.team1_image && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.team1_image}</p>
                  )}
                </div>
                
                {/* Team 2 */}
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 2 Name *</label>
                  <Input
                    type="text"
                    name="team2_name"
                    value={formData.team2_name}
                    onChange={handleInputChange}
                    placeholder="Enter team 2 name"
                    className={formErrors.team2_name ? 'border-red-500' : ''}
                  />
                  {formErrors.team2_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.team2_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 2 Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeam2ImageChange}
                    className="w-full text-sm text-oslo-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-geyser file:text-river-bed hover:file:bg-gulf-stream hover:file:text-white"
                  />
                  {team2ImagePreview && (
                    <img src={team2ImagePreview} alt="Team 2 preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
                  )}
                  {formErrors.team2_image && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.team2_image}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-river-bed mb-2">Match Date & Time *</label>
                <Input
                  type="datetime-local"
                  name="match_date"
                  value={formData.match_date}
                  onChange={handleInputChange}
                  className={formErrors.match_date ? 'border-red-500' : ''}
                />
                {formErrors.match_date && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.match_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-river-bed mb-2">Tournament</label>
                <Input
                  type="text"
                  name="tournament"
                  value={formData.tournament}
                  onChange={handleInputChange}
                  placeholder="e.g., La Liga, UEFA Champions League"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Venue</label>
                  <Input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    placeholder="e.g., Estadio La Cartuja de Sevilla"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Matchday</label>
                  <Input
                    type="text"
                    name="matchday"
                    value={formData.matchday}
                    onChange={handleInputChange}
                    placeholder="e.g., Matchday 15"
                  />
                </div>
              </div>
              
              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formErrors.submit}
                </div>
              )}
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-river-bed hover:bg-geyser rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || uploadingTeam1Image || uploadingTeam2Image}
                  className="px-4 py-2 bg-gulf-stream text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {createLoading || uploadingTeam1Image || uploadingTeam2Image ? 'Creating...' : 'Create Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {showEditModal && editingMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-geyser flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-river-bed">Edit Match</h2>
              <button
                onClick={handleCloseEditModal}
                className="p-2 hover:bg-geyser rounded transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateMatch} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team 1 */}
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 1 Name *</label>
                  <Input
                    type="text"
                    name="team1_name"
                    value={editFormData.team1_name}
                    onChange={handleEditInputChange}
                    placeholder="Enter team 1 name"
                    className={editFormErrors.team1_name ? 'border-red-500' : ''}
                  />
                  {editFormErrors.team1_name && (
                    <p className="text-red-500 text-xs mt-1">{editFormErrors.team1_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 1 Image</label>
                  {editTeam1ImagePreview && (
                    <img src={editTeam1ImagePreview} alt="Team 1 preview" className="mb-2 w-16 h-16 rounded-full object-cover" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditTeam1ImageChange}
                    className="w-full text-sm text-oslo-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-geyser file:text-river-bed hover:file:bg-gulf-stream hover:file:text-white"
                  />
                  {editFormErrors.team1_image && (
                    <p className="text-red-500 text-xs mt-1">{editFormErrors.team1_image}</p>
                  )}
                </div>
                
                {/* Team 2 */}
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 2 Name *</label>
                  <Input
                    type="text"
                    name="team2_name"
                    value={editFormData.team2_name}
                    onChange={handleEditInputChange}
                    placeholder="Enter team 2 name"
                    className={editFormErrors.team2_name ? 'border-red-500' : ''}
                  />
                  {editFormErrors.team2_name && (
                    <p className="text-red-500 text-xs mt-1">{editFormErrors.team2_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Team 2 Image</label>
                  {editTeam2ImagePreview && (
                    <img src={editTeam2ImagePreview} alt="Team 2 preview" className="mb-2 w-16 h-16 rounded-full object-cover" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditTeam2ImageChange}
                    className="w-full text-sm text-oslo-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-geyser file:text-river-bed hover:file:bg-gulf-stream hover:file:text-white"
                  />
                  {editFormErrors.team2_image && (
                    <p className="text-red-500 text-xs mt-1">{editFormErrors.team2_image}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-river-bed mb-2">Match Date & Time *</label>
                <Input
                  type="datetime-local"
                  name="match_date"
                  value={editFormData.match_date}
                  onChange={handleEditInputChange}
                  className={editFormErrors.match_date ? 'border-red-500' : ''}
                />
                {editFormErrors.match_date && (
                  <p className="text-red-500 text-xs mt-1">{editFormErrors.match_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-river-bed mb-2">Tournament</label>
                <Input
                  type="text"
                  name="tournament"
                  value={editFormData.tournament}
                  onChange={handleEditInputChange}
                  placeholder="e.g., La Liga, UEFA Champions League"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Venue</label>
                  <Input
                    type="text"
                    name="venue"
                    value={editFormData.venue}
                    onChange={handleEditInputChange}
                    placeholder="e.g., Estadio La Cartuja de Sevilla"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-river-bed mb-2">Matchday</label>
                  <Input
                    type="text"
                    name="matchday"
                    value={editFormData.matchday}
                    onChange={handleEditInputChange}
                    placeholder="e.g., Matchday 15"
                  />
                </div>
              </div>
              
              {editFormErrors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {editFormErrors.submit}
                </div>
              )}
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-river-bed hover:bg-geyser rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading || uploadingEditTeam1Image || uploadingEditTeam2Image}
                  className="px-4 py-2 bg-gulf-stream text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {editLoading || uploadingEditTeam1Image || uploadingEditTeam2Image ? 'Updating...' : 'Update Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchesManager;

