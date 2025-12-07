import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { register } from '../services/authService';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    
    // Clear error for this field when user starts typing
    const newErrors = { ...errors };
    
    // Real-time validation for email format
    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = '';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          newErrors.email = 'Invalid email format';
        } else {
          newErrors.email = '';
        }
      }
    }

    // Real-time validation for password match
    if (name === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword = '';
      } else if (value !== updatedFormData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        newErrors.confirmPassword = '';
      }
    }

    // Also validate password match when password field changes
    if (name === 'password') {
      if (updatedFormData.confirmPassword) {
        if (value !== updatedFormData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          newErrors.confirmPassword = '';
        }
      }
    }

    // Clear error for other fields
    if (name !== 'email' && name !== 'confirmPassword' && name !== 'password') {
      newErrors[name] = '';
    }

    setErrors(newErrors);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await register({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      // Registration successful
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in to continue.' 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error types
      if (error.response?.status === 409) {
        setErrors({ email: 'Email already registered' });
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || 'Invalid registration data';
        // Try to map error to specific field
        if (errorMessage.includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ submit: errorMessage });
        }
      } else if (!error.response) {
        setErrors({ submit: 'Unable to connect to the server. Please check your connection.' });
      } else {
        setErrors({ submit: error.response.data?.error || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center">
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Side - Football GIF */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <img 
            src="/videos/football-gif.gif" 
            alt="Football animation" 
            className="max-w-full h-auto max-h-[80vh] object-contain"
          />
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="max-w-xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-river-bed mb-4">
                Sign Up
              </h1>
              <p className="text-lg text-oslo-gray">
                Create a new account to get started
              </p>
            </div>

            <Card>
              {success ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg 
                      className="w-16 h-16 mx-auto text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-river-bed mb-2">
                    Registration Successful!
                  </h2>
                  <p className="text-oslo-gray mb-4">
                    Redirecting to login page...
                  </p>
                  <LoadingSpinner size="sm" message="Redirecting..." />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-river-bed mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="Enter your first name"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={errors.first_name}
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-river-bed mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Enter your last name"
                        value={formData.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-river-bed mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                  </div>

                  {/* Password and Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-river-bed mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password (min. 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-river-bed mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                      />
                    </div>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    text="Create Account"
                    variant="ripple"
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    className="w-full"
                  />

                  {/* Login Link */}
                  <div className="text-center pt-4 border-t border-geyser">
                    <p className="text-sm text-oslo-gray">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-gulf-stream hover:underline font-medium"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

